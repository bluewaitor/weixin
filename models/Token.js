var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = Schema({
    token: String,
    deadline: String
});


module.exports = mongoose.model('Token', TokenSchema);