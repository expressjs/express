
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Framework version.
 */

exports.version = '1.0.0rc';

/**
 * Module dependencies.
 */

var Server = exports.Server = require('./server');

/**
 * Shortcut for `new Server(...)`.
 *
 * @param {Function} ...
 * @return {Server}
 * @api public
 */

exports.createServer = function(){
    return new Server(Array.prototype.slice.call(arguments));
};

/**
 * View extensions.
 */

require('./view');
require('./request');
require('./response');
