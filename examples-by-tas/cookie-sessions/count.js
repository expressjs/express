
var count = {
	do: function (req, res) {
		var n = (req.session.count || 0) + 1;
		req.session.count = n;
		res.send('viewed ' + n + ' times\n');
	}
};

module.exports = (count);
