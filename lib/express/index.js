
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys'),
    connect = require('connect'),
    rest = require('connect/providers/rest');

/**
 * Framework version.
 */

exports.version = '0.14.0';

/**
 * Configuration callbacks.
 */

exports.config = [];

/**
 * Initialize a new Application with optional middleware.
 *
 * @param {Array} middleware
 * @api public
 */

function Application(middleware){
    this.routes = { get: [], post: [], put: [], del: []};
    connect.Server.call(this, (middleware || []).concat([
        { provider: 'rest', routes: this.routes }
    ]));
}

sys.inherits(Application, connect.Server);

// Generate RESTful methods

(function(method){
    Application.prototype[method] = function(path, fn){
        var routes = {};
        routes[method] = {};
        routes[method][path] = fn;
        rest.normalize(routes);
        this.routes[method] = this.routes[method].concat(routes[method]);
    };
    return arguments.callee;
})('get')('post')('put')('del');

/**
 * Return a new application with optional middleware.
 *
 * @param {Array} middleware
 * @return {Application}
 * @api public
 */

exports.createApplication = function(middleware){
    return new Application(middleware);
};