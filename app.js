var express 	 = require('express');
var port 		 = 20702;
var app 		 = express();
var mysql 		 = require('mysql');
var passport 	 = require('passport');
var flash		 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configEnv 	 = require('./config/env');
var configHTTPS  = require('./config/require_https');
//var bookshelf 	 = require('./config/bookshelf');

var configDB 	 = require('./config/database');
var connection	 = mysql.createConnection(configDB.connection);

if (app.get('env') === "development") {
	configDB.connection.debug = true;
}

// ---[ App Configuration ]------------------------
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
  extended: true
}));
app.use(bodyParser.json()); // parse application/json 

app.set('env', configEnv.environment);	// Set Environment
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

require('./config/passport')(passport); // pass passport for configuration

// required for passport
var sess = { 
	secret: '{{woops_its_a_secret}}',
	resave: false,
	saveUninitialized: false
};

// Set environment-specific functionality
if (app.get('env') === 'production') {
	sess.cookie.secure = true // serve secure cookies
	app.all('*', configHTTPS.ensureSecure); // Force HTTPS
} else {
	app.use("/static", express.static(__dirname + '/static'));
}

// Use passport session
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Static images
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/favicon-32x32.png', express.static('favicon-32x32.png'));
app.use('/favicon-16x16.png', express.static('favicon-16x16.png'));
app.use('/manifest.json', express.static('manifest.json'));
app.use('/apple-touch-icon.png', express.static('apple-touch-icon.png'));
app.use('/safari-pinned-tab.svg', express.static('safari-pinned-tab.svg'));

// Routes 
require('./app/routes.js')(app, passport); // load routes and pass in app and fully configured passport

// ---[ Start App ]------------------------
app.listen(port, function() {
	console.log("listening on port " + port);
});


// ---[ Graceful Shutdown on App Close ]------------------------
process.on( 'SIGINT', function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	
	// Closing procedures
	connection.destroy();
	
	process.exit( );
})

// 
// Return a formatted display of the hero's icon
app.locals.getHeroIcon = function(hero_name, hero_icon){
	var icon = '';
	if (hero_icon !== '' && hero_icon !== null)  {
		icon = '<a href="/heroes/'+hero_name+'"><img src="/static/img/hero_icons/'+hero_icon+'" class="heroIcon" title="'+hero_name+'" alt="'+hero_name+'"></a>';
	}
	return icon;
}

// Return a formatted display of the hero's name, linked to the hero's profile
app.locals.getHeroNameLink = function(hero_name) {
	return '<a href="/heroes/'+hero_name+'">'+hero_name+'</a>';
}

// Return a formatted display of stars based on grade and awakening
app.locals.getHeroStars = function(grade, awakening){
	var stars = '<span style="display:none">'+grade+'</span>';
  var starColors = new Array('gold', 'green', 'blue', 'purple', 'orange', 'red');
	var starIcon = 'gold_star.png';
  
	if (awakening !== undefined && awakening > 0) {
    starIcon = starColors[awakening]+'_star.png';        
	}
  
	for (var i = grade; i > 0; i--) {
		stars += '<img src="/static/img/icons/'+starIcon+'">';		
	}
	return stars;
}

// Return a formatted attribute icon with attribute name for searching
app.locals.getHeroAttribute = function(attribute){
	var attributeIconName = "element_" + attribute.toLowerCase() + ".png";	
	return '<span style="display:none">'+attribute+'</span><img src="/static/img/icons/'+attributeIconName+'" alt="'+attribute+'" title="'+attribute+'" class="attributeIcon">';
}

// Return a formatted class icon with class name for searching
app.locals.getHeroClass = function(hero_class){
	console.log(hero_class);
}

module.exports = app;
//module.exports.bookshelf = bookshelf;
