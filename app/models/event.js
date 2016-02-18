// grab the mongoose module
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    name: String,
    deadline: {},
    locations: [],
    dates: [],
    users: []
});

module.exports = mongoose.model('Event', eventSchema);