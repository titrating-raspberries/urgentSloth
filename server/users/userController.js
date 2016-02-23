var User = require('./userModel.js');
    Q = require('q');
    jwt = require('jwt-simple');

// Promisify a few mongoose methods with the `q` promise library
var getAllUsers = Q.nbind(User.find, User);
var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

//addFriendsPicture will grab a user's friends prof pic links to store in the db
var addFriendsPicture = function(friendArr){
  for(var i = 0; i < friendArr.length; i++){
    var friend = friendArr[i];
     findUser({fbId: friend.id})
        .then(function (match) {
          if(match !== null){
            friend.picture = match.picture;
          } else{
            console.log('userController: Error retrieving friend', match);
          }
        });
  }
  return friendArr;
};

module.exports = {
  getUsers: function (req, res) {
    getAllUsers({})
      .then(function (users) {
        if (users) {
          res.send(users);
        } else {
          console.log('THERE ARE NO USERS');
        }
      });
  },

  createOrFindOne: function (profile) {
    console.log('AAAAAAHHHHHHHHHHH', profile);

    var fbId = profile.id;
    var name = profile.displayName;
    var picture = profile.photos[0].value;
    var friends = addFriendsPicture(profile._json.friends.data);

      findUser({fbId: fbId})
        .then(function (match) {
          //if there's no match, we want to create a new user 
          if (match === null) {
            var newUser = {
              name: name,
              fbId: fbId,
              picture: picture,
              friends: friends
            };
            createUser(newUser);
          } else {// if user already exists, update user's friends in the database
            match.friends = friends;
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
