'use strict'

var path = require('node:path')
var assert = require('node:assert')
const View = require('../lib/view.js');


describe('View.prototype.render', function () {
    it('should force callback to be async and pass correct arguments', function (done) {
      var mockEngine = function (filePath, options, callback) {
        callback(null, 'rendered content');
      };
  
      var view = new View('test', {
        root: path.join(__dirname, 'fixtures'),
        engines: { '.tmpl': mockEngine },
        defaultEngine: '.tmpl'
      });
  
      var isAsync = false;
  
      var originalCallback = function (err, html) {
        assert(isAsync, 'Callback should be async');
        assert.strictEqual(err, null, 'Error should be null');
        assert.strictEqual(html, 'rendered content', 'Rendered content should match');
        done();
      };
  
      view.render({}, function (err, html) {
        isAsync = true;
        originalCallback(err, html);
      });
    });
  
    it('should handle errors correctly', function (done) {
      var mockEngine = function (filePath, options, callback) {
        callback(new Error('render error'));
      };
  
      var view = new View('test', {
        root: path.join(__dirname, 'fixtures'),
        engines: { '.tmpl': mockEngine },
        defaultEngine: '.tmpl'
      });
  
      view.render({}, function (err, html) {
        assert(err instanceof Error, 'Error should be an instance of Error');
        assert.strictEqual(err.message, 'render error', 'Error message should match');
        assert.strictEqual(html, undefined, 'HTML should be undefined when there is an error');
        done();
      });
    });
  
    it('should handle synchronous callbacks correctly', function (done) {
      var mockEngine = function (filePath, options, callback) {
        callback(null, 'sync rendered content');
      };
  
      var view = new View('test', {
        root: path.join(__dirname, 'fixtures'),
        engines: { '.tmpl': mockEngine },
        defaultEngine: '.tmpl'
      });
  
      var isAsync = false;
  
      var originalCallback = function (err, html) {
        assert(isAsync, 'Callback should be async');
        assert.strictEqual(err, null, 'Error should be null');
        assert.strictEqual(html, 'sync rendered content', 'Rendered content should match');
        done();
      };
  
      view.render({}, function (err, html) {
        isAsync = true;
        originalCallback(err, html);
      });
    });
  
    it('should pass correct arguments to the engine', function (done) {
      var mockEngine = function (filePath, options, callback) {
        assert.strictEqual(filePath, view.path, 'File path should match');
        assert.deepStrictEqual(options, { key: 'value' }, 'Options should match');
        callback(null, 'rendered content');
      };
  
      var view = new View('test', {
        root: path.join(__dirname, 'fixtures'),
        engines: { '.tmpl': mockEngine },
        defaultEngine: '.tmpl'
      });
  
      view.render({ key: 'value' }, function (err, html) {
        assert.strictEqual(err, null, 'Error should be null');
        assert.strictEqual(html, 'rendered content', 'Rendered content should match');
        done();
      });
    });
  });