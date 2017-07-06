"use strict"
const fs = require('fs')
const https = require('https');
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
        access_token = cache.access_token
    }
}
if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
    fetchAccessToken()
        .then(function (token) {
            let json = JSON.parse(token)
            access_token.access_token = json.access_token
            access_token.timestamp = Date.now()
            fs.writeFileSync('../config/access_token.txt')
        })
        .catch(function (err) {
            console.log('promise catch :', err);
        })
}
fetchAccessToken()
    .then(function (qrCode) {

    })
    .catch(function (e) {
        console.log('promise catch :', err);
    })

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
                resolve(temp_str)
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
        var options = {
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: `/cgi-bin/qrcode/create?access_token=${access_token["access_token"]}`,
            method: 'POST'
        }
        var req = https.request(options, res => {
            var temp_str = ''
            res.on('data', (d) => {
                temp_str += d
            });
            res.on('end', function () {
                resolve(temp_str)
            })
        })
        req.on('error', (e) => {
            reject(e)
        });
        let postData = {
            "expire_seconds": 604800,
            "action_name": "QR_SCENE",
            "action_info": {
                "scene": {
                    "scene_id": 123
                }
            }
        }
        req.write(JSON.stringify(postData))
        req.end();
    })
}