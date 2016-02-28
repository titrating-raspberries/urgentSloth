angular.module('IndexCtrl', ['ngCookies'])
.controller('IndexController',function($location,$cookies,$scope) {
  //ensure logout button is not shown on nav bar if user is not logged in
  $scope.loggedIn = ($cookies.get('name')!== undefined);
  $scope.userPic = $cookies.get('picture');
  $scope.userName = $cookies.get('name');

  //if the user is logged in, we want to show the photo repeating in the background of the body
  //if not, we want to center it on the page
  if($scope.loggedIn === false) {
    $scope.photo = 'photo';
  } else{
    $scope.bodyClass = 'standardBodyClass';
  }

});

