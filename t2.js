var crypto = require("crypto");

function sha1(str) {
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}
let noncestr = 'Wm3WZYTPz0wzccnW',
    jsapi_ticket = this.session.jsapiTicket,
    timestamp = 1499044757,
    url = 'http://www.xubo.ren/auth/',
    string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
    signature = sha1(string1)

    console.log('signature :',signature);
    