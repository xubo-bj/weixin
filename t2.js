"use strict"
var crypto = require("crypto");

function sha1(str) {
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}
let noncestr = 'Wm3WZYTPz0wzccnW',
    jsapi_ticket = 'kgt8ON7yVITDhtdwci0qeR_Uf9bxN_DpMxWLSd6uzFYZzVdXK1BY74kIqCxBsT7N4I5_j17_bnrqiITjByQ9Nw',
    timestamp = 1499044757,
    url = 'http://www.xubo.ren/auth/',
    string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
    signature = sha1(string1)


var fs = require('fs')
var as = {
    a:1,
    b:3
}
fs.writeFileSync('./t.txt',JSON.stringify(as))

fs.writeFileSync('./t.txt',JSON.stringify(as))
fs.writeFileSync('./t.txt',JSON.stringify(as))
