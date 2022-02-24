'use strict';

module.exports = function(app, passport) {

    // =====================================
    // Home Page
    // =====================================
	app.get('/', function(req, res) {
		res.render("index.html", {user_data : req.user});
	});	
	
    // =====================================
    // Login
    // =====================================
    // Show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') }); 
    });
	
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the login page if there is an error
		failureFlash : true // allow flash messages
	}),
        function(req, res) {
		res.redirect('/profile');
    });

    // =====================================
    // Signup
    // =====================================
    // Show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });
	
	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // Profile
    // =====================================
    // We will want this protected so you have to be logged in to visit
    // We will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user_data : req.user // get the user out of session and pass to
        });
    });
	
	// =====================================
    // Logout
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // Heroes Roster
    // =====================================
	app.get('/heroes', function(req, res) {
		var page_name = "all_heroes";  
		var params = { data: [], page_name: page_name, user_data : req.user};
		res.render("heroes.html", params);	
	});
	
	// Display individual hero information
	app.get('/heroes/:name', function(req, res) {
		var page_name = "heroes";
		var hero_name = req.params.name;
		var qstr = 'Select * From `heroes` Where `HeroName` = ?';
		var qstrValue = hero_name;
		
		querySelect(qstr, qstrValue, function(rows) {
			if (rows) {
				params = { hero: rows[0], page_name: page_name, user_data : req.user };
			} else {
				params = { error: 'invalid_hero', page_name: page_name, user_data : req.user };
			}
			res.render("heroes.html", params);
		});
		
	});
	
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
	
}
