// grab the nerd model we just created
var User = require('../users/userModel.js');
var Event = require('../events/eventModel.js');
var passport       = require('passport');
var Strategy       = require('passport-facebook').Strategy;


module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  app.get('/api/users', function(req, res) {
      // use mongoose to get all nerds in the database
      User.find(function(err, users) {

          // if there is an error retrieving, send the error. 
                          // nothing after res.send(err) will execute
          if (err)
              res.send(err);

          res.json(users); // return all nerds in JSON format
      });
  });

  app.get('/api/events', function(req, res) {
      // use mongoose to get all nerds in the database
      Event.find(function(err, events) {

          // if there is an error retrieving, send the error. 
                          // nothing after res.send(err) will execute
          if (err)
              res.send(err);

          res.json(events); // return all nerds in JSON format
      });
  });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)

  // frontend routes =========================================================
  // route to handle all angular requests



  // passport routes =========================================================
  // route to handle all facebook passport requests

  app.get('/login/facebook',
    passport.authenticate('facebook'));

  app.get('/login/facebook/return', 
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      res.cookie('name',req.user.displayName);
      res.cookie('fbId',req.user.id);
      res.cookie('picture',req.user.photos[0].value);
      res.redirect('/#events');
    });


  app.get('/login',function(req, res){
    res.redirect('/#login');
  });


  // catch all route =========================================================
  // route to handle other things typed into the nav bar

  app.get('/*',function(req, res){
    res.redirect('/#events');
  });



};