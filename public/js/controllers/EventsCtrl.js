angular.module('EventsCtrl', [])

.controller('EventsController', function($scope, $cookies, Event) {

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

  $scope.locationVote = function (index, event) {
    if($scope.events[index].locationVotesArr === undefined){
      var length = event.locations.length;
      $scope.events[index].locationVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.events[index].locationVotesArr[index] = !$scope.events[index].locationVotesArr[index];
  };

  $scope.dateVote = function (index, event) {
    if($scope.events[index].dateVotesArr === undefined){
      var length = event.dates.length;
      $scope.events[index].dateVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.events[index].dateVotesArr[index] = !$scope.events[index].dateVotesArr[index];

  };

  $scope.submit = function (event) {
    var voteData = {
        userFbId: $cookies.get('fbId'), 
        eventId: event._id,
        dateVotesArr: $scope.events[index].dateVotesArr, 
        locationVotesArr: $scope.events[index].locationVotesArr 
      };
    //NOTE: as of right now, user must vote yes for at least one location and one time option
    Event.submitEventVotes(voteData)
    .then(function(){
      getUserEvents();
    });
    alert('You submitted event votes!');
  };

  $scope.getEventStatus = function (event) {
    var userFbId =$cookies.get('fbId');
    console.log('event DEC',event.decision);
    if(event.decision !== undefined){
      return 'decided';
    } else if(event.usersWhoSubmitted.indexOf(userFbId) !== -1){
     return 'submitted';
    }  else{
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

