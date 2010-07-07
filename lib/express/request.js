
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