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

  it('should default to application/octet-stream when mime lookup fails', () => {
    const result = utils.normalizeType('unknown-extension-xyz');
    assert.deepEqual(result, {
      value: 'application/octet-stream',
      params: {}
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

describe('utils.compileETag()', function () {
  it('should return generateETag for true', function () {
    const fn = utils.compileETag(true);
    assert.strictEqual(fn('express!'), utils.wetag('express!'));
  });

  it('should return undefined for false', function () {
    assert.strictEqual(utils.compileETag(false), undefined);
  });

  it('should return generateETag for string values "strong" and "weak"', function () {
    assert.strictEqual(utils.compileETag('strong')("express"), utils.etag("express"));
    assert.strictEqual(utils.compileETag('weak')("express"), utils.wetag("express"));
  });

  it('should throw for unknown string values', function () {
    assert.throws(() => utils.compileETag('foo'), TypeError);
  });

  it('should throw for unsupported types like arrays and objects', function () {
    assert.throws(() => utils.compileETag([]), TypeError);
    assert.throws(() => utils.compileETag({}), TypeError);
  });
});

describe('utils.compileQueryParser()', function () {
  it('should return a function for true', function () {
    var fn = utils.compileQueryParser(true);
    assert.strictEqual(typeof fn, 'function');
  });

  it('should return a function for "simple"', function () {
    var fn = utils.compileQueryParser('simple');
    assert.strictEqual(typeof fn, 'function');
  });

  it('should parse simple query strings', function () {
    var fn = utils.compileQueryParser('simple');
    var result = fn('foo=bar&baz=qux');
    assert.strictEqual(result.foo, 'bar');
    assert.strictEqual(result.baz, 'qux');
  });

  it('should return a function for "extended"', function () {
    var fn = utils.compileQueryParser('extended');
    assert.strictEqual(typeof fn, 'function');
  });

  it('should parse nested query strings with extended', function () {
    var fn = utils.compileQueryParser('extended');
    var result = fn('foo[bar]=baz');
    assert.deepStrictEqual(result, { foo: { bar: 'baz' } });
  });

  it('should return undefined for false', function () {
    assert.strictEqual(utils.compileQueryParser(false), undefined);
  });

  it('should return the function when given a custom function', function () {
    var custom = function (str) { return str; };
    assert.strictEqual(utils.compileQueryParser(custom), custom);
  });

  it('should throw for unknown string values', function () {
    assert.throws(function () { utils.compileQueryParser('bogus'); }, TypeError);
  });
});

describe('utils.compileTrust()', function () {
  it('should return a function for true', function () {
    var fn = utils.compileTrust(true);
    assert.strictEqual(typeof fn, 'function');
    assert.strictEqual(fn('127.0.0.1'), true);
  });

  it('should return the function when given a custom function', function () {
    var custom = function () { return false; };
    assert.strictEqual(utils.compileTrust(custom), custom);
  });

  it('should support numeric trust (hop count)', function () {
    var fn = utils.compileTrust(2);
    assert.strictEqual(typeof fn, 'function');
    assert.strictEqual(fn('127.0.0.1', 0), true);
    assert.strictEqual(fn('127.0.0.1', 1), true);
    assert.strictEqual(fn('127.0.0.1', 2), false);
  });

  it('should support comma-separated string values', function () {
    var fn = utils.compileTrust('127.0.0.1, 10.0.0.1');
    assert.strictEqual(typeof fn, 'function');
  });

  it('should return a function for undefined/falsy', function () {
    var fn = utils.compileTrust(undefined);
    assert.strictEqual(typeof fn, 'function');
  });
});

describe('utils.normalizeTypes()', function () {
  it('should normalize an array of types', function () {
    var result = utils.normalizeTypes(['html', 'json']);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].value, 'text/html');
    assert.strictEqual(result[1].value, 'application/json');
  });

  it('should handle full MIME types', function () {
    var result = utils.normalizeTypes(['text/plain', 'application/json']);
    assert.strictEqual(result[0].value, 'text/plain');
    assert.strictEqual(result[1].value, 'application/json');
  });

  it('should handle an empty array', function () {
    var result = utils.normalizeTypes([]);
    assert.strictEqual(result.length, 0);
  });

  it('should handle MIME types with quality parameters', function () {
    var result = utils.normalizeTypes(['text/html;q=0.9']);
    assert.strictEqual(result[0].value, 'text/html');
    assert.strictEqual(result[0].quality, 0.9);
  });
});
