
// first:
// $ npm install tas fac --save

// faux model

var fac = require('fac');

var User = {
	init: function (name, age, species) {
		this.name = name;
		this.age = age;
		this.species = species;
		return this;
	},

	all: function(fn){

		// process.nextTick makes sure this function API
		// behaves in an asynchronous manner, like if it
		// was a real DB query to read all users.
		process.nextTick(function(){
			fn(null, users);
		});
	},

	count: function(fn){
		process.nextTick(function(){
			fn(null, users.length);
		});
	}
};

// Pack User to User() via fac (the abbreviation of the "factory").
User = fac(User);

// faux database
var users = [];

// Use User() instead of Object.create(User).init(), neat!
users.push(User('Tobi', 2, 'ferret'));
users.push(User('Loki', 1, 'ferret'));
users.push(User('Jane', 6, 'ferret'));
users.push(User('Luna', 1, 'cat'));
users.push(User('Manny', 1, 'cat'));

module.exports = (User);
