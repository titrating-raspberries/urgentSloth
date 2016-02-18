// grab the mongoose module
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id : String,
    token: String,
    name: String,
    email: String,
    picture: String,
    events: []
});

module.exports = mongoose.model('User', userSchema);