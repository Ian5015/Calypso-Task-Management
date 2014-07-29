// server.js

// modules =================================================
var path = require('path');
var express = require('express');
var app     = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash')
var connect = require('connect');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var methodOverride = require('methodOverride');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

var configDB = require('./config/database.js');

// configuration ===========================================

mongoose.connect(configDB.url); //connect to the database

require('./config/passport')(passport);  //pass passport for configuration


app.use(express.static(path.join(__dirname + '/public'))); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(cookieParser());                    // read cookies (needed for auth)
app.use(bodyParser());
app.use(bodyParser()); 						// have the ability to pull information from html in POST
//app.use(methodOverride()); 					// have the ability to simulate DELETE and PUT

app.set('view engine', 'ejs');

app.use(connect.session({ secret: 'keyboard cat' }));
app.use(flash());

app.use(passport.initialize());                     // You need to tell express that you will be using passport and that 
app.use(passport.session());                        // it will be managing sessions for you.
//app.use(app.router);
    

/** Angoose bootstraping */
require("angoose").init(app, {
   'module-dirs':'app/models',
   'mongo-opts': 'localhost:27017/test',
});


// routes ==================================================
require('./app/routes.js')(app, passport); // configure our routes

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
