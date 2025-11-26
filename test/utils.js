'use strict'

var assert = require('node:assert');
const { Buffer } = require('node:buffer');
var utils = require('../lib/utils');

describe('utils.etag(body, encoding)', function(){
  it('should support strings', function(){
    assert.strictEqual(utils.etag('express!'),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support utf8 strings', function(){
    assert.strictEqual(utils.etag('express❤', 'utf8'),
      '"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

  it('should support buffer', function(){
    assert.strictEqual(utils.etag(Buffer.from('express!')),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support empty string', function(){
    assert.strictEqual(utils.etag(''),
      '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.normalizeType acceptParams method', () => {
  it('should handle a type with a malformed parameter and break the loop in acceptParams', () => {
    const result = utils.normalizeType('text/plain;invalid');
    assert.deepEqual(result,{
      value: 'text/plain',
      quality: 1,
      params: {} // No parameters are added since "invalid" has no "="
    });
  });
});


describe('utils.setCharset(type, charset)', function () {
  it('should do anything without type', function () {
    assert.strictEqual(utils.setCharset(), undefined);
  });

  it('should return type if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html'), 'text/html');
  });

  it('should keep charset if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=utf-8'), 'text/html; charset=utf-8');
  });

  it('should set charset', function () {
    assert.strictEqual(utils.setCharset('text/html', 'utf-8'), 'text/html; charset=utf-8');
  });

  it('should override charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=iso-8859-1', 'utf-8'), 'text/html; charset=utf-8');
  });
});

describe('utils.wetag(body, encoding)', function(){
  it('should support strings', function(){
    assert.strictEqual(utils.wetag('express!'),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support utf8 strings', function(){
    assert.strictEqual(utils.wetag('express❤', 'utf8'),
      'W/"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

  it('should support buffer', function(){
    assert.strictEqual(utils.wetag(Buffer.from('express!')),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support empty string', function(){
    assert.strictEqual(utils.wetag(''),
      'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.etagCors(body, encoding, headers)', function(){
  it('should support strings without headers', function(){
    var etag1 = utils.etagCors('express!', 'utf8', {});
    var etag2 = utils.etagCors('express!', 'utf8', {});
    assert.strictEqual(etag1, etag2);
    assert.strictEqual(etag1.startsWith('"'), true);
  })

  it('should generate different ETags for different origins', function(){
    var etag1 = utils.etagCors('express!', 'utf8', {
      'access-control-allow-origin': 'https://a.com'
    });
    var etag2 = utils.etagCors('express!', 'utf8', {
      'access-control-allow-origin': 'https://b.com'
    });
    assert.notStrictEqual(etag1, etag2);
  })

  it('should generate same ETag for same origin', function(){
    var headers = { 'access-control-allow-origin': 'https://a.com' };
    var etag1 = utils.etagCors('express!', 'utf8', headers);
    var etag2 = utils.etagCors('express!', 'utf8', headers);
    assert.strictEqual(etag1, etag2);
  })

  it('should work with lowercase header names (as returned by getHeaders)', function(){
    // Node.js getHeaders() always returns lowercase keys
    var headers = { 'access-control-allow-origin': 'https://a.com' };
    var etag1 = utils.etagCors('express!', 'utf8', headers);
    var etag2 = utils.etagCors('express!', 'utf8', headers);
    assert.strictEqual(etag1, etag2);
    // Verify it includes the header in the hash
    var etagWithoutHeader = utils.etagCors('express!', 'utf8', {});
    assert.notStrictEqual(etag1, etagWithoutHeader);
  })

  it('should handle missing CORS headers gracefully', function(){
    var etagWithoutCORS = utils.etagCors('express!', 'utf8', {
      'content-type': 'text/plain'
    });
    // Should still generate an ETag (falls back to body-only)
    assert.ok(etagWithoutCORS);
    assert.strictEqual(etagWithoutCORS.startsWith('"'), true);
  })

  it('should support buffer with headers', function(){
    var etag1 = utils.etagCors(Buffer.from('express!'), undefined, {
      'access-control-allow-origin': 'https://a.com'
    });
    var etag2 = utils.etagCors(Buffer.from('express!'), undefined, {
      'access-control-allow-origin': 'https://b.com'
    });
    assert.notStrictEqual(etag1, etag2);
  })

  it('should be backward compatible without headers parameter', function(){
    var etag = utils.etagCors('express!');
    assert.ok(etag);
    assert.strictEqual(etag, '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"');
  })
})

describe('utils.wetagCors(body, encoding, headers)', function(){
  it('should generate weak ETags', function(){
    var etag = utils.wetagCors('express!', 'utf8', {
      'access-control-allow-origin': 'https://example.com'
    });
    assert.ok(etag.startsWith('W/"'));
  })

  it('should generate different weak ETags for different origins', function(){
    var etag1 = utils.wetagCors('express!', 'utf8', {
      'access-control-allow-origin': 'https://a.com'
    });
    var etag2 = utils.wetagCors('express!', 'utf8', {
      'access-control-allow-origin': 'https://b.com'
    });
    assert.notStrictEqual(etag1, etag2);
    assert.ok(etag1.startsWith('W/"'));
    assert.ok(etag2.startsWith('W/"'));
  })

  it('should be backward compatible without headers', function(){
    var etag = utils.wetagCors('express!');
    assert.strictEqual(etag, 'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"');
  })
})
