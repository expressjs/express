
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Framework version.
 */

exports.version = '0.14.0';

/**
 * Module dependencies.
 */

var Server = require('./server');

exports.createServer = function(middleware){
    return new Server(middleware);
};