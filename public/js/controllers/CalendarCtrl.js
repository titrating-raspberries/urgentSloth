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
      var currentDescription = event.description || '';
      var currentHost = event.host ? event.host.name : '';
      console.log(event);
      $scope.calendarEvents.push({
        title: event.name,
        start: event.dates[0].date.slice(0, 10),
        allDay: false,
        color: color,
        eventData: {
          name: event.name,
          description: currentDescription,
          host: currentHost,
        }
      });
    });
    $(document).ready(function() {
      console.log($scope.calendarEvents);
      $('#calendar').fullCalendar({
        events: $scope.calendarEvents,
        eventLimit: true, // for all non-agenda views
        views: {
          agenda: {
            eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
          }
        },
        header: {
        left: '',
        center: 'prev title next',
        right: ''
        },
        eventClick:  function(event, jsEvent, view) {
          $("#eventInfo").html('<div><span style="font-weight: bold">Event</span>: ' + event.eventData.name +
            '</div><div><span style="font-weight: bold">Description</span>: ' + event.eventData.description
            + '</div><div><span style="font-weight: bold">Host</span>: ' + event.eventData.host + '</div>'
          );
          $('#eventContent').dialog({
            modal: true,
            maxHeight:500,
          }).prev(".ui-dialog-titlebar").css("background","#2d7b52");
          $('.ui-dialog :button').blur();
        },
      })
    });
  });
});
