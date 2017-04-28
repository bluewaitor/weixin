var PORT = process.env.PORT || 3002;
var express = require('express');
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var convert = require('xml-js');
var xml2js = require('xml2js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var token = 'bluewaitorweixin';
    var arr = [token, timestamp, nonce];
    arr.sort();
    var sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(""));

    if (sha1.digest('hex') === signature) {
        return res.status(200).send(echostr);
    } else {
        return res.send("失败");
    }
});

app.post('/', function (req, res) {
    var buff = '';
    req.on('data', function (chunk) {
        buff += chunk;
    });
    var jsonData = {};
    req.on('end', function () {
        //         buff = `<xml>
        //     <ToUserName><![CDATA[gh_06e25e807cec]]></ToUserName>
        //     <FromUserName><![CDATA[omNc7wGDgkezcwQFn3CkOsOT9nFE]]></FromUserName>
        //     <CreateTime>1493350892</CreateTime>
        //     <MsgType><![CDATA[text]]></MsgType>
        //     <Content><![CDATA[悄悄]]></Content>
        //     <MsgId>6413893243389029753</MsgId>
        //     <Encrypt><![CDATA[j8brpvTz9rQ1RzI9vTpl5HoUbmqmSgqbW3694dqWELpPiVJAYVmjEXbTuGjgxcaLTPAsZnxKrqWD9cBNNJVpiWXCnIuacSHqLl06YtSRpQ/4c+HwnChgYBe0iNQKO9ZBJ5HA+VQgTPS0NTk8Kue3CqLcrqaxRwNv1tt+jPRigSN1RGk7GC+0h2Y9ulqkwhlXjxrufTYVahheAgyIWOsnXF8t1yA4oMWOgNq3aEZ+so51psoTszwraROs3kmw2/1OgTGrikLgkMvOYFilrQsx6zqq4NC+aSE16M7Cuzl5ytl9KRoG/otnBMlHnGY1UxmiS19jlW+xi3C2M1vGBPcKRQjoiYwb58giKcD0IKjRLE/uei1Vjr9571kXTZUO4qqzSMjS09aZPHsdmp0nccw4rXJC75aP2c/wM6WR4739VkQ=]]></Encrypt>
        // </xml>
        // `;
        xml2js.parseString(buff, function (err, json) {
            if (!err) {
                jsonData = json.xml;
            }
            
            var ToUserName = jsonData.ToUserName[0];
            var FromUserName = jsonData.FromUserName[0];
            var CreateTime = jsonData.CreateTime[0];
            var MsgType = jsonData.MsgType[0];
            var Content = jsonData.Content[0];
            var result = `<xml>
                        <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
                        <CreateTime>${Date.now()}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[${Content}]]></Content>
                    </xml>`;
            res.send(result);
        });
    });
});

app.listen(PORT, function () {
    console.log('app running at port ' + PORT);
})
