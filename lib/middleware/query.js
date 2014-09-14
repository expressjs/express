/**
 * Module dependencies.
 */

var parseUrl = require('parseurl');
var qs = require('qs');

/**
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function query(options) {
  var queryparse = qs.parse;

  if (typeof options === 'function') {
    queryparse = options;
    options = undefined;
  }

  return function query(req, res, next){
    if (!req.query) {
      var val = parseUrl(req).query;
      req.query = queryparse(val, options);
    }

    next();
  };
};
