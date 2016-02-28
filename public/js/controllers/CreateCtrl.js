angular.module('CreateCtrl', []).controller('CreateController', function($scope, $cookies, $location, User, Event) {

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

  $scope.showValidationMessage = false;  

  //Toggle for Hide/Show Yelp results button
  $scope.toggle = true;
  
  var getFriends = function(){
    //Replace with User.get() when real user database is ready.
    User.getFriends($cookies.get('fbId')).then(function(friends){
      $scope.friends = friends;
    });
  };

  getFriends();

  $scope.addFriend = function(friend){
    //Fix when real user database is ready
    $scope.showLonelyMessage = false;
    $scope.attendees[friend.fbId] = friend;
  };

  $scope.removeFriend = function(friend){
    delete $scope.attendees[friend.fbId];
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

  $scope.removeDateTime = function(dateTime){
    delete $scope.dateTimes[dateTime];
  };

  $scope.addDecideByTime = function(){
    //Allow only one decideBy time
    if(!$scope.decideByTime.length){
      var dateTime = new Date(1*$scope.decideDate + 1*$scope.decideTime-8*3600*1000);
      $scope.decideByTime.push(dateTime);
    }
  };

  $scope.removeDecideBy = function(){
    $scope.decideByTime.pop();
  };

  $scope.submitEvent = function(){
    var eventValidation = {};
    //Check if event name is present
    if(!$scope.eventName){
      eventValidation.eventMessage = 'Please enter an event name'
    };

    //Check if attendees have been added to the event
    if(!Object.keys($scope.attendees).length){
      eventValidation.attendeeMessage = 'Invite some friends to the party'
    };

    //Check if location options are specified
    if(!Object.keys($scope.locations).length){
      eventValidation.locationsMessage = 'Give your friends options by specifying possible locations'
    };

    //Check if dates and times options are specified
    if(!Object.keys($scope.dateTimes).length){
      eventValidation.timeMessage = 'Tell your friends when to show by adding some Date and Time options'
    };
    
    //Check if Decide By date is specified
    if(!$scope.decideByTime.length){
      eventValidation.deadlineMessage = 'Let your friends know when you expect their response by specifying the decide-by date'
    };

    //Check if any of the above failed
    var errArr = Object.keys(eventValidation);
    if(errArr.length){
      $scope.validationMessage = errArr.map(function(key){
        return eventValidation[key] 
      }).join('\n');

      $scope.showValidationMessage = true;
      return;
    };

    $scope.showValidationMessage = false;
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
    Object.keys($scope.attendees).forEach(function(fbId){
      event.users.push(fbId);
    });

    //Add logged in user
    event.users.push($cookies.get('fbId'));

    Event.create(event).then(function(){
      $location.path("/events");
    })
  };
});