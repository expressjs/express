
var middleware = {
	init: function(path){
		var obj = require(path);

		return function(req, res){
			res.format(obj);
		};
	}
};

module.exports = (middleware);
