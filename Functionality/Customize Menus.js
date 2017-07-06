"use strict"
const fs = require('fs')
const co = require('co')
const httpsRequest = require('./common').httpsRequest
const fetchAccessToken = require('./common').fetchAccessToken


exports.createMenu = function (postData) {
    /**
     * 放在函数内担心readFileSync内容被缓存，有机会验证下
     */
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
    //

    co(function* () {
        if (!access_token.timestamp || Date.now() - parseInt(access_token.timestamp) > 7100000) {
            let token = yield fetchAccessToken()
            access_token.access_token = token.access_token
            access_token.timestamp = Date.now()
            fs.writeFileSync('../config/access_token.txt', JSON.stringify(access_token))
        }
        let options = {
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: `/cgi-bin/menu/create?access_token=${access_token.access_token}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }
        let resVal = yield httpsRequest(options, postData)
        console.log(resVal.toString());
    })
    /**
     * experimental data
     */

    /*
    let postData = {
        "button": [{
                "name": "扫码",
                "sub_button": [{
                        "type": "scancode_waitmsg",
                        "name": "扫码带提示",
                        "key": "rselfmenu_0_0",
                    },
                    {
                        "type": "scancode_push",
                        "name": "扫码推事件",
                        "key": "rselfmenu_0_1",
                    }
                ]
            },
            {
                "name": "发图",
                "sub_button": [{
                        "type": "pic_sysphoto",
                        "name": "系统拍照发图",
                        "key": "rselfmenu_1_0",
                    },
                    {
                        "type": "pic_photo_or_album",
                        "name": "拍照或者相册发图",
                        "key": "rselfmenu_1_1",
                    },
                    {
                        "type": "pic_weixin",
                        "name": "微信相册发图",
                        "key": "rselfmenu_1_2",
                    }
                ]
            },
            {
                "name": "位置&授权",
                "sub_button": [{
                        "name": "发送位置",
                        "type": "location_select",
                        "key": "rselfmenu_2_0"
                    },
                    {
                        "type": "view",
                        "name": "授权",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx40d6bb4bd6340273&redirect_uri=http://www.xubo.ren/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
                    }
                ]
            }
        ]
    }
    */
}