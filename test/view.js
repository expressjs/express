'use strict';

const path = require('node:path');
const assert = require('node:assert');
const View = require('../lib/view.js');

describe('View.prototype.render', function() {
  it('should ensure callback is always async', function(done) {
    const mockEngine = function(filePath, options, callback) {
      callback(null, 'rendered content');
    };

    const view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    view.render({}, function(err, html) {
      isAsync = true;
      assert.strictEqual(err, null);
      assert.strictEqual(html, 'rendered content');
      done();
    });

    assert.strictEqual(isAsync, false, 'Callback was executed synchronously!');
  });

  it('should handle errors correctly', function(done) {
    const mockEngine = function(filePath, options, callback) {
      callback(new Error('render error'));
    };

    const view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    view.render({}, function(err, html) {
      isAsync = true;
      assert(err instanceof Error);
      assert.strictEqual(err.message, 'render error');
      assert.strictEqual(html, undefined);
      done();
    });

    assert.strictEqual(isAsync, false, 'Error callback was executed synchronously!');
  });

  it('should handle synchronous engine callbacks correctly', function(done) {
    const mockEngine = function(filePath, options, callback) {
      return callback(null, 'sync rendered content');
    };

    const view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    view.render({}, function(err, html) {
      isAsync = true;
      assert.strictEqual(err, null);
      assert.strictEqual(html, 'sync rendered content');
      done();
    });

    assert.strictEqual(isAsync, false, 'Callback from synchronous engine was not properly delayed!');
  });

  it('should pass correct arguments to the engine', function(done) {
    const expectedOptions = { key: 'value' };
    
    const mockEngine = function(filePath, options, callback) {
      assert.strictEqual(filePath, view.path);
      assert.deepStrictEqual(options, expectedOptions);
      callback(null, 'rendered content');
    };

    const view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    view.render(expectedOptions, function(err, html) {
      isAsync = true;
      assert.strictEqual(err, null);
      assert.strictEqual(html, 'rendered content');
      done();
    });

    assert.strictEqual(isAsync, false, 'Callback was executed synchronously!');
  });
});