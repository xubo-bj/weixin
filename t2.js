"use strict"
const crypto = require("crypto");
const co  = require('co')

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

var t1 = new Promise(function(r1,r2){
    r1(5)
})
var t2 = new Promise(function(r1,r2){
    r1(6)
})
console.log('w 1');
setTimeout(function(){
t1.then(function(d){
    console.log(d);
},1)
})
t2.then(function(d){
    console.log(d);
})
console.log('w 2');
