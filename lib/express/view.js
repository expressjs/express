
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
    http = require('http'),
    fs = require('fs');

/**
 * Cache supported template engine exports.
 */

var engines = {};

/**
 * View cache.
 */
 
var cache = { views: {}, partials: {} };

/**
 * View helpers (merged with locals).
 */

var helpers = exports.helpers = {};

/**
 * Render _view_ partial with _options_.
 *
 * Options:
 *   - as:          String name for the id used to which "collection" assign it's current value.
 *   - collection:  Array of objects, the name is derived from
 *                  the view name itself. For example 'video.haml.html'
 *                  will have an object "video" available to it.
 *
 * @param  {String} view
 * @param  {Object} options
 * @return {String}
 * @api public
 */

http.ServerResponse.prototype.partial = function(view, options){
    options = options || {};
    options.partial = true;
    options.layout = false;
    if (options.collection) {
        var name = options.as || view.split('.')[0].
            len = options.collection.length;
        options.locals = options.locals || {};
        options.locals.__length__ = len;
        return options.collection.map(function(val, i){
            options.locals.__isFirst = i === 0;
            options.locals.__index = i;
            options.locals.__n = i + 1;
            options.locals.__isLast = i === len - 1;
            return this.render(view, options);
        }, this);
    } else {
        this.render(view, options);
    }
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, however otherwise a response of _200_ and _text/html_ is given.
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
        root = options.root || this.app.set('views') || process.cwd() + '/views',
        path = root + '/' + view,
        ext = extname(view),
        layout = options.layout === undefined ? true : options.layout,
        layout = layout === true
            ? 'layout' + ext
            : layout;

    // Send response
    function send(str) {
        self.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': str.length
        });
        self.end(str);
    }

    // Render
    fs.readFile(path, 'utf8', function(err, str){
        // TODO: error handling
        var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));
        str = engine.render(str, options);
        if (layout) {
            options.locals = options.locals || {};
            options.layout = false;
            options.locals.body = str;
            self.render(layout, options);
        } else if (fn) {
            fn(null, str);
        } else {
            send(str);
        }
    });
};
