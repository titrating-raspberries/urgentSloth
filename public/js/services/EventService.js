angular.module('EventService', []).factory('Event', ['$http', function($http) {

  return {
    get : function() {
        return $http.get('/api/events');
    },

    create : function(eventData) {
        return $http.post('/api/events', eventData);
    },

    delete : function(id) {
        return $http.delete('/api/events/' + id);
    },

    searchYelp: function(term, location, country){
      function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
      };
      
      var yelpUrl = 'https://api.yelp.com/v2/search';
      var httpMethod = 'JSONP';

      //Yelp access token:
      var consumerKey = 'jENexVIGC2-ho2MPKDCvISyRfPU';
      var consumerSecret = 'jENexVIGC2-ho2MPKDCvISyRfPU';
      var token = 'uosUcU25he8AlgqM8paqwzj-j4mpkIhl';
      var tokenSecret = 'myAMTAkatscCizvq2z3cSffp0uc';

      //Required parameters for oauth signature and Yelp API request:
      var parameters = {
        oauth_consumer_key: consumerKey,
        oauth_token: token,
        oauth_signature_method: 'HMAC-SHA1', 
        oauth_timestamp: new Date().getTime(),
        oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      };

      //Generate oauth_signature using 3rd party script (included on index.html):
      var oauth_signature = oauthSignature.generate(httpMethod, yelpUrl, parameters, consumerSecret, tokenSecret);
      parameters['oauth_signature'] = oauth_signature;

      //Generate full request URL:
      var requestUrl = yelpUrl + '?term=' + term + '&location=' + location + '&cc=' + (country || 'US') + '&limit=' + 15;

      return $http.jsonp({url: requestUrl, param: parameters}).then(function(res){
        return res.data;
      })
    }
  };       
}]);