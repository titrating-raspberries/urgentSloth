// grab the mongoose module
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    name: String,
    deadline: {},// js date obj
    locations: [],// array of objects, {location: yelp object, votes: integer}
    dates: [],// array of objects, {date: js date obj, votes: integer}
    users: [],// array of fb ids
    usersWhoSubmitted: [], // array of fb ids of those users who've submitted votes on the date and loc options
    decision: {},// object with decided time and location, undefined until after deadline
    description: String,
    host: {}, //object that will come from $cookies when event is created
    notified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Event', eventSchema);
