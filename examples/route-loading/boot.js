
/**
 * Module dependencies.
 */

var vm = require('vm')
  , fs = require('fs');

module.exports = function(app, db){
  var dir = __dirname + '/routes';
  // grab a list of our route files
  fs.readdirSync(dir).forEach(function(file){
    var str = fs.readFileSync(dir + '/' + file, 'utf8');
    // inject some pseudo globals by evaluating
    // the file with vm.runInNewContext()
    // instead of loading it with require(). require's
    // internals use similar, so dont be afraid of "boot time".
    var context = { app: app, db: db };
    // we have to merge the globals for console, process etc
    for (var key in global) context[key] = global[key];
    // note that this is essentially no different than ... just using
    // global variables, though it's only YOUR code that could influence
    // them, which is a bonus.
    vm.runInNewContext(str, context, file);
  });
};