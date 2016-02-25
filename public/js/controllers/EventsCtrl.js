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
})
.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});

