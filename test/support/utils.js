
/**
 * Module dependencies.
 * @private
 */
var assert = require('assert');

/**
 * Module exports.
 * @public
 */
exports.shouldNotHaveHeader = shouldNotHaveHeader;

/**
 * Assert that a supertest response does not have a header.
 *
 * @param {string} header Header name to check
 * @returns {function}
 */
function shouldNotHaveHeader(header) {
  return function (res) {
    assert.ok(!(header.toLowerCase() in res.headers), 'should not have header ' + header);
  };
}
