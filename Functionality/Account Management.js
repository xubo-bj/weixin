"use strict"
const fs = require('fs')
const https = require('https');
const co = require('co')
const cfg = require('../config/weixin')
let APPID = cfg.APPID
let APPSECRET = cfg.APPSECRET

let cache = fs.readFileSync('../config/access_token.txt')
let access_token = {
    access_token: null,
    timestamp: null
}
if (Buffer.byteLength(cache) !== 0) {
    cache = JSON.parse(cache.toString())
    if (cache.access_token) {
        access_token = cache
    }
}

co(function* () {
    if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
        console.log('fetch new access_token');

        try {
            let json = yield fetchAccessToken()
            access_token.access_token = json.access_token
            access_token.timestamp = Date.now()
            fs.writeFileSync('../config/access_token.txt', JSON.stringify(access_token))
        } catch (e) {
            console.log('fetchAccessToken :', e);

        }
    }

    try {
        let ticketData = yield fetchTmpQrCode()
        console.log('ticketData :', ticketData);

        let pic = yield downloadQrCodePic(ticketData)
        // console.log('pic',pic);
        
        fs.writeFileSync(`${Date.now()}.jpg`, pic)
    } catch (e) {
        console.log(e);

    }


    function fetchAccessToken() {
        return new Promise(function (resolve, reject) {
            let options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: `/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
                method: 'GET'
            }
            let req = https.request(options, res => {
                var temp_str = ''
                res.on('data', (d) => {
                    temp_str += d
                });
                res.on('end', function () {
                    resolve(JSON.parse(temp_str))
                })
            })
            req.on('error', (e) => {
                reject(e)
            });
            req.end();
        })
    }

    function fetchTmpQrCode() {
        return new Promise(function (resolve, reject) {
            let postData = {
                "expire_seconds": 604800,
                "action_name": "QR_SCENE",
                "action_info": {
                    "scene": {
                        "scene_id": 123
                    }
                }
            }
            let options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: `/cgi-bin/qrcode/create?access_token=${access_token["access_token"]}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(postData))
                }

            }
            var req = https.request(options, res => {
                var temp_str = ''
                res.on('data', (d) => {
                    temp_str += d
                });
                res.on('end', function () {
                    resolve(JSON.parse(temp_str))
                })
            })
            req.on('error', (e) => {
                reject(e)
            });
            req.write(JSON.stringify(postData))
            req.end();
        })
    }

    function downloadQrCodePic(qrCode) {
        console.log(typeof qrCode.ticket);
    

        return new Promise(function (resolve, reject) {
            let options = {
                hostname: 'mp.weixin.qq.com',
                port: 443,
                path: `/cgi-bin/showqrcode?ticket=${encodeURI(qrCode.ticket)}`,
                method: 'GET'
            }
            let req = https.request(options, res => {
                var temp= []
                res.on('data', (d) => {
                    temp.push(d)
                });
                res.on('end', function () {
                    resolve(Buffer.concat(temp))
                })
            })
            req.on('error', (e) => {
                reject(e)
            });
            req.end();
            
        })
    }
})