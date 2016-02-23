var Event = require('./EventModel.js');
    Q = require('q');
    util = require('../config/utils.js');
    userController = require('../users/userController');

// Promisify a few mongoose methods with the `q` promise library
var findEvent = Q.nbind(Event.findOne, Event);
var createEvent = Q.nbind(Event.create, Event);
var findAllEvents = Q.nbind(Event.find, Event);

module.exports = {

  allEvents: function (req, res, next) {
    findAllEvents({})
      .then(function (events) {
        res.json(events);
      })
      .fail(function (error) {
        next(error);
      });
  },

  newEvent: function (req, res, next) {
    var event = req.body;
    
    createEvent(event)
      .then(function (createdEvent) {
        if (createdEvent) {
          userController.addEventToUsers(createdEvent.users, createdEvent._id);
          res.json(createdEvent);
        }
      })
      .fail(function (error) {
        next(error);
      });
  }
};
