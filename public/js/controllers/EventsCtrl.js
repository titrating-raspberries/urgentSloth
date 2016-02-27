angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, $cookies, Event, $route) {

  $scope.data = {};

  var getUserEvents = function(){
      Event.getUserEvents($cookies.get('fbId'))
        .then(function(events) {
          $scope.data.events = events;
        })
        .catch(function (error) {
          console.error(error);
        });
  }

  //we want to get the user's events when the controller first loads
  getUserEvents();

  $scope.locationVote = function (index, eventIndex, event) {
    console.log($scope.data.events[eventIndex].locations);
    if($scope.data.events[eventIndex].locationVotesArr === undefined){
      var length = event.locations.length;
      $scope.data.events[eventIndex].locationVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.data.events[eventIndex].locationVotesArr[index] = !$scope.data.events[eventIndex].locationVotesArr[index];
  };

  $scope.dateVote = function (index, eventIndex, event) {
    if($scope.data.events[eventIndex].dateVotesArr === undefined){
      var length = event.dates.length;
      $scope.data.events[eventIndex].dateVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.data.events[eventIndex].dateVotesArr[index] = !$scope.data.events[eventIndex].dateVotesArr[index];
  };

  $scope.submit = function (event, index) {
    var voteData = {
        userFbId: $cookies.get('fbId'), 
        eventId: event._id,
        dateVotesArr: $scope.data.events[index].dateVotesArr, 
        locationVotesArr: $scope.data.events[index].locationVotesArr 
      };
    //NOTE: as of right now, user must vote yes for at least one location and one time option
    Event.submitEventVotes(voteData)
    $route.reload();
  };

  $scope.getEventStatus = function (event) {
    var userFbId =$cookies.get('fbId');

    if(event.decision !== undefined){
      return 'decided';
    } else if(event.usersWhoSubmitted.indexOf(userFbId) !== -1){
     return 'submitted';
    } else{
      return 'notSubmitted';
    }
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

