
/*!
 * Express - Server
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys'),
    connect = require('connect'),
    router = require('connect/middleware/router');

/**
 * Initialize a new Server with optional middleware.
 *
 * @param {Array} middleware
 * @api public
 */

var Server = exports = module.exports = function Server(middleware){
    var self = this;
    this.config = {};
    this.settings = {};
    connect.Server.call(this, middleware || []);
    this.use('/', router(function(app){
        self.routes = app;
    }));
};

sys.inherits(Server, connect.Server);

/**
 * Listen on the given `port` after running configuration blocks.
 *
 * @param {Number} port
 * @api public
 */

Server.prototype.listen = function(port){
    var env = process.env.EXPRESS_ENV || process.connectEnv.name;
    this.runConfig('any', env);
    connect.Server.prototype.listen.call(this, port);
};

/**
 * Run config callbacks for the given environment(s);
 *
 * @param {String} env ...
 * @return {Server}
 * @api public
 */

Server.prototype.runConfig = function(){
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
 * Assign `setting` to `val`, or return `setting`'s value.
 *
 * @param {String} setting
 * @param {String} val
 * @return {Server|Mixed} this for chaining, or the setting value
 * @api public
 */

Server.prototype.set = function(setting, val){
    if (val === undefined) {
        return this.settings[setting];
    } else {
        this.settings[setting] = val;
        return this;
    }
};

/**
 * Enable setting.
 *
 * @param {String} setting
 * @return {Server}
 * @api public
 */

Server.prototype.enable = function(setting){
    return this.set(setting, true);
};

/**
 * Disable setting.
 *
 * @param {String} setting
 * @return {Server}
 * @api public
 */

Server.prototype.disable = function(setting){
    return this.set(setting, false);
};

/**
 * Disable setting.
 *
 * @param {String} setting
 * @return {Server}
 * @api public
 */

Server.prototype.configure = function(env, fn){
    if (typeof env === 'function') fn = env, env = 'any';
    (this.config[env] = this.config[env] || []).push(fn);
    return this;
};

// Generate RESTful methods

(function(method){
    Server.prototype[method] = function(path, fn){
        this.routes[method](path, fn);
        return this;
    };
    return arguments.callee;
})('get')('post')('put')('del');
