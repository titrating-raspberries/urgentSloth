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

      // these will work when more API routes are defined on the Node side of things
      // call to POST and create a new nerd
      create : function(userData) {
          return $http({
            method: 'POST',
            url: '/api/users/',
            data: userData
          })
      },

      // call to DELETE a nerd
      delete : function(id) {
          return $http.delete('/api/users/' + id);
      }
  };       

}]);