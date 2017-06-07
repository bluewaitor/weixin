var PORT = process.env.PORT || 3002;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var mongoose = require('mongoose');
var timestampPlugin = require('@bluewaitor/mongoose-plugin-timestamp');

mongoose.Promise = global.Promise;
mongoose.plugin(timestampPlugin, {index: true});

mongoose.connect('mongodb://star:Blue7700@127.0.0.1:27017/weixin?authSource=admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan());
var publicRouters = require('./routers/public');

publicRouters(app);

app.listen(PORT, function () {
    console.log('app running at port ' + PORT);
})
