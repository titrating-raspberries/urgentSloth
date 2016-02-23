angular.module('CreateCtrl', []).controller('CreateController', function($scope, User, Event) {

  $scope.friends = []; //List of all users
  $scope.attendees = {}; //List of friends added to an event
  $scope.yelpResults = [];
  $scope.locations = {};
  $scope.dateTimes = {};
  $scope.decideByTime = [];

  $scope.lonelyMessage = "...There's nothing quite like sharing a meal with someone you love - yourself...";
  $scope.showLonelyMessage = true;
  $scope.noLocationsMessage = '“When you make a choice, you change the future.” - Deepak Chopra';
  $scope.showNoLocationsMessage = true;

  
  var getFriends = function(){
    //Replace with User.get() when real user database is ready.
    User.getFake().then(function(friends){
      $scope.friends = friends;
    });
  };

  getFriends();

  $scope.addFriend = function(friend){
    //Fix when real user database is ready
    $scope.showLonelyMessage = false;
    $scope.attendees[friend.user.md5] = friend;
  };

  $scope.removeFriend = function(friend){
    delete $scope.attendees[friend.user.md5];
    $scope.showLonelyMessage = Object.keys($scope.attendees).length === 0 ? true : false;
  };

  //Fires up Yelp search for restaurants based on 'Add location' form on create.html
  $scope.submit = function() {
    if ($scope.term && $scope.location) {
      Event.searchYelp($scope.term, $scope.location).then(function(results){
        $scope.yelpResults = results.data.businesses;
      }).catch(function(err){
        console.log(err);
      })
    }
  };

  $scope.addLocation = function(restaurant){
    //Create a unique for the locations object
    var uniqueKey = restaurant.location.coordinate.latitude + '-' + restaurant.location.coordinate.longitude;
    $scope.locations[uniqueKey] = restaurant; 
    $scope.showNoLocationsMessage = false;
  };

  $scope.removeLocation = function(restaurant){
    var uniqueKey = restaurant.location.coordinate.longitude + '-' + restaurant.location.coordinate.longitude;
    delete $scope.locations[uniqueKey];
    $scope.showNoLocationsMessage = Object.keys($scope.locations).length === 0 ? true : false;
  };

  $scope.addDateTimes = function(){
    var dateTime = new Date(1*$scope.date + 1*$scope.time-8*3600*1000);
    $scope.dateTimes[dateTime] = dateTime;
  };

  $scope.addDecideByTime = function(){
    var dateTime = new Date(1*$scope.date + 1*$scope.time-8*3600*1000);
    //Allow only one decideBy time
    if(!$scope.decideByTime.length){
      $scope.decideByTime.push(dateTime);
    }
  };

  $scope.submitEvent = function(){
    var event = {};
    event.name = $scope.eventName;
    event.deadline = $scope.decideByTime[0];
    //Add locations from locations object
    event.locations = [];
    Object.keys($scope.locations).forEach(function(key){
      event.locations.push({location: $scope.locations[key], votes: 0});
    });
    //Add dates and times from dateTime object
    event.dates = [];
    Object.keys($scope.dateTimes).forEach(function(key){
      event.dates.push({date:$scope.dateTimes[key], votes: 0});
    });
    //Add attendee fbId's from attendees object
    event.users = [];
    Object.keys($scope.attendees).forEach(function(key){
      event.users.push($scope.attendees[key][fbId]);
    });

    Event.create(event);
    
  };
});