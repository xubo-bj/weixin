var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
    var str = `<xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[this is a test]]></Content>
 <MsgId>1234567890123456</MsgId>
 </xml>`
parseString(str, function (err, result) {
    console.dir(result);
});

            /*
            wx.config({
                debug: true,
                appId: "<%= appId %>",
                timestamp: <%= timestamp %>,
                nonceStr: "<%= nonceStr %>",
                signature: "<%= signature %>",
                jsApiList: ["onMenuShareTimeline"]
            });
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                alert('config success "<%= appId %>"')
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                alert('error: ', res.toString())
            });
            */

https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx40d6bb4bd6340273&redirect_uri=http://www.xubo.ren/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
f9f53fb4ae92f7ab1facd3a2ff1af4fa23f6996d
f9f53fb4ae92f7ab1facd3a2ff1af4fa23f6996d


获取第二步的refresh_token后，请求以下链接获取access_token：  

https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN 

f4e_EP4z--62o2twCLCMkDhBh1DCTFhLAb9L8S6a-At_guZFLnRgCzU59arzzAISoE95MtsUSs5EI7TVBPqW31TUQaYPXix4uSuYUwu6go815Os2MTn5Ci8MebAJXfipTYUcAGAOTP

jsapi_ticket=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&noncestr=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&timestamp=1499044757&url=http://www.xubo.ren/auth/
jsapi_ticket=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&noncestr=Wm3WZYTPz0wzccnW&timestamp=1499044757&url=http://www.xubo.ren/auth/

appID
wx40d6bb4bd6340273
appsecret
eff808be65f47862a8d98e321218fde3

access_tocken
zdMJCmgz3qLg4DrpEQ6W0xV0IhXpcq14qAKqj1-SRS0t3iBZ2ZXInRxyz_lpYpBAFKFRMdngKhfczLdOva7xAgp_s0ZrYSf0GLWouQZFMOcJOer5g4qadu2wrO-h9E2kYLFcABASFZ
jspai_ticket
kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw