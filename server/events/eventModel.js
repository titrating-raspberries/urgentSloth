// grab the mongoose module
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    name: String,
    deadline: {},// js date obj
    locations: [],// array of objects, {location: yelp object, votes: integer}
    dates: [],// array of objects, {date: js date obj, votes: integer}
    users: []// array of fb ids
});

module.exports = mongoose.model('Event', eventSchema);