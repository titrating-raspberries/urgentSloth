// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var nerdSchema = new mongoose.Schema({
    name : {type : String, default: ''}
});

module.exports = mongoose.model('Nerd', nerdSchema);