
var site = {
	index: function(req, res){
		res.render('index', { title: 'Route Separation Example' });
	}
};

module.exports = (site);
