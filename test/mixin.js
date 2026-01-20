var assert = require('node:assert');
var mixin = require('../lib/utils').mixin;

describe('express mixin helper', function() {
  it('throws when destination is missing', function() {
    assert.throws(
      function() {
        mixin(null, {});
      },
      /destination/
    );
  });

  it('throws when source is missing', function() {
    assert.throws(
      function() {
        mixin({});
      },
      /source/
    );
  });

  it('copies descriptors and preserves getter behavior', function() {
    var source = {};
    var calls = 0;
    Object.defineProperty(source, 'value', {
      get: function() {
        calls++;
        return 'ok';
      },
      enumerable: false,
      configurable: true
    });

    var target = {};
    mixin(target, source);

    assert.strictEqual(target.value, 'ok');
    assert.strictEqual(calls, 1);
    var desc = Object.getOwnPropertyDescriptor(target, 'value');
    assert.strictEqual(typeof desc.get, 'function');
    assert.strictEqual(desc.enumerable, false);
  });

  it('skips existing keys when overwrite is false', function() {
    var target = {};
    Object.defineProperty(target, 'value', {
      value: 'original',
      writable: true,
      configurable: true,
      enumerable: false
    });

    mixin(target, { value: 'new' }, false);

    assert.strictEqual(target.value, 'original');
    assert.strictEqual(Object.getOwnPropertyDescriptor(target, 'value').enumerable, false);
  });

  it('overwrites existing keys by default', function() {
    var target = { value: 'original' };
    mixin(target, { value: 'new' });
    assert.strictEqual(target.value, 'new');
  });
});
