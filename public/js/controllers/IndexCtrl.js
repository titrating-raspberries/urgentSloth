angular.module('IndexCtrl', ['ngCookies'])
.controller('IndexController',function($location,$cookies,$scope) {
  //ensure logout button is not shown on nav bar if user is not logged in
  $scope.loggedIn = ($cookies.get('name')!== undefined);
});

