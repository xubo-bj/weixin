"use strict"
const https = require('https');
var postData = {
    "button": [{
            "type": "view",
            "name": "url-1",
            "url": "http://www.soso.com/"
        },
        {
            "type": "view",
            "name": "url-2",
            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx40d6bb4bd6340273&redirect_uri=http://www.xubo.ren/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
        }
    ]
}
var options1 = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/token?grant_type=client_credential&appid=wx40d6bb4bd6340273&secret=eff808be65f47862a8d98e321218fde3',
    method: 'GET'
}
var req1 = https.request(options1, res1 => {


    var temp_str = ''
    res1.on('data', (d) => {
        temp_str += d
    });
    res1.on('end', function () {
        console.log('temp_str :', temp_str);
        console.log('--------');


        var options2 = {
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: `/cgi-bin/menu/create?access_token=${JSON.parse(temp_str).access_token}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(postData))
            }
        }
        var req = https.request(options2, (res) => {
            
            var str2 = ''
            res.on('data', (d) => {
                str2 += d
            });
            res.on('end', function () {
                console.log(str2);
            })
        });

        req.write(JSON.stringify(postData))
        req.end();
    })
})
req1.end()