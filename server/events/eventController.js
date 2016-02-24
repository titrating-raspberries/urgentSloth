var Event = require('./EventModel.js');
    User = require('../users/userModel.js');
    Q = require('q');
    util = require('../config/utils.js');
    userController = require('../users/userController');

// Promisify a few mongoose methods with the `q` promise library
var findEvent = Q.nbind(Event.findOne, Event);
var createEvent = Q.nbind(Event.create, Event);
var findAllEvents = Q.nbind(Event.find, Event);

var findUser = Q.nbind(User.findOne, User);
var getAllUsers = Q.nbind(User.find, User);

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
  },

  userEvents: function (req, res, next) {
    var fbId = req.params.fbId.slice(1);
    
    findUser({fbId: fbId})
      .then(function (user) {
        if (!user) {
          res.send(404);
        } else {
          var userEvents = user.events;
          findAllEvents({'_id': {$in: userEvents}})
            .then(function(events){
              events.forEach(function(event){
                var userIds = event.users;
                getAllUsers({'fbId': {$in: userIds}})
                  .then(function(users){
                    event.users = users;
                  });
              });
              res.json(events);
            })
        }
      })
      .fail(function (error) {
        next(error);
      });
  }  
};
