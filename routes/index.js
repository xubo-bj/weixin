"use strict"
var router = require('koa-router')();
var url = require("url");
var crypto = require("crypto");
const https = require('https');
var parseString = require('xml2js').parseString;

const APPID = 'wx40d6bb4bd6340273'
const APPSECRET = 'eff808be65f47862a8d98e321218fde3'

function sha1(str) {
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

router.get('/', function* (next) {
  var query = url.parse(this.req.url, true).query;
  //console.log("*** URL:" + req.url);
  console.log('query :', query);
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
  console.log("Original str : " + original);
  console.log("Signature : " + signature);
  var scyptoString = sha1(original);
  if (signature == scyptoString) {
    this.body = echostr
    console.log("Confirm and send echo back");
  } else {
    this.body = 'validation fail'
    console.log("Failed!");
  }
  // yield this.render('index', {
  //   title: 'Hello World Koa!'
  // });
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
    this.body = 'validation success'
    console.log("Success: Confirm and send echo back");
  } else {
    this.body = 'validation fail'
    console.log("Failed!");
  }
})


router.get('/auth', function* (next) {
  console.log('log refresh_token:', this.session.refresh_token);

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

  var fetchJsapi = function (access_token) {
    return new Promise(function (resolve, reject) {
      var options2 = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: `/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,
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


  var fetchUserInfo = function* (token, openid, token2) {

    var fetchUserInfoPromise = function () {
      return new Promise(function (resolve, reject) {
        console.log('log--- fetchUserInfoPromise token openid:', token, openid);

        var options1 = {
          hostname: 'api.weixin.qq.com',
          port: 443,
          path: `/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`,
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
    }

    var result = null

    if (arguments.length == 3) {
      console.log('arguments 3 ------------------');
      result = yield Promise.all([
        fetchUserInfoPromise(),
        fetchJsapi(token2)
      ])
      let t = JSON.parse(result[1])
      console.log('result[1] :',t);
      
      if (t.errcode == 0) {
        this.session.jsapiTicket = t.ticket
        this.session.jsapiTimestamp = Date.now()
      }
    }
    if (arguments.length == 2) {
      console.log('arguments 2 ------------------');

      let temp_1 = yield fetchUserInfoPromise(),
        temp_2 = JSON.stringify({
          ticket: this.session.jsapiTicket,
          timestamp: this.session.jsapiTimestamp
        })
      result = [temp_1, temp_2]
    }

    let noncestr = 'Wm3WZYTPz0wzccnW',
      jsapi_ticket = this.session.jsapiTicket,
      timestamp = (this.session.jsapiTimestamp+'').slice(0,-3),
      url = 'http://www.xubo.ren/auth/',
      string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
      signature = sha1(string1)


    try {
      console.log('log ---this.render');
      console.log('log ---signature:',jsapi_ticket)
      console.log('log ---timestamp:',timestamp);
      
      console.log('log ---string1:',string1);
      console.log('log ---signature:',signature);
      
      
      yield this.render('auth', {
        user: result[0],
        appId: APPID,
        timestamp,
        nonceStr: noncestr,
        signature,
        jsApiList: JSON.stringify(["onMenuShareTimeline"])
      })
    } catch (e) {
      console.log(e);

    }

  }.bind(this)


  var getRefreshToken = function* () {
    console.log('get Refresh ====================');

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



    console.log('jsapitTimestamp---------- :', this.session.jsapiTimestamp, this.session.jsapiTicket);
    var result = null
    if (!this.session.jsapiTimestamp || Date.now() - parseInt(this.session.jsapiTimestamp) > 7100000) {
      console.log('7100   true');
      console.log('7100   :',this.session.jsapiTimestamp);
      

      result = yield Promise.all([
        getRefreshTokenPromise(),
        fetchAccessTokenForJsapi()
      ])
    } else {
      console.log('7100   false');
      let temp_result = yield getRefreshTokenPromise()
      result = [temp_result]
    }



    var jsonResult = JSON.parse(result[0])
    this.session.refresh_token = jsonResult.refresh_token

    if (!jsonResult.access_token) {
      yield getRefreshToken()
    } else {
      if (result.length > 1) {
        yield fetchUserInfo(jsonResult.access_token, jsonResult.openid, JSON.parse(result[1]).access_token)
      } else {
        yield fetchUserInfo(jsonResult.access_token, jsonResult.openid)
      }
    }

  }.bind(this)

  var UseRefreshToken = function* () {
    console.log('use refresh  -------------------');


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
    console.log('log---jsapitTimestamp :', this.session.jsapiTimestamp, this.session.jsapiTicket);

    if (!this.session.jsapiTimestamp || Date.now() - parseInt(this.session.jsapiTimestamp) > 7100000) {

      console.log('7100   true');
      result = yield Promise.all([
        UseRefreshTokenPromise(),
        fetchAccessTokenForJsapi()
      ])
    } else {

      console.log('7100   false');
      let temp_result = yield UseRefreshTokenPromise()
      result = [temp_result]
    }


    var jsonResult = JSON.parse(result[0])
    if (!jsonResult.access_token) {
      yield getRefreshToken()
    } else {
      if (result.length > 1) {
        yield fetchUserInfo(jsonResult.access_token, jsonResult.openid, JSON.parse(result[1]).access_token)
      } else {
        yield fetchUserInfo(jsonResult.access_token, jsonResult.openid)
      }
    }
  }.bind(this)

  console.log('auth -----------------------');

  if (this.session.refresh_token) {
    yield UseRefreshToken()
  } else {
    yield getRefreshToken()
  }

})






router.get('/foo', function* (next) {
  yield this.render('index', {
    title: 'Hello World foo!'
  });
});

module.exports = router;