'use strict';
var configDB = {
	client: 'mysql',
	connection: {
		host     : 'localhost',
		user     : 'zenira_la8',
		password : '5OUQ1&72P1xD',
		database : 'laszdb_lightarmory'
	}
}

var knex = require('knex')(configDB);
var bookshelf = require('bookshelf')(knex);
module.exports = bookshelf;