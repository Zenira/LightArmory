'use strict';
var express = require('express');
exports.configureApp = function(req, res) {
	// ---[ App Configuration ]------------------------
	req.app.set('view engine', 'html');
	req.app.set('views', __dirname + '/views');
	req.app.engine('html', require('ejs').renderFile);

	req.app.use('/favicon.ico', express.static('favicon.ico'));
	req.app.use('/favicon-32x32.png', express.static('favicon-32x32.png'));
	req.app.use('/favicon-16x16.png', express.static('favicon-16x16.png'));
	req.app.use('/manifest.json', express.static('manifest.json'));
	req.app.use('/apple-touch-icon.png', express.static('apple-touch-icon.png'));
	req.app.use('/safari-pinned-tab.svg', express.static('safari-pinned-tab.svg'));

};