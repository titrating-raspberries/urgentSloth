angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, $cookies, Event, User,$route) {

  $scope.showNoEventsMessage = false;
  $scope.noEventsMessage = 'You have no scheduled events. Time to create one?'
  $scope.data = {};
  //Filter array (0=excl/1=excl)
  //Index meaning: [needs your vote, submitted, decided, maxValue in array]
  //Events will only be shown on the page if value at event index === maxValue
  $scope.filters = [0,0,0,0];

  $scope.filterEvents = function(index){
    $scope.filters[index] = !$scope.filters[index]*1;
    $scope.filters[3] = Math.max(1*$scope.filters[0],1*$scope.filters[1],1*$scope.filters[2]);
  };

  var getUserEvents = function(){
    Event.getUserEvents($cookies.get('fbId'))
      .then(function(events) {
        var userFbId = $cookies.get('fbId');
        console.log('EVENTS:', events)
        //Events page only includes future events
        $scope.data.decidedEvents = events.filter(function(event){
          return event.decision && new Date(event.decision.date) > Date.now();
        });

        $scope.data.submittedEvents = events.filter(function(event){
          return event.usersWhoSubmitted.indexOf(userFbId) !== -1 && (!event.decision || new Date(event.decision.date) > Date.now());
        });

        $scope.data.notVotedEvents = events.filter(function(event){
          return event.usersWhoSubmitted.indexOf(userFbId) == -1 && !event.decision;
        });

        if(!$scope.data.decidedEvents.length && !$scope.data.submittedEvents.length && !$scope.data.notVotedEvents.length){
          $scope.showNoEventsMessage = true;
        } else {
          $scope.showNoEventsMessage = false;
        };

        //Past events page only includes past events
        $scope.data.pastEvents = events.filter(function(event){
          return event.decision && new Date(event.decision.date) < Date.now();
        });
        $scope.data.pastEvents.sort(function(a,b){
          return new Date(b.decision.date) - new Date(a.decision.date);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  //we want to get the user's events when the controller first loads
  getUserEvents();

  $scope.locationVote = function (index, eventIndex, event) {
    if($scope.data.notVotedEvents[eventIndex].locationVotesArr === undefined){
      var length = event.locations.length;
      $scope.data.notVotedEvents[eventIndex].locationVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.data.notVotedEvents[eventIndex].locationVotesArr[index] = !$scope.data.notVotedEvents[eventIndex].locationVotesArr[index];
  };

  $scope.dateVote = function (index, eventIndex, event) {
    if($scope.data.notVotedEvents[eventIndex].dateVotesArr === undefined){
      var length = event.dates.length;
      $scope.data.notVotedEvents[eventIndex].dateVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.data.notVotedEvents[eventIndex].dateVotesArr[index] = !$scope.data.notVotedEvents[eventIndex].dateVotesArr[index];
  };

  $scope.submit = function (event, index) {
    var voteData = {
        userFbId: $cookies.get('fbId'), 
        eventId: event._id,
        dateVotesArr: $scope.data.notVotedEvents[index].dateVotesArr, 
        locationVotesArr: $scope.data.notVotedEvents[index].locationVotesArr 
      };
    //NOTE: as of right now, user must vote yes for at least one location and one time option
    Event.submitEventVotes(voteData)
    $route.reload();
  };

  $scope.declineEvent = function(event){
    var fbId =  $cookies.get('fbId');

    // remove eventid from the user's events
    User.removeEvent(fbId, event._id);
    //remove userid from the event's users
    Event.removeUser(event._id, fbId);

    //reload the page now that event is gone
    window.location.reload();
  };

})
.directive('toggleClass', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.toggleClass(attrs.toggleClass);
      });
    }
  };
});

