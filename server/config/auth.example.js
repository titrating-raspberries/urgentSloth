module.exports = {

  'facebookAuth' : {
      'clientID'      : 'your App ID',
      'clientSecret'  : 'clientsecretID',
      'callbackURL'   : 'http://localhost:3000/auth/facebook/return'
  },

  'twitterAuth' : {
      'consumerKey'       : 'your-consumer-key-here',
      'consumerSecret'    : 'your-client-secret-here',
      'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth' : {
      'clientID'      : 'your-secret-clientID-here',
      'clientSecret'  : 'your-client-secret-here',
      'callbackURL'   : 'http://localhost:8080/auth/google/callback'
  }
};