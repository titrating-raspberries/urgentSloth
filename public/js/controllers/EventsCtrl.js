angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, $cookies, Event) {

  $scope.data = {};

	Event.getUserEvents($cookies.get('fbId'))
		.then(function(events) {
			$scope.data.events = events;
		})
		.catch(function (error) {
      console.error(error);
    });

  $scope.logData = function (event) {
    //return Event.update(event);
  };
});

