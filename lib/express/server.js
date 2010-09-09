
/*!
 * Express - Server
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sys = require('sys'),
    url = require('url'),
    view = require('./view'),
    connect = require('connect'),
    utils = require('connect/utils'),
    queryString = require('querystring'),
    router = require('connect/middleware/router');

/**
 * Initialize a new `Server` with optional `middleware`.
 *
 * @param {Array} middleware
 * @api public
 */

var Server = exports = module.exports = function Server(middleware){
    var self = this;
    this.config = {};
    this.settings = {};
    this.redirects = {};
    this.viewHelpers = {};
    this.dynamicViewHelpers = {};
    this.errorHandlers = [];
    connect.Server.call(this, middleware || []);

    // Default "home" to / 
    this.set('home', '/');

    // Set "env" to EXPRESS_ENV or connectEnv.name
    this.set('env',
        process.env.EXPRESS_ENV ||
        process.connectEnv.name);

    // Expose objects to each other
    this.use(function(req, res, next){
        req.query = {};
        res.headers = {};
        req.app = res.app = self;
        req.res = res;
        res.req = req;
        req.next = next;
        // Assign req.params.get
        if (req.url.indexOf('?') > 0) {
            var query = url.parse(req.url).query;
            req.query = queryString.parse(query);
        }
        next();
    });

    // Use router, expose as app.get(), etc
    var fn = router(function(app){ self.routes = app; });
    this.__defineGetter__('router', function(){
        this.__usedRouter = true;
        return fn;
    });
};

/**
 * Inherit from `connect.Server`.
 */

sys.inherits(Server, connect.Server);

/**
 * Proxy in order to register error handlers.
 */

Server.prototype.listen = function(){
    this.registerErrorHandlers();
    connect.Server.prototype.listen.apply(this, arguments);
};

/**
 * Proxy in order to register error handlers.
 */

Server.prototype.listenFD = function(){
    this.registerErrorHandlers();
    connect.Server.prototype.listenFD.apply(this, arguments);
};

/**
 * Register error handlers. This is automatically
 * called from within `Server#listen()` and `Server#listenFD()`.
 *
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.registerErrorHandlers = function(){
    this.errorHandlers.forEach(function(fn){
        this.use(function(err, req, res, next){
            fn.apply(this, arguments);
        });
    }, this);
    return this;
};

/**
 * Proxy `connect.Server#use()` to apply settings to
 * mounted applications.
 *
 * @param {String|Function|Server} route
 * @param {Function|Server} middleware
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.use = function(route, middleware){
    if (typeof route !== 'string') {
        middleware = route, route = '/';
    }

    connect.Server.prototype.use.call(this, route, middleware);

    // Mounted an app
    if (middleware instanceof Server) {
        // Home is /:route/:home
        var app = middleware,
            home = app.set('home');
        if (home === '/') home = '';
        app.set('home', (app.route || '') + home);
        // Mounted hook
        if (app.__mounted) app.__mounted.call(app, this);
    }

    return this;
};

/**
 * Assign a callback `fn` which is called
 * when this `Server` is passed to `Server#use()`.
 *
 * Examples:
 *
 *    var app = express.createServer(),
 *        blog = express.createServer();
 *
 *    blog.mounted(function(parent){
 *        // parent is app
 *        // "this" is blog
 *    });
 *
 *    app.use(blog);
 *
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.mounted = function(fn){
    this.__mounted = fn;
    return this;
};

/**
 * See: view.register.
 *
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.register = function(){
    view.register.apply(this, arguments);
    return this;
};

/**
 * Register the given view helpers `obj`. This method
 * can be called several times to apply additional helpers.
 *
 * @param {Object} obj
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.helpers = function(obj){
    utils.merge(this.viewHelpers, obj);
    return this;
};

/**
 * Register the given dynamic view helpers `obj`. This method
 * can be called several times to apply additional helpers.
 *
 * @param {Object} obj
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.dynamicHelpers = function(obj){
    utils.merge(this.dynamicViewHelpers, obj);
    return this;
};

/**
 * Assign a custom exception handler callback `fn`.
 * These handlers are always _last_ in the middleware stack.
 *
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.error = function(fn){
    this.errorHandlers.push(fn);
    return this;
};

/**
 * Assign `setting` to `val`, or return `setting`'s value.
 *
 * @param {String} setting
 * @param {String} val
 * @return {Server|Mixed} for chaining, or the setting value
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
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.enable = function(setting){
    return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.disable = function(setting){
    return this.set(setting, false);
};

/**
 * Redirect `key` to `url`.
 *
 * @param {String} key
 * @param {String} url
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.redirect = function(key, url){
    this.redirects[key] = url;
    return this;
};

/**
 * Configure callback for the given `env`.
 *
 * @param {String} env
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.configure = function(env, fn){
    if (typeof env === 'function') {
        fn = env, env = 'all';
    }
    if (env === 'all' || this.set('env') === env) {
        fn.call(this);
    }
    return this;
};

// Generate routing methods

(function(method){
    Server.prototype[method] = function(path, fn){
        if (!this.__usedRouter) {
            this.use(this.router);
        }
        this.routes[method](path, fn);
        return this;
    };
    return arguments.callee;
})('get')('post')('put')('del');
