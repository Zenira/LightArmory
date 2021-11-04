'use strict';
// app/models/user.js
var bcrypt   = require('bcrypt-nodejs');

var bookshelf = require('../../config/bookshelf');

//var Schema = require('schema'); // if we didn't define it below, we'd do this
//var sequence = require('when/sequence');
//var _ = require('lodash');

// define the schema for our user model
/*
var userSchema = {	
  users: {
    UserId: {type: 'increments', nullable: false, primary: true},
	Username: {type: 'string', maxlength: 100, nullable: false, unique: true},
    UserEmail: {type: 'string', maxlength: 254, nullable: false, unique: true},
    UserPassword: {type: 'string', maxlength: 100, nullable: false},
    LightUsername: {type: 'string', maxlength: 100, nullable: true},
    LightServer: {type: 'string', maxlength: 100, nullable: true},
    UserStatus: {type: 'string', maxlength: 100, nullable: false}
  },
  hero_grade: {
    HeroGradeId: {type: 'increments', nullable: false, primary: true},
	HeroId: {type: 'integer', nullable: false, unsigned: true},
	HeroGrade: {type: 'integer', nullable: false, unsigned: true},
	HeroGradeName: {type: 'string', maxlength: 100, nullable: false},
    HeroGradeIcon: {type: 'string', maxlength: 100, nullable: false}
  }
};
*/

var User = bookshelf.Model.extend({
	tableName: 'users',
	generateHash: function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	},
	validPassword: function(password, user) {
		// this.local.password doesn't exist, that was used in their schema.
		return bcrypt.compareSync(password, user.attributes.UserPassword);
	},
	findById: function(id, options) {
		return this.where('UserId', id).fetch(options);
	},
    findAll: function(filter, options) {
        return this.forge().where(filter).fetchAll(options);
    },
    findOne: function(query, options) {
        return this.forge(query).fetch(options);
    },
    create: function(data, options) {
        return this.forge(data).save(null, options);
    }
});

module.exports = User;