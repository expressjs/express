
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
 * Initialize a new Application with optional middleware.
 *
 * @param {Array} middleware
 * @api public
 */

function Application(middleware){
    this.config = {};
    this.settings = {};
    this.routes = { get: [], post: [], put: [], del: []};
    connect.Server.call(this, (middleware || []).concat([
        { provider: 'rest', routes: this.routes }
    ]));
}

sys.inherits(Application, connect.Server);

/**
 * Listen on the given port after running configuration blocks.
 *
 * @param {Number} port
 * @api public
 */

Application.prototype.listen = function(port){
    this.runConfig('any', 'development');
    connect.Server.prototype.listen.call(this, port);
};

/**
 * Run config callbacks for the given environment(s);
 *
 * @param {String} env ...
 * @return {Application}
 * @api public
 */

Application.prototype.runConfig = function(){
    for (var i = 0, len = arguments.length; i < len; ++i) {
        var env = arguments[i];
        if (env in this.config) {
            var config = this.config[env];
            config.forEach(function(fn){
                fn.call(this);
            }, this);
        }
    }
    return this;
};


/**
 * Assign setting a value
 *
 * @param {String} setting
 * @param {String} val
 * @return {Application}
 * @api public
 */

Application.prototype.set = function(setting, val){
    this.settings[setting] = val;
    return this;
};

/**
 * Enable setting.
 *
 * @param {String} setting
 * @return {Application}
 * @api public
 */

Application.prototype.enable = function(setting){
    return this.set(setting, true);
};

/**
 * Disable setting.
 *
 * @param {String} setting
 * @return {Application}
 * @api public
 */

Application.prototype.disable = function(setting){
    return this.set(setting, false);
};

/**
 * Disable setting.
 *
 * @param {String} setting
 * @return {Application}
 * @api public
 */

Application.prototype.configure = function(env, fn){
    if (typeof env === 'function') fn = env, env = 'any';
    (this.config[env] = this.config[env] || []).push(fn);
};

// Generate RESTful methods

(function(method){
    Application.prototype[method] = function(path, fn){
        var routes = {};
        routes[method] = {};
        routes[method][path] = fn;
        rest.normalize(routes);
        this.routes[method] = this.routes[method].concat(routes[method]);
        return this;
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