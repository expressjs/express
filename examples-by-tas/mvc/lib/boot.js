/**
 * Module dependencies.
 */

var express = require('../../express');
var tas = require('tas');
var fs = require('fs');
var path = require('path');
var route = require('./route');

var boot = {
	do: function(parent, options){
		var verbose = options.verbose;
		var dir = path.join(__dirname, '..', 'controllers');
		var app;
		var fileName;

		tas(function(){

			// Use readdir() instead of readdirSync() to improve performance
			fs.readdir(dir, function(err, data){

				// after fs.readdir() execution is completed, then go to next task.
				tas.next(data);
			});

			// Prevent Tas from continuing the subsequent tasks.
			return "await";
		});

		tas.forEach("files", {
			init: function(file){
				fileName = file;
				app = express();
			},

			loadFile: function(){
				var file = path.join(dir, fileName);
				if (!fs.statSync(file).isDirectory()) return "break";

				verbose && console.log('\n	 %s:', fileName);
				return [require(file)];
			},

			setViews: function(obj){
				var name = obj.name || fileName;

				// allow specifying the view engine
				if (obj.engine) app.set('view engine', obj.engine);
				app.set('views', path.join(__dirname, '..', 'controllers', name, 'views'));

				return [obj, name];
			},

			setRoutes: function(obj, name){

				// generate routes based
				// on the exported methods
				for (var key in obj) {

					// "reserved" exports
					if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
					route.set(app, verbose, obj, key, name);
				}
			},

			mountTheApp: function(){
				parent.use(app);
			}
		});
	}
};

module.exports = (boot);
