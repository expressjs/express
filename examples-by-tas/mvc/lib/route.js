
var route = {
	set: function(app, verbose, obj, key, name){
		var handler = obj[key];
		var prefix = obj.prefix || '';

		var r = route.getParameters(key, name); // route exports
		var method = r.method;
		var url = r.url;

		url = prefix + url;

		// before middleware support
		if (obj.before) {
			app[method](url, obj.before, handler);
			verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), url, key);
		}
		else {
			app[method](url, handler);
			verbose && console.log('     %s %s -> %s', method.toUpperCase(), url, key);
		}
	},

	getParameters: function(key, name){
		var method;
		var url;

		switch (key) {
			case 'show':
				method = 'get';
				url = '/' + name + '/:' + name + '_id';
				break;

			case 'list':
				method = 'get';
				url = '/' + name + 's';
				break;

			case 'edit':
				method = 'get';
				url = '/' + name + '/:' + name + '_id/edit';
				break;

			case 'update':
				method = 'put';
				url = '/' + name + '/:' + name + '_id';
				break;

			case 'create':
				method = 'post';
				url = '/' + name;
				break;

			case 'index':
				method = 'get';
				url = '/';
				break;

			default:
				/* istanbul ignore next */
				throw new Error('unrecognized route: ' + name + '.' + key);
		}

		return {method: method, url: url}
	}
};

module.exports = (route);
