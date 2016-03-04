angular.module('CalendarCtrl', [])
.controller('CalendarController',function($scope, $window, $cookies, Event, User) {

  $scope.test ="hello world";
  $scope.calendarEvents = [];

  var userFbId = $cookies.get('fbId');

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
      // page is now ready, initialize the calendar...
      // setTimeout(function (){
        console.log($scope.calendarEvents);
        $('#calendar').fullCalendar({
          events: $scope.calendarEvents,
            // put your options and callbacks here
          // eventColor: '#2d7b52'
        })
      // }, 500);
  });
  });
});
