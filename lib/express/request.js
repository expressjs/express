
/*!
 * Express - request
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http');

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
 * Examples:
 * 
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => true
 *
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

http.IncomingMessage.prototype.accepts = function(type){
    var accept = this.header('Accept'),
        type = String(type).trim();
    if (!accept || accept === '*/*') {
        return true;
    } else {
        return type
            ? accept.indexOf(type) >= 0
            : false;
    }
};


http.IncomingMessage.prototype.param = function(name){
    // Route params like /user/:id
    if (this.params.path[name] !== undefined) {
        return this.params.path[name]; 
    }
    // Query string params
    if (this.params.get[name] !== undefined) {
        return this.params.get[name]; 
    }
    // POST params via connect.bodyDecoder
    if (this.body && this.body[name] !== undefined) {
        return this.body[name];
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