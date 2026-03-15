
/**
 * Module dependencies.
 * @private
 */

var assert = require('node:assert');
const { Buffer } = require('node:buffer');

/**
 * Module exports.
 * @public
 */

exports.shouldHaveBody = shouldHaveBody
exports.shouldHaveHeader = shouldHaveHeader
exports.shouldNotHaveBody = shouldNotHaveBody
exports.shouldNotHaveHeader = shouldNotHaveHeader;
exports.shouldSkipQuery = shouldSkipQuery

/**
 * Assert that a supertest response has a specific body.
 *
 * @param {Buffer} buf
 * @returns {function}
 */

function shouldHaveBody (buf) {
  return function (res) {
    var body = !Buffer.isBuffer(res.body)
      ? Buffer.from(res.text)
      : res.body
    assert.ok(body, 'response has body')
    assert.strictEqual(body.toString('hex'), buf.toString('hex'))
  }
}

/**
 * Assert that a supertest response does have a header.
 *
 * @param {string} header Header name to check
 * @returns {function}
 */

function shouldHaveHeader (header) {
  return function (res) {
    assert.ok((header.toLowerCase() in res.headers), 'should have header ' + header)
  }
}

/**
 * Assert that a supertest response does not have a body.
 *
 * @returns {function}
 */

function shouldNotHaveBody () {
  return function (res) {
    assert.ok(res.text === '' || res.text === undefined)
  }
}

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

function getMajorVersion(versionString) {
  return versionString.split('.')[0];
}

function shouldSkipQuery(versionString) {
  // Skipping HTTP QUERY tests below Node 22, QUERY wasn't fully supported by Node until 22
  // we could update this implementation to run on supported versions of 21 once they exist
  // upstream tracking https://github.com/nodejs/node/issues/51562
  // express tracking issue: https://github.com/expressjs/express/issues/5615
  return Number(getMajorVersion(versionString)) < 22
}

