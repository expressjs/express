'use strict';

const path = require('node:path');
const assert = require('node:assert');
const view = require('../lib/view.js');
const fs = require('node:fs')

describe('view.prototype.render', function() {
  const fixturesDir = path.join(__dirname, 'fixtures');

  it('should ensure callback is always async', function(done) {
    const mockEngine = function(filePath, options, callback) {
      callback(null, 'rendered content');
    };

    const viewInstance = new view('test', {
      root: fixturesDir,
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    viewInstance.render({}, function(err, html) {
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

    const viewInstance = new view('test', {
      root: fixturesDir,
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    viewInstance.render({}, function(err, html) {
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

    const viewInstance = new view('test', {
      root: fixturesDir,
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    let isAsync = false;

    viewInstance.render({}, function(err, html) {
      isAsync = true;
      assert.strictEqual(err, null);
      assert.strictEqual(html, 'sync rendered content');
      done();
    });

    assert.strictEqual(isAsync, false, 'Callback from synchronous engine was not properly delayed!');
  });

  it('should pass correct arguments to the engine', function (done) {
    const tempDir = fs.mkdtempSync(path.join(__dirname, 'test-'));
    const expectedPath = path.join(tempDir, 'test.tmpl');
  
    fs.writeFileSync(expectedPath, 'template content');
  
    const mockEngine = (filePath, options, callback) => {
      try {
        assert.strictEqual(filePath, expectedPath, 'File path should match');
        assert.deepStrictEqual(options, { key: 'value' }, 'Options should match');
        callback(null, 'rendered content');
      } catch (err) {
        callback(err);
      }
    };
  
    const viewInstance = new view('test', {
      root: tempDir,
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });
  
    viewInstance.render({ key: 'value' }, (err, html) => {
      fs.rmSync(tempDir, { recursive: true, force: true });
  
      if (err) return done(err);
      try {
        assert.strictEqual(html, 'rendered content', 'Rendered content should match');
        done();
      } catch (assertErr) {
        done(assertErr);
      }
    });
  });
});