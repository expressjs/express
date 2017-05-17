
var db = require('../db');

var post = {
	list: function(req, res){
		res.render('posts', { title: 'Posts', posts: db.posts });
	}
};

module.exports = (post);
