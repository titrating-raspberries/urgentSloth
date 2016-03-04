angular.module('CalendarCtrl', [])
.controller('CalendarController',function($scope, $window) {

  $scope.test ="hello world";
  $scope.library=$window.fullCalendar;
  console.log($window);
  // $(document).ready(function() {
  //     // page is now ready, initialize the calendar...
  //     $('#calendar').fullCalendar({

  //         // put your options and callbacks here
  //     });
  // });
});
