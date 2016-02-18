 angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    // events page
    .when('/', {
        templateUrl: 'views/events.html',
        controller: 'EventsController'
    })

    // create page
    .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController'
    })

    // event page 
    .when('/event', {
        templateUrl: 'views/event.html',
        controller: 'EventController'
    });

  $locationProvider.html5Mode(true);

}]);