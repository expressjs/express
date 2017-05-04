
// these two objects will serve as our faux database

var repos = [
	{ name: 'express', url: 'http://github.com/expressjs/express' }
	, { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
	, { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

var users = [
	{ name: 'tobi' }
	, { name: 'loki' }
	, { name: 'jane' }
];

var userRepos = {
	tobi: [repos[0], repos[1]]
	, loki: [repos[1]]
	, jane: [repos[2]]
};

module.exports = {
	repos: repos,
	users: users,
	userRepos: userRepos
};
