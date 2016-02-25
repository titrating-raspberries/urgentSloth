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
    if($scope.locationVotesArr === undefined){
      var length = event.locations.length;
      $scope.locationVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.locationVotesArr[index] = !$scope.locationVotesArr[index];
  };

  $scope.dateVote = function (index, event) {
    if($scope.dateVotesArr === undefined){
      var length = event.dates.length;
      $scope.dateVotesArr = Array.apply(null, Array(length)).map(Boolean.prototype.valueOf, false);
    }
    $scope.dateVotesArr[index] = !$scope.dateVotesArr[index];

  };

  $scope.submit = function (event) {
    var voteData = {
        userFbId: $cookies.get('fbId'), 
        eventId: event._id,
        dateVotesArr: $scope.dateVotesArr, 
        locationVotesArr: $scope.locationVotesArr 
      };
    //NOTE: as of right now, user must vote yes for at least one location and one time option
    Event.submitEventVotes(voteData)
    .then(function(){
      getUserEvents();
    });
    alert('You submitted event votes!');
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

