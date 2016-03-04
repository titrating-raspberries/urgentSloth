angular.module('CalendarCtrl', [])
.controller('CalendarController',function($scope, $window, $cookies, Event, User) {

  $scope.test ="hello world";
  $scope.calendarEvents = [];
  $scope.firstName = "YOUR";
  $scope.firstName = $cookies.get('name').split(' ')[0].toUpperCase()+"'S";

  var userFbId = $cookies.get('fbId');
  console.log(userFbId);

  Event.getUserEvents($cookies.get('fbId'))
  .then(function(events) {
    var eventList = events;
    eventList.forEach(function (event) {
      var color = '#005ce6'; // color for Needs your vote
      if (event.decision){
        color='#2d7b52'; //color for decided
      } else if (event.usersWhoSubmitted.indexOf(userFbId) !== -1) {
        color = '#86592d'; //color for Pending
      }
      // console.log(event);
      $scope.calendarEvents.push({
        title: event.name,
        start: event.dates[0].date.slice(0, 10),
        allDay: false,
        color: color
      });
    });
    $(document).ready(function() {
      console.log($scope.calendarEvents);
      $('#calendar').fullCalendar({
        events: $scope.calendarEvents,
          // put your options and callbacks here
      })
    });
  });
});
