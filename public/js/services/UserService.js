angular.module('UserService', []).factory('User', ['$http', function($http) {

  return {
      get : function() {
          return $http({
            method: 'GET',
            url: '/api/users/'
          }).then(function(res){
            return res.data;
          })
      },

      getFriends: function(fbId){
        return $http({
            method: 'GET',
            url: '/api/users/:' + fbId 
          }).then(function(res){
            return res.data;
          }).catch(function(err){
            console.log(err);
          });
      },

      create : function(userData) {
          return $http({
            method: 'POST',
            url: '/api/users/',
            data: userData
          })
      },

      delete : function(id) {
          return $http.delete('/api/users/' + id);
      },

      removeEvent : function(fbId, eventID) {
          return $http({
            method: 'POST',
            url: '/api/users/removeEvent',
            data: { eventID: eventID, fbId: fbId }
          }).then(function(res){
            // return res.data;
          })
      }

  };       

}]);