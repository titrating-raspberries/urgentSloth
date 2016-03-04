 angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    // events page
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'IndexController'
    })

    // create page
    .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController'
    })

    // event page
    .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsController'
    })

    // past events page
    .when('/pastEvents', {
        templateUrl: 'views/pastEvents.html',
        controller: 'EventsController'
    })

    //go back to logout page
    .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LogoutController'
    })

    .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'CalendarController'
    })

    .otherwise({
      redirectTo: '/events'
    });


  $locationProvider.html5Mode(true);

}]);
