angular.module('EventService', []).factory('Event', ['$http', function($http) {

  return {
      // call to get all nerds
      get : function() {
          return $http.get('/api/events');
      },

      // these will work when more API routes are defined on the Node side of things
      // call to POST and create a new nerd
      create : function(eventData) {
          return $http.post('/api/events', eventData);
      },

      // call to DELETE a nerd
      delete : function(id) {
          return $http.delete('/api/events/' + id);
      }
  };       

}]);