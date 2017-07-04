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

https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx40d6bb4bd6340273&redirect_uri=http://www.xubo.ren/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect

https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx40d6bb4bd6340273&secret=eff808be65f47862a8d98e321218fde3&code=031T1aed2peX5C0IT5ed2oFsed2T1aeJ&grant_type=authorization_code 


获取第二步的refresh_token后，请求以下链接获取access_token：  

https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN 

09d229843abe82ee87efdc61c9b383cda5123457
09d229843abe82ee87efdc61c9b383cda5123457


jsapi_ticket=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&noncestr=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&timestamp=1499044757&url=http://www.xubo.ren/auth/
jsapi_ticket=kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw&noncestr=Wm3WZYTPz0wzccnW&timestamp=1499044757&url=http://www.xubo.ren/auth/

appID
wx40d6bb4bd6340273
appsecret
eff808be65f47862a8d98e321218fde3

0836
access_tocken
zdMJCmgz3qLg4DrpEQ6W0xV0IhXpcq14qAKqj1-SRS0t3iBZ2ZXInRxyz_lpYpBAFKFRMdngKhfczLdOva7xAgp_s0ZrYSf0GLWouQZFMOcJOer5g4qadu2wrO-h9E2kYLFcABASFZ
jspai_ticket
kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw