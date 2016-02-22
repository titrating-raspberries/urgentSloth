angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, Event) {

  $scope.data = {};

	// Event.get()
	// 	.then(function(events) {
	// 		$scope.data.events = events;
	// 	})
	// 	.catch(function (error) {
 //      console.error(error);
 //    });

  $scope.data.events = [{
  	name: 'super awesome dinner',
  	deadline: new Date(),
  	locations: [{name:'rheas', rating:4, url:'http://sdfsfs'}, {name:'mcdonalds',rating:3, url:'http://sdfasfasfs'}, {name:'carls jr', rating:2, url:'http://sdsdfdssfs'}],
  	dates: [new Date(), new Date()],
  	users: [{name:'leran'}, {name:'pavel'}, {name:'taylor'}]
  }];

  $scope.logData = function (event) {
    return Event.update(event);
  };

});

