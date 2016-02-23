//script to periodically delete events that have occurred from the db
//and to periodically check if an event has been "decided"

var deleteOldEvents = function(){
  //current date
  var now = new Date();
  //add setTime initially to null
  //then remove anything who's set time is 
  db.collection.remove({'setDate':{'$lt': new Date()} })



  //first find all events w set dates later than today
  mongoose.model.find()
  //then find any users with those events
  //splice those events from the user's array
  //then remove them from events db

};
setInterval(function(){
  deleteOldEvents();
  //setDecidedEvents();
}, 3600000);
