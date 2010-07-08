
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var extname = require('path').extname,
    mime = require('connect/utils').mime,
    utils = require('connect/utils'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs');

/**
 * Cache supported template engine exports to
 * increase performance by lowering the number
 * of calls to `require()`.
 * 
 * @type Object
 */

var cache = {};

/**
 * Cache view contents to prevent I/O hits.
 *
 * @type Object
 */

var viewCache = {};

/**
 * Clear the view cache.
 *
 * @api public
 */

exports.clearCache = function(){
    viewCache = {};
};

/**
 * Cache view at the given `path`.
 *
 * @param {String} padth
 * @return {String}
 * @api private
 */

function cacheView(path) {
    return viewCache[path] = fs.readFileSync(path, 'utf8');
}

/**
 * Return view root path for the given `app`.
 *
 * @param {express.Server} app
 * @return {String}
 * @api private
 */

function viewRoot(app) {
    return app.set('views') || process.cwd() + '/views';
}

/**
 * Setup view reloading, checking at the given `interval`
 * which defaults to 5 minutes.
 *
 * @param {Numbers} interval
 * @api private
 */

exports.watcher = function(interval){
    interval = interval === true
        ? 300000
        : interval;
    (function cache(dir){
        fs.readdir(dir, function(err, files){
            if (!err) {
                files.forEach(function(file){
                    file = dir + '/' + file;
                    fs.stat(file, function(err, stats){
                        if (!err) {
                            if (stats.isFile()) {
                                fs.watchFile(file, { interval: interval }, function(curr, prev){
                                    if (curr.mtime > prev.mtime) {
                                        cacheView(file);
                                    }
                                });
                            } else if (stats.isDirectory()) {
                                cache(file);
                            }
                        }
                    });
                });
            }
        });
    })(viewRoot(this));
};

/**
 * Render `view` partial with the given `options`.
 *
 * Options:
 *   - `as` Variable name for each `collection` value, defaults to the view name.
 *     * as: 'something' will add the `something` local variable
 *     * as: this will use the collection value as the template context
 *     * as: global will merge the collection value's properties with `locals`
 *
 *   - `collection` Array of objects, the name is derived from the view name itself. 
 *     For example _video.html_ will have a object _video_ available to it.
 *
 * @param  {String} view
 * @param  {Object|Array} options or collection
 * @return {String}
 * @api public
 */

http.ServerResponse.prototype.partial = function(view, options, ext){
    if (ext && view.indexOf('.') < 0) {
        view += ext;
    }
    if (options instanceof Array) {
        options = { collection: options };
    }
    options = options || {};
    options.partial = true;
    options.layout = false;
    var collection = options.collection;
    if (collection) {
        var name = options.as || view.split('.')[0],
            len = collection.length;
        var locals = options.locals = options.locals || {};
        locals.collectionLength = len;
        return collection.map(function(val, i){
            if (typeof name === 'string') {
                locals[name] = val;
            } else if (name === global) {
                utils.merge(locals, val);
            } else {
                options.context = val;
            }
            locals.firstInCollection = i === 0;
            locals.indexInCollection = i;
            locals.lastInCollection = i === len - 1;
            return this.render(view, options);
        }, this).join('');
    } else {
        return this.render(view, options);
    }
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, however otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  Most engines accept one or more of the following options,
 *  both _haml_ and _jade_ accept all:
 *
 *  - `context`   Template evaluation context (`this`)
 *  - `locals`    Object containing local variables
 *  - `filename`  Filename used for the `cache` option
 *  - `cache`     Cache intermediate JavaScript in memory
 *  - `debug`     Output debugging information
 *
 * @param  {String} view
 * @param  {Object} options
 * @param  {Function} fn
 * @api public
 */

http.ServerResponse.prototype.render = function(view, options, fn){
    options = options || {};

    // Defaults
    var self = this,
        root = viewRoot(this.app),
        ext = extname(view),
        partial = options.partial,
        layout = options.layout === undefined ? true : options.layout,
        layout = layout === true
            ? 'layout' + ext
            : layout;

    // Auto-cache in production
    if (this.app.set('env') === 'production') {
        options.cache = true;
    }

    // Partials support
    if (options.partial) {
        root += '/partials';
    }

    // View path
    var path = root + '/' + view;

    // Send response
    function send(str) {
        self.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': str.length
        });
        self.end(str);
    }

    // Pass filename to the engine and view
    options.locals = options.locals || {};
    options.locals.__filename = options.filename = path;

    // Always expose partial() as a local
    options.locals.partial = function(view, options){
        return self.partial.call(self, view, options, ext);
    };

    function error(err) {
        if (fn) {
            fn(err);
        } else {
            throw err;
        }
    }

    // Cache contents
    try {
        var str = viewCache[path] || cacheView(path);
    } catch (err) {
        return error(err);
    }

    // Cache template engine exports
    var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));

    // Attempt render
    try {
        var str = engine.render(str, options);
    } catch (err) {
        return error(err);
    }

    // Layout support
    if (layout) {
        options.layout = false;
        options.locals.body = str;
        self.render(layout, options);
    } else if (partial) {
        return str;
    } else if (fn) {
        fn(null, str);
    } else {
        send(str);
    }
};
