var User = require('./userModel.js');
    Q = require('q');

// Promisify a few mongoose methods with the `q` promise library
var getAllUsers = Q.nbind(User.find, User);
var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {

  removeEvent: function (req, res) {
    console.log(req);
    var fbId = req.body.fbId;
    var eventId = req.body.eventID;

    findUser({fbId: fbId})
      .then(function (user) {
        if (user) {
          console.log('all user events are ', user.events);

          var eventList = [];
          // user.events.forEach()
          var eventIndex = user.events.indexOf(eventId);
          console.log('the event id is ', eventId);
          console.log('index of removal is ', eventIndex);
          // if()
          user.events.splice(eventIndex,1);
          console.log('after removal, event list is ', user.events);
          user.save(function(err) {
                      if (err) {
                        console.error(err);
                      }
                    });
        } else {
          console.error('Error finding user');
        }
      });
  },

  getUsers: function (req, res) {
    getAllUsers({})
      .then(function (users) {
        if (users) {
          res.send(users);
        } else {
          console.error('Error finding users');
        }
      });
  },

  getUserFriends: function (req, res) {
    var id = req.params.fbId.slice(1);
    findUser({fbId: id})
        .then(function (user) {
          if(user !== null){
            var friendArray = user.friends.map(function(friend) {

              return friend.fbId;
            });
            getAllUsers({'fbId': {$in: friendArray}})
              .then(function(friends) {
                res.send(friends);
              });
          } else{
            console.log('userController: Error retrieving friends');
            res.send(404);
          }
        });
  },

  addEventToUsers: function (usersArray, eventId) {
    getAllUsers({'fbId': {$in: usersArray}})
      .then(function(users) {
        users.forEach(function(user) {
          user.events.push(eventId);
          user.save(function(err) {
            if (err) {
              console.error(err);
            }
          });
        });
      });
  },

  createOrFindOne: function (profile) {
    // console.log(profile);
    var fbId = profile.id;
    var name = profile.displayName;
    var picture = profile.photos[0].value;
    var email = profile.email;
    var friends = profile._json.friends.data.map(function(friend) {
      return {fbId: friend.id};
    });

      findUser({fbId: fbId})
        .then(function (match) {
          //if there's no match, we want to create a new user
          if (match === null) {
            console.log("EMAIL IS ", email);
            var newUser = {
              name: name,
              fbId: fbId,
              picture: picture,
              friends: friends,
              email: email,
            };
            createUser(newUser);
          } else {// if user already exists, update user's friends, prof pic, and email in the database
            console.log("EMAIL IS ", email);
            match.friends = friends;
            match.picture = picture;
            match.email = email;
            match.save(function (err) {
                if (err){
                  return handleError(err);
                }
              });
          }
        })
        .fail(function (error) {
          console.log('createOrFind user Error',error);
          next(error);
        });
    }

};
