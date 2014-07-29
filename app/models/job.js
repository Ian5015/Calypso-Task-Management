// app/models/job.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var jobSchema = mongoose.Schema({

    location       : String,
    priority       : { type: Number, min: 0, max: 5 },
    workerAssigned : String,
    isJobCompleted   : Boolean,
    
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Job', jobSchema);
