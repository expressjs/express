module.exports.app = {}
module.exports.controllers = {}
module.exports.models = {}

module.exports.init = function(app) {
    if (app.set('applicationDirectory') === undefined) app.set('applicationDirectory', '/app/');
    if (app.set('moduleDirectory') === undefined) app.set('moduleDirectory', '/modules/');
    if (app.set('controllerDirectory') === undefined) app.set('controllerDirectory', '/controllers/');
    if (app.set('modelDirectory') === undefined) app.set('modelDirectory', '/models/');
    if (app.set('viewDirectory') === undefined) app.set('viewDirectory', '/views/');
    if (app.set('defaultModule') === undefined) app.set('defaultModule', 'index');
    if (app.set('defaultController') === undefined) app.set('defaultController', 'index');
    if (app.set('defaultAction') === undefined) app.set('defaultAction', 'index');

    module.exports.app = app;
    var util = require('util');
    var path = require('path');
    var fs = require('fs');

    var loadModule = function (modulePath, moduleName) {
        var loadComponents = function (type) {
            var componentsPath = path.join(modulePath, app.set(type + 'Directory'));
            //console.log(componentsPath);
            module.exports[type + 's'][moduleName] = {};

            var components = [];

            try {
                components = fs.readdirSync(componentsPath);
            } catch (e) {}

            if (components.length) {
                var componentPath, componentName;
                for (var i = 0; i < components.length; i++) {
                    componentPath = path.join(componentsPath, components[i]);
                    //console.log(componentPath);

                    componentName = components[i];
                    if (componentName.slice(-3) == '.js') {
                        componentName = componentName.slice(0,-3);
                    }

                    var component = require(componentPath);

                    module.exports[type +'s'][moduleName][componentName] = component;
                }
            }
        }

        loadComponents('controller');
        loadComponents('model');
    }

    var appPath = path.join(process.cwd() ,app.set('applicationDirectory'));

    loadModule(appPath, app.set('defaultModule'));

    var modulesPath = path.join(process.cwd(), app.set('applicationDirectory'), app.set('moduleDirectory'));

    //console.log(util.inspect(module.exports));

    //console.log(modulesPath);
    var modules = [];
    try {
        modules = fs.readdirSync(modulesPath);
    } catch (e) {}
    //console.log(modules)

    if (modules.length) {
        for (var i = 0; i < modules.length; i++) {
            //console.log(modules[i]);
            //console.log(util.inspect(module.exports.controllers));
            loadModule(path.join(modulesPath, modules[i]), modules[i]);
        }
    }

    //load models and controllers;

    app.all('/:module?/:controller?/:action?', function(request, response, next) {
        request.params.module = request.param('module', app.set('defaultModule'));
        request.params.controller = request.param('controller', app.set('defaultController'));
        request.params.action = request.param('action', app.set('defaultAction'));

        if (module.exports.controllers[request.params.module] == undefined) {
            request.params.controller = request.params.module;
            request.params.module = app.set('defaultModule');
        }

        //res.end(util.inspect(request.params));return;

        if (module.exports.controllers[request.params.module] == undefined || module.exports.controllers[request.params.module][request.params.controller] == undefined) {
            next();
            return;
        }

        var controller = new module.exports.controllers[request.params.module][request.params.controller]();

        if (controller[request.params.action + 'Action'] == undefined) {
            next();
            return;
        }

        //var path = require('path');

        if (request.params.module == app.set('defaultModule')) {
            app.set('views', process.cwd() + path.join(app.set('applicationDirectory'), app.set('viewDirectory')));
        } else {
            app.set('views', process.cwd() + path.join(app.set('applicationDirectory'), app.set('moduleDirectory'), request.params.module, app.set('viewDirectory')));
        }

        //console.log(app.set('views'));

        try {
            var helper = require('mvc/controller');
            helper = new helper(module.exports, module.exports.app, request, response);
            for (var i in helper) {
                controller[i] = helper[i];
            }

            //controller._render('index');
            //controller._model('message2s');


            if (controller.before != undefined) {
                controller.before();
            }

            controller[request.params.action + 'Action']();

            //console.log(controller.asd);
            //res.render(request.params.controller + '/' + request.params.action, controller._view);

            if (controller.after != undefined) {
                controller.after();
            }

            var _render = function () {
                return response.render(path.join(request.params.controller, request.params.action), controller._locals());
            }

            var _json = function () {
                return response.json(response.locals());
            }

            var _jsonp = function () {
                return response.send(request.query.callback + '(' + JSON.stringify(response.locals()) + ');');
            }

            var _xml = function () {
                return response.send(require('mvc/xml').XML.stringify(response.locals()));
            }

            if (controller._formats.length) {
                for (var i in controller._formats) {
                    if (request.is(controller._formats[i])) {
                        if (controller._formats[i] == 'html') {
                            _render();
                        } else if (controller._formats[i] == 'json') {
                            _json();
                        } else if (controller._formats[i] == 'javascript') {
                            _jsonp();
                        } else if (controller._formats[i] == 'xml') {
                            _xml();
                        }
                        break;
                    }
                }
                response.end();
            } else {
                _render();
            }

            //res.end();

            //console.log(util.inspect(request.params));


            //require('/var/www/mrzjs/eval2.js');
        } catch(e) {
            console.log(e.stack.toString());
            response.end(e.stack.toString());
        }
        //console.log('Server running at http://127.0.0.1:8124/');
    });
}