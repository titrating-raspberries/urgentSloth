angular.module('LogoutCtrl', ['ngCookies'])
.controller('LogoutController', function($cookies, $scope,  $location, $window) {
  //clear cookies
  $cookies.remove("name");
  $cookies.remove("picture");
  $cookies.remove("fbId");

  //reload the page to make sure the logout button is not displayed in the nav bar
  $window.location.reload();

  //route user back to login page
  $location.path('/login');

});