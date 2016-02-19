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
    var email = profile.emails[0].value;
    var picture = profile.photos[0].value;


      findUser({fbId: fbId})
        .then(function (match) {
          if (match) {
            console.log('USER MATCH');
           // res.send(match);
          } else {
            var noMatch = true;
            return noMatch;
          }
        })
        .then(function (noMatch) { // this is hacky, ask about this
          if (noMatch){
            console.log('NO MATCH');
            var newUser = {
              name: name,
              fbId: fbId,
              email: email,
              picture: picture
            };
            return createUser(newUser);
          }
        })
        .then(function (createdUser) {
          if (createdUser) {
            console.log('CREATED USER');
            res.json(createdUser);
          }
        })
        .fail(function (error) {
          console.log('CREATE USER Error',error);
          next(error);
        });
    },


  // signin: function (req, res, next) {
  //   /* will come from FB
  //   var id = ??
  //   */
  //   findUser({fbId: id})
  //     .then(function (user) {
  //       if (!user) {
  //         next(new Error('User does not exist'));
  //       } else {
  //         return user.compareIds(id)
  //           .then(function (foundUser) {
  //             if (foundUser) {
  //               var token = jwt.encode(user, 'secret');
  //               res.json({token: token});
  //             } else {
  //               return next(new Error('No user'));
  //             }
  //           });
  //       }
  //     })
  //     .fail(function (error) {
  //       next(error);
  //     });
  // },

  // signup: function (req, res, next) {
  //   /* will come from FB
  //   var id = ??
  //   */

  //   // check to see if user already exists
  //   findUser({fbId: id})
  //     .then(function (user) {
  //       if (user) {
  //         next(new Error('User already exist!'));
  //       } else {
  //         // make a new user if not one
  //         return createUser({
  //           fbId: id
  //         });
  //       }
  //     })
  //     .then(function (user) {
  //       // create token to send back for auth
  //       var token = jwt.encode(user, 'secret');
  //       res.json({token: token});
  //     })
  //     .catch(function (error) {
  //       next(error);
  //     });
  // },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }
};
