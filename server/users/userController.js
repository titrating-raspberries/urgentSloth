var User = require('./userModel.js');
    Q = require('q');
    jwt = require('jwt-simple');

// Promisify a few mongoose methods with the `q` promise library
var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  createOrFindOne: function (profile) {
    var fbId = profile.id;
    var name = profile.displayName;
    var picture = profile.photos[0].value;
    var friends = profile._json.friends.data;

      findUser({fbId: fbId})
        .then(function (match) {
          if (match) {
            console.log('USER MATCH');
          } else {
            var noMatch = true;
            return noMatch;
          }
        })
        .then(function (noMatch) { // ask about this
          if (noMatch){
            console.log('NO MATCH');
            var newUser = {
              name: name,
              fbId: fbId,
              picture: picture,
              friends: friends
            };
            return createUser(newUser);
          }
        })
        .then(function (createdUser) {
          if (createdUser) {
            console.log('CREATED USER');
          }
        })
        .fail(function (error) {
          console.log('CREATE USER Error',error);
          next(error);
        });
    }

};
