
/**
 * Module dependencies.
 * @private
 */

var assert = require('assert');
var Buffer = require('safe-buffer').Buffer

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
  // Temporarily skipping this test on 21 and 22
  // update this implementation to run on those release lines on supported versions once they exist
  // upstream tracking https://github.com/nodejs/node/pull/51719
  // express tracking issue: https://github.com/expressjs/express/issues/5615
  var majorsToSkip = {
    "21": true,
    "22": true
  }
  return majorsToSkip[getMajorVersion(versionString)]
}

