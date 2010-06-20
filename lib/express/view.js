
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
 * Render _view_ with _options_.
 *
 * Views are looked up relative to the'views' path setting. 
 * View filenames should conform to NAME.TYPE.ENGINE so for example
 * 'layout.html.ejs', 'ejs' represents the template engine, 'html'
 * represents the type of content being rendered, which is then passed
 * to contentType().
 *
 * Engines must export a render() method accepting the template string
 * and a hash of options. Engines can respond to the options listed below
 * as well as their own arbitrary ones. The "filename" option is always
 * passed as the path to the given _view_, allowing engines to perform
 * better error reporting.
 *
 * Options:
 *
 *  - encoding: Passed to Request#respond()
 *  - layout:   The layout to use, none when falsey. Defaults to 'layout'
 *  - locals:   Most engines support a hash of local variable names / values.
 *  - context:  Most engines support an evaluation context (the 'this' keyword). 
 *              Defaults to the current Request instance.
 *
 * Optionally you may also pass a _callback_ function which
 * will be called instead of responding with the 200 status code.
 *
 * @param  {String} view
 * @param  {Object} options
 * @param  {Function} fn
 * @api public
 */

http.ServerResponse.prototype.render = function(view, options){
    options = options || {};
    var type = options.partial ? 'partials' : 'views',
        path = set(type) + '/' + view,
        parts = view.split('.'),
        engine = parts[parts.length - 1],
        contentType = parts.slice(-2)[0],
        layout = options.layout === undefined ? 'layout' : options.layout;

    // Default filename and evaluation context
    options.filename = path;
    options.context = options.context || this;

    // Merge locals
    options.locals = options.locals || {};
    for (var key in helpers) {
        options.locals[key] = helpers[key];
    }

    // View contents
    var content = cache[type][path] || fs.readFileSync(path).toString(options.encoding || 'utf8');
    
    // Render the view
    content = (engines[engine] = engines[engine] || require(engine)).render(content, options);
    
    // Set Content-Type
    if (type === 'views' && !this.headers['Content-Type']) {
        this.headers['Content-Type'] = mime.type(contentType);
    }
    
    // Layout support
    if (layout) {
        layout = layout.indexOf('.') > 0
            ? [layout. contentType, engine].join('.')
            : layout;
        // TODO: callback
        // TODO: deep merge options
        this.render(layout, {
            layout: false,
            locals: { body: content }
        });
    } else if (type === 'partials') {
        return content;
        // TODO: callback
    } else {
        this.writeHead(200, content, options.encoding);
    }
};
