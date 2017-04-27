var PORT = process.env.PORT || 3002;
var express = require('express');
var app = express();
var crypto = require('crypto');

app.get('/', function(req, res){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var token = 'bluewaitorweixin';
    var arr = [token, timestamp, nonce];
    arr.sort();
    var sha1 = crypto.createHash('sha1');
    var str = sha1.update(arr.join(""));

    if(str === signature) {
        return res.status(200).send(echostr);
    } else {
        return res.send("失败");
    }
});

app.listen(PORT, function(){
    console.log('app running at port ' + PORT);
})