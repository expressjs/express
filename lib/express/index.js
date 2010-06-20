
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

var Application = require('./application').Application;

/**
 * Return a new application with optional middleware.
 *
 * @param {Array} middleware
 * @return {Application}
 * @api public
 */

exports.createApplication = function(middleware){
    return new Application(middleware);
};