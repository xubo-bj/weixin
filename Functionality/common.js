const cfg = require('../config/weixin')
const https = require('https')
const contentType = require('content-type')
const getRawBody = require('raw-body')
let APPID = cfg.APPID
let APPSECRET = cfg.APPSECRET

exports.fetchAccessToken = function () {
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
exports.httpsRequest = function (options, postData) {
    return new Promise((resolve, reject) => {
        let req = https.request(options, res => {
            getRawBody(res, {
                length: res.headers['content-length'],
                limit: '1mb',
                encoding: contentType.parse(res).parameters.charset
            }, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
        req.on('error', (e) => {
            reject(e)
        });
        if (postData) {
            req.write(postData)
        }
        req.end();
    })
}