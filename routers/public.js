var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var xml2js = require("xml2js");

var token = require("./token");
var request = require("request");

const Message = require('../weixin/Message');

module.exports = function(app) {
  router.get("/", function(req, res) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var token = "bluewaitorweixin";
    var arr = [token, timestamp, nonce];
    arr.sort();
    var sha1 = crypto.createHash("sha1");
    sha1.update(arr.join(""));

    if (sha1.digest("hex") === signature) {
      return res.status(200).send(echostr);
    } else {
      return res.send("失败");
    }
  });

  router.post("/", function(req, res) {
    var buff = "";
    req.on("data", function(chunk) {
      buff += chunk;
    });
    var jsonData = {};
    req.on("end", function() {
      xml2js.parseString(buff, function(err, json) {
        if (!err) {
          jsonData = json.xml;
        }
        console.log(jsonData);
        const ToUserName = jsonData.ToUserName[0];
        const FromUserName = jsonData.FromUserName[0];
        
        const msgType = jsonData.MsgType[0];

        const builder = new xml2js.Builder({cdata: true});
        
        var content = '';

        switch (msgType) {
            case "text": {
                content = '文本';
                break;
            }
            case "image": {
                content = '图片';
                break;
            }
            case "voice": {
                content = '语音';
                break;
            }
            case "video": {
                content = '视频';
                break;
            }
            case "shortvideo": {
                content = '短视频';
                break;
            }
            case "location": {
                content = '地理位置';
                break;
            }
            case "link": {
                content = '链接';
                break;
            }
            case "event": {
                content = '事件';
                break;
            }
            default: {
                var obj = {
                    xml: {
                      ToUserName: FromUserName,
                      FromUserName: ToUserName,
                      CreateTime: Date.now(),
                      MsgType: 'text',
                      Content: '未知消息类型'
                    }
                  };
                  var xml = builder.buildObject(obj);
                res.send(xml);
            }
        }
        var obj = {
          xml: {
            ToUserName: FromUserName,
            FromUserName: ToUserName,
            CreateTime: Date.now(),
            MsgType: 'text',
            Content: content
          }
        };
        var xml = builder.buildObject(obj);
        res.send(xml);
      });
    });
  });

  router.get("/access_token", token.getAccessToken);

  router.get("/ip_list", token.getIpList);

  router.get("/create_menu", token.createMenu);

  app.use(router);
};
