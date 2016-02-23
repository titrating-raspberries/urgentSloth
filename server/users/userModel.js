var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var saltLength = 10;

var userSchema = new mongoose.Schema({
  fbId : String,
  token: String,
  name: String,
  picture: String,
  events: []
});

userSchema.methods.compareIds = function (id) {
  var savedId = this.fbId;
  return Q.Promise(function (resolve, reject) {
    if (id === savedId) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};

module.exports = mongoose.model('User', userSchema);

