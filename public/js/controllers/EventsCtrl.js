angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, Event) {

  $scope.data = {};

	Event.get()
		.then(function(events) {
			$scope.data.events = events;
		})
		.catch(function (error) {
      console.error(error);
    });

  $scope.logData = function (event) {
    return Event.update(event);
  };
});

