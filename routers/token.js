
var request = require('request');

var Token = require('../models/Token');

module.exports = {
    getAccessToken: function(req, res) {
        _getAccessToken().then(function(token){
            return res.json({
                body: token
            })
        })
    },
    getIpList: function(req, res) {
        _getAccessToken().then(function(token){
            request('https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=' + token, function(err, response, body) {
                if(!err && response.statusCode === 200) {
                    return res.json({
                        ip: JSON.parse(body)
                    })
                }
            })
        })
    },
    createMenu: function(req, res) {
        _getAccessToken().then(function(token) {
            var options = {
                url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + token,
                method: "POST",
                json: true,
                body: {
                    "button": [
                        {
                            "type": "click", 
                            "name": "今日歌曲", 
                            "key": "V1001_TODAY_MUSIC"
                        }
                    ]
                }

            }
            request.post(options, function(err, response, body) {
                if(!err && response.statusCode === 200) {
                    return res.json({
                        ip: body
                    })
                }
            })
        });
    }
}

function _getAccessToken() {
    return new Promise(function(resolve, reject) {
        Token.find({}).then(function(tokens) {
            if (tokens.length === 0) {
                    requestToken().then(function(body) {
                        var token = new Token();
                        body = JSON.parse(body);
                        token.token = body.access_token
                        token.deadline = Date.now() + 7000 * 1000;
                        token.save().then(function(token){
                            resolve(token.token);
                        });
                    })
            } else {
                var oldToken = tokens[0];
                if (oldToken.deadline < Date.now()) {
                    requestToken().then(function(body) {
                        body = JSON.parse(body);
                        oldToken.token = body.access_token
                        oldToken.deadline = Date.now() + 7000 * 1000;
                        oldToken.save().then(function(token){
                            resolve(token.token);
                        });
                    })
                } else {
                    resolve(tokens[0].token);
                }
            }
        })  
    })
}

function requestToken() {
    return new Promise(function(resolve, reject){
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=&secret=', function(err, res, body) {
            if(!err && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(err)
            }
        })
    })
    
}