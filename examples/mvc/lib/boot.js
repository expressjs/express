/**
 * Module dependencies.
 */

var express = require('../../..');
var path = require('path');
var fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;
  fs.readdirSync(path.join(__dirname, '/../controllers')).forEach(function(name){
    if (!fs.statSync(path.join(__dirname, '/../controllers/', name)).isDirectory()) return;
    verbose && console.log('\n   %s:', name);
    var obj = require('./../controllers/' + name);
    var name = obj.name || name;
    var prefix = obj.prefix || '';
    var app = express();
    var handler;
    var method;
    var actPath;

    // allow specifying the view engine
    if (obj.engine) app.set('view engine', obj.engine);
    app.set('views', path.join(__dirname, '/../controllers/', name, '/views'));

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          actPath = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          actPath = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          actPath = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          actPath = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          actPath = '/' + name;
          break;
        case 'index':
          method = 'get';
          actPath = '/';
          break;
        default:
          /* istanbul ignore next */
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      // setup
      handler = obj[key];
      actPath = prefix + actPath;

      // before middleware support
      if (obj.before) {
        app[method](actPath, obj.before, handler);
        verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), actPath, key);
      } else {
        app[method](actPath, handler);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), actPath, key);
      }
    }

    // mount the app
    parent.use(app);
  });
};
