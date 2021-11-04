'use strict';
// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var configDB = require('./database');
var connection = mysql.createConnection(configDB.connection);

// Is this even necessary??
//connection.query('USE ' + configDB.database);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
		/*
		User.where('UserId', id).fetch().then(function(user) {
			if (user) {
				done(null, user);
			} else {
				// How do we handle errors?
				// Currently we see error text which we don't want
				// (try changing if (user) to if (!user)
				done(new Error('User does not exist'));
			}
		});
		*/
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
			if (err)
				return done(err);
			if (rows.length) {
				return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
			} else {
				// if there is no user with that username
				// create the user
				var newUserMysql = {
					Username: username,
					UserPassword: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
				};

				var insertQuery = "Insert Into users ( Username, UserPassword ) values (?,?)";

				connection.query(insertQuery,[newUserMysql.Username, newUserMysql.UserPassword],function(err, rows) {
					if(err) return done(err);
					newUserMysql.id = rows.UserId;

					return done(null, newUserMysql);
				});
			}
		});
	}));

    // =========================================================================
    // LOCAL LOGIN ============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
		connection.query("Select * From users Where username = ?",[username], function(err, rows){
			if (err)
				return done(err);
			if (!rows.length) {
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}

			// this password looks right.. it's what's saved in the db
			console.log("Password? " + rows[0].UserPassword);
			// STILL GETTING INCORRECT ARGUMENTS MESSAGE....
			// It's a mysql or bcrypt message. Don't know what's going on. 
			
			
			
			// if the user is found but the password is wrong
			//if (!bcrypt.compareSync(password, rows[0].UserPassword))
				//return done(null, false, req.flash('loginMessage', 'Your password was incorrect.')); // create the loginMessage and save it to session as flashdata

			// all is well, return successful user
			return done(null, rows[0]);
		});

    }));

};