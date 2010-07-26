
/*!
 * Express - request
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http'),
    utils = require('./utils'),
    mime = require('connect/utils').mime;

/**
 * Return request header or optional default.
 *
 * Examples:
 *
 *     req.header('Content-Type');
 *     // => "text/plain"
 *     
 *     req.header('content-type');
 *     // => "text/plain"
 *     
 *     req.header('Accept');
 *     // => undefined
 *     
 *     req.header('Accept', 'text/html');
 *     // => "text/html"
 *
 * @param {String} name
 * @param {String} defaultValue
 * @return {String} 
 * @api public
 */

http.IncomingMessage.prototype.header = function(name, defaultValue){
    return this.headers[name.toLowerCase()] || defaultValue;
};

/**
 * Check if the _Accept_ header is present, and includes the given `type`.
 *
 * When the _Accept_ header is not present `true` is returned. Otherwise
 * the given `type` is matched by an exact match, and then subtypes. You
 * may pass the subtype such as "html" which is then converted internally
 * to "text/html" using the mime lookup table.
 *
 * Examples:
 * 
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => true
 *
 *     // Accept: text/*; application/json
 *     req.accepts('html');
 *     req.accepts('text/html');
 *     req.accepts('text/plain');
 *     req.accepts('application/json');
 *     // => true
 *
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => false
 *
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

http.IncomingMessage.prototype.accepts = function(type){
    var accept = this.header('Accept');
    if (!accept || accept === '*/*') {
        return true;
    } else if (type) {
        // Allow "html" vs "text/html" etc
        if (type.indexOf('/') < 0) {
            type = mime.types['.' + type];
        }
        // Check if we have a direct match
        if (accept.indexOf(type) >= 0) {
            return true;
        // Check if we have type/*
        } else {
            type = type.split('/')[0] + '/*';
            return accept.indexOf(type) >= 0;
        }
    } else {
        return false;
    }
};

/**
 * Return the value of param `name` when present.
 *
 *  - Checks route placeholders, ex: _/user/:id_
 *  - Checks query string params, ex: ?id=12
 *  - Checks urlencoded body params, ex: id=12
 *
 * To utilize urlencoded request bodies, `req.body`
 * should be an object. This can be done by using
 * the `connect.bodyDecoder` middleware.
 *
 * @param {String} name
 * @return {String}
 * @api public
 */

http.IncomingMessage.prototype.param = function(name){
    // Route params like /user/:id
    if (this.params[name] !== undefined) {
        return this.params[name]; 
    }
    // Query string params
    if (this.query[name] !== undefined) {
        return this.query[name]; 
    }
    // Request body params via connect.bodyDecoder
    if (this.body && this.body[name] !== undefined) {
        return this.body[name];
    }
};

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */

http.IncomingMessage.prototype.flash = function(type, msg){
    var msgs = this.session.flash = this.session.flash || {};
    if (type && msg) {
        msg = utils.miniMarkdown(utils.htmlEscape(msg));
        return (msgs[type] = msgs[type] || []).push(msg);
    } else if (type) {
        var arr = msgs[type];
        delete msgs[type];
        return arr || [];
    } else {
        this.session.flash = {};
        return msgs;
    }
};

// Callback for isXMLHttpRequest / xhr

function isxhr() {
    return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */

http.IncomingMessage.prototype.__defineGetter__('isXMLHttpRequest', isxhr);
http.IncomingMessage.prototype.__defineGetter__('xhr', isxhr);