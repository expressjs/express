
var express = require('../../..')
  , fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./../controllers/' + name)
      , name = obj.name || name
      , prefix = obj.prefix || ''
      , app = express()
      , method
      , path;

    // allow specifying the view engine
    if (obj.engine) app.set('view engine', obj.engine);
    app.set('views', __dirname + '/../controllers/' + name + '/views');

    // before middleware support
    if (obj.before) {
      path = '/' + name + '/:' + name + '_id';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
      path = '/' + name + '/:' + name + '_id/*';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
    }

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          path = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          path = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          path = '/' + name;
          break;
        case 'index':
          method = 'get';
          path = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      path = prefix + path;
      app[method](path, obj[key]);
      verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
    }

    // mount the app
    parent.use(app);
  });
};