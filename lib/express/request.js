
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
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @api public
 */

http.IncomingMessage.prototype.__defineGetter__('isXMLHttpRequest', function(){
    return (this.headers['x-requested-with'] || '').toLowerCase() === 'xmlhttprequest';
});