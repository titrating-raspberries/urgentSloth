 angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    // events page
    .when('/', {
        templateUrl: 'views/login.html',
    })

    // create page
    .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController'
    })

    // event page 
    .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventController'
    })


  $locationProvider.html5Mode(true);

}]);