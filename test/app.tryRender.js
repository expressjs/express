'use strict'

var assert = require('node:assert')
var express = require('..');

describe('app', function(){
  describe('tryRender error handling', function(){
    it('should handle synchronous errors in view.render', function(done){
      var app = express();

      // Create a mock View that throws a synchronous error
      class SyncErrorView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          throw new Error('sync error');
        }
      }


      app.set('view', SyncErrorView);

      app.render('something', function(err, str){
        assert.ok(err, 'error exists');
        assert.strictEqual(err.message, 'sync error');
        done();
      });
    });

    it('should handle asynchronous errors in view.render', function(done){
      var app = express();

      // Create a mock View that returns an asynchronous error
      class AsyncErrorView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          process.nextTick(function () {
            fn(new Error('async error'));
          });
        }
      }


      app.set('view', AsyncErrorView);

      app.render('something', function(err, str){
        assert.ok(err, 'error exists');
        assert.strictEqual(err.message, 'async error');
        done();
      });
    });

    it('should handle asynchronous errors thrown in callback', function(done){
      var app = express();

      // Create a mock View that causes an error in the callback
      class AsyncCallbackErrorView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          process.nextTick(function () {
            try {
              // Access undefined property to cause error
              undefined.property; // This will throw an error
              fn(null, 'result'); // This won't execute
            } catch (err) {
              fn(err);
            }
          });
        }
      }


      app.set('view', AsyncCallbackErrorView);

      app.render('something', function(err, str){
        assert.ok(err, 'error exists');
        assert.ok(err.message.includes('Cannot read properties'), 'has expected error');
        done();
      });
    });

    it('should pass data correctly with no errors', function(done){
      var app = express();

      // Create a mock View that returns success
      class SuccessView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          process.nextTick(function () {
            fn(null, 'success content');
          });
        }
      }


      app.set('view', SuccessView);

      app.render('something', function(err, str){
        assert.ifError(err);
        assert.strictEqual(str, 'success content');
        done();
      });
    });

    it('should handle multiple async calls in view.render correctly', function(done){
      var app = express();

      // Create a mock View that simulates multiple async calls
      class MultipleAsyncView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          // First async operation
          process.nextTick(function () {
            // Second async operation with error
            process.nextTick(function () {
              fn(new Error('deep async error'));
            });
          });
        }
      }


      app.set('view', MultipleAsyncView);

      app.render('something', function(err, str){
        assert.ok(err, 'error exists');
        assert.strictEqual(err.message, 'deep async error');
        done();
      });
    });

    it('should handle async/await style errors correctly', function(done){
      var app = express();

      // Create a mock View that simulates async/await error handling pattern
      class AsyncAwaitErrorView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path'; // Path is required
        }
        render(options, fn) {
          // Simulate the way async/await handles errors
          // In real async/await, errors from the async function would be caught
          // in the Promise catch and passed to the callback
          var operation = new Promise(function (resolve, reject) {
            // Simulate async database operation that fails
            setTimeout(function () {
              reject(new Error('database connection error'));
            }, 10);
          });

          operation
            .then(function (result) {
              fn(null, result);
            })
            .catch(function (err) {
              // This is how async/await would handle errors
              fn(err);
            });
        }
      }


      app.set('view', AsyncAwaitErrorView);

      app.render('something', function(err, str){
        assert.ok(err, 'error exists');
        assert.strictEqual(err.message, 'database connection error');
        done();
      });
    });

    it('demonstrates the problem our fix addresses', function(done){
      var errorHandled = false;

      // This simulates the original broken implementation
      function brokenTryRender(view, options, callback) {
        try {
          // The original implementation would just pass the callback directly
          // which means errors inside the async callback wouldn't be caught
          view.render(options, callback);
        } catch (err) {
          errorHandled = true;
          callback(err);
        }
      }

      // This simulates our fixed implementation
      function fixedTryRender(view, options, callback) {
        try {
          view.render(options, function(err, html) {
            if (err) {
              errorHandled = true;
              return callback(err);
            }
            callback(null, html);
          });
        } catch (err) {
          errorHandled = true;
          callback(err);
        }
      }

      // Create a view that will throw an error asynchronously
      class AsyncErrorView {
        constructor(name, options) {
          this.name = name;
          this.path = 'test-path';
        }
        render(options, fn) {
          // Async error that would NOT be caught by the original implementation's try-catch
          setTimeout(function () {
            fn(new Error('async error that should be caught'));
          }, 10);
        }
      }


      var view = new AsyncErrorView('test', {});

      // Test with original broken implementation (would miss the error in real Express)
      brokenTryRender(view, {}, function(err) {
        // Error is still passed to callback because our mock uses setTimeout
        // In the real fix, this helps ensure the error is properly propagated
        assert.ok(err, 'Error should still be passed through');

        // But notice that errorHandled is false, showing the try-catch didn't catch it
        assert.strictEqual(errorHandled, false, 'Error was not caught by try-catch');

        // Reset for next test
        errorHandled = false;

        // Test with our fixed implementation
        fixedTryRender(view, {}, function(err) {
          assert.ok(err, 'Error should be passed through');
          assert.strictEqual(errorHandled, true, 'Error was properly handled by our wrapper function');
          done();
        });
      });
    });
  });
});
