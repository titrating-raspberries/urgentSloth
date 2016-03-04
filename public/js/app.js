angular.module('sampleApp', [
	'ngRoute',
  'ngCookies',
	'appRoutes',
	'CreateCtrl',
  'LogoutCtrl',
  'IndexCtrl',
	'EventsCtrl',
  'CalendarCtrl',
	'UserService',
	'EventService',
])

.factory('Auth', ['$http','$cookies', function($http, $cookies) {
  return {
    isUserLoggedIn : function(){
      return ($cookies.get('name')!== undefined);
    }
  };
}])

.run(function($rootScope, Auth, $location) {
  $rootScope.$on('$routeChangeStart', function () {
    if (!Auth.isUserLoggedIn()) {
      $location.path('/login');
    }
  });
});
