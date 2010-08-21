
/**
 * Module dependencies.
 */

var fs = require('fs');

exports.boot = function(app){
    bootControllers(app);
};

// Bootstrap controllers

function bootControllers(app) {
    fs.readdir(__dirname + '/controllers', function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            bootController(app, file);
        });
    });
}

// Example (simplistic) controller support

function bootController(app, file) {
    var name = file.replace('.js', ''),
        actions = require('./controllers/' + name),
        plural = name + 's', // realistically we would use an inflection lib
        prefix = '/' + plural; 

    // Special case for "app"
    if (name == 'app') {
        prefix = '/';
    }

    Object.keys(actions).map(function(action){
        var fn = controllerAction(name, plural, action, actions[action]);
        switch(action) {
            case 'index':
                app.get(prefix, fn);
                break;
            case 'show':
                app.get(prefix + '/:id', fn);
                break;
            case 'add':
                app.get(prefix + '/:id/add', fn);
                break;
            case 'create':
                app.post(prefix + '/:id', fn);
                break;
            case 'edit':
                app.get(prefix + '/:id/edit', fn);
                break;
            case 'update':
                app.put(prefix + '/:id', fn);
                break;
            case 'destroy':
                app.del(prefix + '/:id', fn);
                break;
        }
    });
}

// Proxy res.render() to add some magic

function controllerAction(name, plural, action, fn) {
    return function(req, res, next){
        var render = res.render,
            path = __dirname + '/views/' + name + '/' + action + '.html';
        res.render = function(obj, options, fn){
            res.render = render;
            options = options || {};
            options.locals = options.locals || {};
            // Expose obj as the "users" or "user" local
            if (action == 'index') {
                options.locals[plural] = obj;
            } else {
                options.locals[name] = obj;
            }
            return res.render(path, options, fn);
        };
        fn.apply(this, arguments);
    };
}