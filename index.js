var PORT = process.env.PORT || 3002;
var express = require('express');
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var convert = require('xml-js');
var xml2js = require('xml2js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var token = 'bluewaitorweixin';
    var arr = [token, timestamp, nonce];
    arr.sort();
    var sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(""));

    if(sha1.digest('hex') === signature) {
        return res.status(200).send(echostr);
    } else {
        return res.send("失败");
    }
});

app.post('/', function(req, res){
    var buff = '';
    req.on('data', function(chunk){
        buff += chunk;
    });
    var jsonData = {};
    req.on('end', function(){
	xml2js.parseString(buff, function(err, json){
	    if(!err) {
 		jsonData = json.xml;
            }           
        });
    });   
});

app.listen(PORT, function(){
    console.log('app running at port ' + PORT);
})
