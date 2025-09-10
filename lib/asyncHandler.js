'use strict';

/**
 * Wrap async route handlers and pass errors to next().
 *
 * @param {Function} fn - the async route handler
 * @return {Function} wrapped handler
 * @api public
 */
module.exports = function asyncHandler(fn) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
