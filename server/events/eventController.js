var Event = require('./EventModel.js');
    Q = require('q');
    util = require('../config/utils.js');

// Promisify a few mongoose methods with the `q` promise library
var findEvent = Q.nbind(Event.findOne, Event);
var createEvent = Q.nbind(Event.create, Event);
var findAllEvents = Q.nbind(Event.find, Event);

module.exports = {

  allEvents: function (req, res, next) {
  findAllEvents({})
    .then(function (events) {
      res.json(links);
    })
    .fail(function (error) {
      next(error);
    });
  },

  newEvent: function (req, res, next) {
    var event = req.body.event;
    // if (!util.isValidEvent(url)) {
    //   return next(new Error('Not a valid url'));
    // }

    findEvent({event: event})
      .then(function (match) {
        if (match) {
          res.send(match);
        } else {
        	return event;
        }
      })
      .then(function (event) {
        if (event) {
          // var newEvent = {
          //   url: url,
          //   visits: 0,
          //   base_url: req.headers.origin,
          //   title: title
          // };
          // WE CAN MODIFY THIS IF THERE IS TOO MUCH INFO DISPLAYED
          var newEvent = event;
          return createEvent(newEvent);
        }
      })
      .then(function (createdEvent) {
        if (createdEvent) {
          res.json(createdEvent);
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  navToEvent: function (req, res, next) {
    findEvent({_id: req.params.id})
      .then(function (event) {
        if (!event) {
          return next(new Error('Link not added yet'));
        }

        //res.redirect(THE PARTICULAR EVENT HTML);
          
      })
      .fail(function (error) {
        next(error);
      });
  }

};
