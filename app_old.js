var express = require('express');
var app = express();
var port = 20702;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'zenira_la8',
  password : '5OUQ1&72P1xD',
  database : 'laszdb_lightarmory'
});

connection.connect(function(err) {
	if (err) throw err;
});

// Graceful shutdown on app close
process.on( 'SIGINT', function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	
	// Closing procedures
	//connection.end();
	
	process.exit( );
})

// Set the view engine to html
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.listen(port, function() {
	console.log("listening on port " + port);
})

app.use("/static", express.static(__dirname + '/static'));
// Favicons and manifest
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/favicon-32x32.png', express.static('favicon-32x32.png'));
app.use('/favicon-16x16.png', express.static('favicon-16x16.png'));
app.use('/manifest.json', express.static('manifest.json'));
app.use('/apple-touch-icon.png', express.static('apple-touch-icon.png'));
app.use('/safari-pinned-tab.svg', express.static('safari-pinned-tab.svg'));

// Display the index page
app.get('/', function(req, res) {
	res.render(__dirname + "/index.html");
});

// Heroes database
app.get('/heroes', function(req, res) {
	res.render(__dirname + "/heroes.html");
});

// Look up hero information
app.get('/heroes/:name', function(req, res) {
	var hero_name = req.params.name;
	var qstr = 'Select * From `heroes` Where `HeroName` = ?';
	var qstrValue = hero_name;
	
	querySelect(qstr, qstrValue, function(rows) {
		if (rows) {
			params = { hero_data: rows[0] };
		} else {
			params = { error: 'invalid_hero' };
		}
		res.render(__dirname + "/heroes.html", params);
	});
});

app.get('/admin/heroes/update', function(req, res) {	
	var valuePairs = {
		'HeroName': 'Nia',
		'HeroGrade': 5
	};
	var wherePairs = { 'HeroId': 1 };
	
	/*
	queryUpdate('heroes', valuePairs, wherePairs, function() {
		// callback
	});
	*/
});

// Query Database with Select
function querySelect(qstr, qstrValue, callback) {
	connection.query(qstr, qstrValue, function(err, rows, fields) {
		if (err) throw err;		
		if (rows.length > 0) callback(rows);
		else callback(false);
	});
}

function queryInsert(post) {
	/*
	var post  = {id: 1, title: 'Hello MySQL'};
	var query = connection.query('Insert Into posts Set ?', post, function(err, result) {
	  // Neat!
	});
	console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
	*/
}

function queryUpdate(table, valuePairs, wherePairs, callback) {
	var qstr = 'Update '+table+' Set ';
	var qstrValues = [];
	
	for(var keys = Object.keys(valuePairs), i = 0, end = keys.length; i < end; i++) {
		var key = keys[i], value = valuePairs[key];
		qstr += key + ' = ?';
		qstrValues.push(value);
		if (i < end - 1) qstr += ', ';
	}
	
	qstr += ' Where ';
	
	for(var keys = Object.keys(wherePairs), i = 0, end = keys.length; i < end; i++) {
		var key = keys[i], value = wherePairs[key];
		qstr += key + ' = ?';
		qstrValues.push(value);
		if (i < end - 1) qstr += ' And ';
	}
	
	connection.query(qstr, qstrValues, function(err, rows) {
		if (err) throw err;	
		callback(rows.affectedRows);
	});
	
}

module.exports = app;