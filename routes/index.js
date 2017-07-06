"use strict"
var router = require('koa-router')();
var url = require("url");
var crypto = require("crypto");
const https = require('https');
var parseString = require('xml2js').parseString;
var fs = require('fs')

const APPID = 'wx40d6bb4bd6340273'
const APPSECRET = 'eff808be65f47862a8d98e321218fde3'

console.log('log --- everytime ?? everytime?? ever');
console.log('log --- everytime ?? everytime?? ever');
console.log('log --- everytime ?? everytime?? ever');


let access_token = {
    access_token: null,
    timestamp: null
  },
  jsapi = {
    ticket: null,
    timestamp: null
  }

let jsapi_txt = fs.readFileSync('./config/jsapi.txt')
let access_token_txt = fs.readFileSync('./config/access_token.txt')

if (Buffer.byteLength(jsapi_txt) !== 0) {
  jsapi = JSON.parse(jsapi_txt)
}
if (Buffer.byteLength(access_token_txt) !== 0) {
  access_token = JSON.parse(access_token_txt)
}




function sha1(str) {
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

router.get('/', function* (next) {
  var query = url.parse(this.req.url, true).query;
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = "xubo" //这里是你在微信开发者中心页面里填的token，而不是****
  oriArray.sort();
  var original = oriArray.join('');
  var scyptoString = sha1(original);
  if (signature == scyptoString) {
    this.body = echostr
    console.log("Confirm and send echo back");
  } else {
    this.body = 'validation fail'
    console.log("Failed!");
  }
});
router.post('/', function* (next) {

  console.log(`log post '/' Why receive this always ??? `)

  var query = url.parse(this.req.url, true).query;
  var signature = query.signature;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = "xubo" //这里是你在微信开发者中心页面里填的token，而不是****
  oriArray.sort();
  var original = oriArray.join('');
  var scyptoString = sha1(original);
  if (signature == scyptoString) {
    console.log("Success: Confirm and send echo back");
    let data = '',
      body = null
    try {
      body = yield new Promise((resovle, reject) => {
        this.req.on('data', d => {
          data += d
        })
        this.req.on('end', () => {
          resovle(data)
        })
      })

    } catch (e) {
      console.log('catch error :', e);
    }
    console.log('raw-body :',body);
    

    let s1 = yield new Promise((resolve, reject) => {
      //同步的应该可以不用Promise,但出错了...
      parseString(body, {
        async: false
      }, function (err, result) {
        resolve(result)
      });
    })

    var str = ''
    /*
        var str = `<xml>
     <ToUserName><![CDATA[${s1.xml.FromUserName}]]></ToUserName>
     <FromUserName><![CDATA[${s1.xml.ToUserName}]]></FromUserName>
     <CreateTime>${s1.xml.CreateTime}</CreateTime>
     <MsgType><![CDATA[${s1.xml.MsgType}]]></MsgType>
    <MediaId><![CDATA[${s1.xml.MediaId}]]></MediaId>
    <Format><![CDATA[${s1.xml.Format}]]></Format>
    <Recognition><![CDATA[腾讯微信团队]]></Recognition>
     <MsgId>${s1.xml.MsgId}</MsgId>
     </xml>`
     */
    this.body = str


  } else {
    this.body = 'validation fail'
    console.log("Failed!");
  }
})


router.get('/auth', function* (next) {
  console.log('cache --------------- ');

  console.log('access_token :', access_token);
  console.log('jsapi: ', jsapi);
  console.log('session:', this.session);


  console.log('--------------- cache ');


  var fetchAccessTokenForJsapi = function () {
    return new Promise(function (resolve, reject) {
      var options2 = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: `/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
        method: 'GET'
      }
      var req = https.request(options2, res => {

        var temp_str = ''
        res.on('data', (d) => {
          temp_str += d
        });
        res.on('end', function () {
          resolve(temp_str)
        })
      })
      req.end();
    })
  }.bind(this)

  var fetchJsapiPromise = function () {
    return new Promise(function (resolve, reject) {
      var options2 = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: `/cgi-bin/ticket/getticket?access_token=${access_token.access_token}&type=jsapi`,
        method: 'GET'
      }
      var req = https.request(options2, res => {

        var temp_str = ''
        res.on('data', (d) => {
          temp_str += d
        });
        res.on('end', function () {
          resolve(temp_str)
        })
      })
      req.end();
    })
  }.bind(this)


  var fetchUserInfo = function* () {

    var fetchUserInfoPromise = function () {
      return new Promise((resolve, reject) => {

        var options1 = {
          hostname: 'api.weixin.qq.com',
          port: 443,
          path: `/sns/userinfo?access_token=${this.session.auth_token}&openid=${this.session.openid}&lang=zh_CN`,
          method: 'GET'
        };
        var req = https.request(options1, res => {
          var temp_str = ''
          res.on('data', (d) => {
            temp_str += d
          });
          res.on('end', function () {
            resolve(temp_str)
          })
        })
        req.end();
      })
    }.bind(this)


    var user = null
    if (!jsapi.timestamp || Date.now - parseInt(jsapi.timestamp) > 7100000) {
      user = yield Promise.all([
        fetchUserInfoPromise(),
        fetchJsapiPromise()
      ])
      let r0 = JSON.parse(user[0])
      let r1 = JSON.parse(user[1])
      console.log('jsapi assignment :', jsapi);

      jsapi.ticket = r1.ticket
      jsapi.timestamp = Date.now()
      try {
        fs.writeFileSync('./config/jsapi.txt', JSON.stringify(jsapi))
      } catch (e) {
        console.log('writeFileSync error :', e);
      }
      user = r0
    } else {
      user = yield fetchUserInfoPromise()
      user = JSON.parse(user)
    }




    yield this.render('auth')

  }.bind(this)


  var getRefreshToken = function* () {

    var getRefreshTokenPromise = function () {
      let options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: `/sns/oauth2/access_token?appid=wx40d6bb4bd6340273&secret=eff808be65f47862a8d98e321218fde3&code=${this.query.code}&grant_type=authorization_code`,
        method: 'GET'
      };
      return new Promise(function (resolve, reject) {
        var req = https.request(options, res => {

          var temp_str = ''
          res.on('data', (d) => {
            temp_str += d
          });
          res.on('end', function () {
            resolve(temp_str)
          })
        })
        req.end();
      })
    }.bind(this)

    var UseRefreshTokenPromise = function () {
      let options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: `/sns/oauth2/refresh_token?appid=wx40d6bb4bd6340273&grant_type=refresh_token&refresh_token=${this.session.refresh_token}`,
        method: 'GET'
      };
      return new Promise(function (resolve, reject) {
        var req = https.request(options, res => {
          var temp_str = ''
          res.on('data', (d) => {
            temp_str += d
          });
          res.on('end', function () {
            resolve(temp_str)
          })
        })
        req.end();
      })
    }.bind(this)

    var result = null

    if (!this.session.refresh_token || Date.now() - parseInt(this.session.refresh_token_timestamp) > 2592000000) {
      if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
        console.log('1111111111111');
        result = yield Promise.all([
          getRefreshTokenPromise(),
          fetchAccessTokenForJsapi()
        ])
        let r1 = JSON.parse(result[1])
        access_token.access_token = r1.access_token
        access_token.timestamp = Date.now()
        fs.writeFileSync('./config/access_token.txt', JSON.stringify(access_token))
      } else {
        console.log('222222222222222222');
        result = yield getRefreshTokenPromise()
        result = [result]
      }
      let r0 = JSON.parse(result[0])
      let t = Date.now()
      this.session.auth_token = r0.access_token
      this.session.auth_token_timestamp = t
      this.session.refresh_token = r0.refresh_token
      this.session.refresh_token_timestamp = t
      this.session.openid = r0.openid
    } else {
      if (this.session.auth_token_timestamp && Date.now - parseInt(this.session.auth_token_timestamp) > 710000) {
        if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
          console.log('33333333333333333333');
          result = yield Promise.all([
            UseRefreshTokenPromise(),
            fetchAccessTokenForJsapi()
          ])
          let r1 = JSON.parse(result[1])
          access_token.access_token = r1.access_token
          access_token.timestamp = Date.now()
          fs.writeFileSync('./config/access_token.txt', JSON.stringify(access_token))
        } else {
          console.log('44444444444444444');
          result = yield UseRefreshTokenPromise(),
            result = [result]
        }
        let r0 = JSON.parse(result[0])
        let t = Date.now()
        this.session.auth_token = r0.access_token
        this.session.auth_token_timestamp = t
        this.session.openid = r0.openid
      } else {
        if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
          console.log('55555555555555555');
          result = yield fetchAccessTokenForJsapi()
          let r1 = JSON.parse(result)
          access_token.access_token = r1.access_token
          access_token.timestamp = Date.now()
          fs.writeFileSync('./config/access_token.txt', JSON.stringify(access_token))
        } else {
          console.log('666666666666666');
        }
      }
    }
  }.bind(this)


  yield getRefreshToken()
  yield fetchUserInfo()

})
router.post('/auth', function* (next) {
  console.log('log --- post auth :', this.request.body);


  let noncestr = 'Wm3WZYTPz0wzccnW',
    jsapi_ticket = jsapi.ticket,
    timestamp = (jsapi.timestamp + '').slice(0, -3),
    url = this.request.body.url,
    string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
    signature = sha1(string1)

  this.body = {
    appId: APPID,
    timestamp,
    nonceStr: noncestr,
    signature,
  }

})






router.get('/foo', function* (next) {
  yield this.render('index', {
    title: 'Hello World foo!'
  });
});

module.exports = router;