angular.module('CreateCtrl', []).controller('CreateController', function($scope, $cookies, $location, Location, User, Event) {

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
  $scope.dateTimeMessage = "Please enter a future date and time.";
  $scope.decideByMessage = "Please enter a future deadline earlier than the earliest event date.";
  $scope.showDateTimeMessage = false;
  $scope.showDecideByMessage = false;
  $scope.showSpiffy = false;


  // config and options for uib-datepicker
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.today = function(){
    $scope.dt = new Date();
  };
  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.popup1 = {
     opened: false
   };

   $scope.popup2 = {
     opened: false
   };

  // Handles opening of the date-options pop-up
  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };
  // Used for opening the deadline date-options popup
  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };



  //Toggle for Hide/Show Yelp results button
  $scope.toggle = true;
  var getFriends = function() {
    User.getFriends($cookies.get('fbId')).then(function(friends) {
      $scope.friends = friends;
    });
  };

  getFriends();

  $scope.addFriend = function(friend) {
    $scope.showLonelyMessage = false;
    $scope.attendees[friend.fbId] = friend;
  };

  $scope.addAllFriends = function() {
    $scope.showLonelyMessage = false;
    $scope.friends.forEach(function(friend) {
      $scope.attendees[friend.fbId] = friend;
    });
  }

  $scope.removeFriend = function(friend) {
    delete $scope.attendees[friend.fbId];
    $scope.showLonelyMessage = Object.keys($scope.attendees).length === 0 ? true : false;
  };

  Location.ip()
    .then(function(ipLocation) {
      $scope.location = ipLocation;
    })
    .catch(function(err) {
      console.error(err);
    });

  $scope.getUserLocation = function() {
    Location.browser()
      .then(function(browserLocation) {
        $scope.location = browserLocation;
      })
      .catch(function(err) {
        $scope.locationError = err;
      });
  };

  //Fires up Yelp search for restaurants based on 'Add location' form on create.html
  $scope.submit = function() {
    if ($scope.location) {
      $scope.showSpiffy = true;
      Event.searchYelp($scope.term || "food", $scope.location).then(function(results) {
        $scope.showSpiffy = false;
        $scope.yelpResults = results.data.businesses;
      }).catch(function(err) {
        console.log(err);
      });
    }
  };

  $scope.addRemoveLocation = function(restaurant) {
    //Create a unique for the locations object
    var uniqueKey = restaurant.location.coordinate.latitude + '-' + restaurant.location.coordinate.longitude;
    if($scope.locations[uniqueKey]) {
      delete $scope.locations[uniqueKey];
    } else {
      $scope.locations[uniqueKey] = restaurant;
    }
    $scope.showNoLocationsMessage = Object.keys($scope.locations).length === 0 ? true : false;
  };

  $scope.addDateTimes = function() {

    if (!$scope.time){
      $scope.showDateTimeMessage = true;
      return;
    }

    // ng-model = "date"


    var dateTime = new Date(1*$scope.date + 1*$scope.time-8*3600*1000);

    if(dateTime < Date.now()) {
      $scope.showDateTimeMessage = true;
      return;
    } else {
      $scope.showDateTimeMessage = false;
    }
    $scope.dateTimes[dateTime] = dateTime;

  };

  $scope.removeDateTime = function(dateTime) {
    delete $scope.dateTimes[dateTime];
  };

  $scope.addDecideByTime = function() {
    //Allow only one decideBy time
    if(!$scope.decideByTime.length) {
      var decideBy = new Date(1*$scope.decideDate + 1*$scope.decideTime-8*3600*1000);
      var minDateAndTime = Math.min.apply(null, Object.keys($scope.dateTimes).map(function(key) {
        return 1*$scope.dateTimes[key];
      }));
      if(decideBy < Date.now() || decideBy > minDateAndTime) {
        $scope.showDecideByMessage = true;
        return;
      } else {
        $scope.showDecideByMessage = false;
      }
      $scope.decideByTime.push(decideBy);
    }
  };

  $scope.removeDecideBy = function() {
    $scope.decideByTime.pop();
  };

  $scope.submitEvent = function() {
    var eventValidation = {};
    //Check if event name is present
    if(!$scope.eventName) {
      eventValidation.eventMessage = 'Please enter an event name';
    }

    //Check if event description is present TODO OPTIONAL?


    //Check if attendees have been added to the event
    if(!Object.keys($scope.attendees).length) {
      eventValidation.attendeeMessage = 'Invite some friends to the party';
    }

    //Check if location options are specified
    if(!Object.keys($scope.locations).length) {
      eventValidation.locationsMessage = 'Give your friends options by specifying possible locations';
    }

    //Check if dates and times options are specified
    if(!Object.keys($scope.dateTimes).length) {
      eventValidation.timeMessage = 'Tell your friends when to show by adding some Date and Time options';
    }

    //Check if Decide By date is specified
    if(!$scope.decideByTime.length) {
      eventValidation.deadlineMessage = 'Let your friends know when you expect their response by specifying the decide-by date';
    }

    //Check if any of the above failed
    var errArr = Object.keys(eventValidation);
    if(errArr.length) {
      $scope.validationMessage = errArr.map(function(key) {
        return eventValidation[key];
      }).join('\n');

      $scope.showValidationMessage = true;
      return;
    }

    $scope.showValidationMessage = false;
    var event = {};
    event.name = $scope.eventName;
    event.description = $scope.eventDescription;
    event.deadline = $scope.decideByTime[0];
    //TODO ADD ADMIN USER DATA ON EVENT LISTING
    event.host = $cookies.getAll();

    //Add locations from locations object
    event.locations = [];
    Object.keys($scope.locations).forEach(function(key) {
      event.locations.push({location: $scope.locations[key], votes: 0});
    });

    //Add dates and times from dateTime object
    event.dates = [];
    Object.keys($scope.dateTimes).forEach(function(key) {
      event.dates.push({date:$scope.dateTimes[key], votes: 0});
    });

    //Add attendee fbId's from attendees object
    event.users = [];
    Object.keys($scope.attendees).forEach(function(fbId) {
      event.users.push(fbId);
    });

    event.emails = [];
    Object.keys($scope.attendees).forEach(function(fbId) {
      event.emails.push(fbId.email);
    });
    //Add logged in user
    event.users.push($cookies.get('fbId'));

    console.log("EVENT EMAILS ARE ,", event.emails);

    Event.create(event).then(function() {
      $location.path("/events");
    });
  };
});
