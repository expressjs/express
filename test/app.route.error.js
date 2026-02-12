'use strict';

var assert = require('assert');
var express = require('../');

describe('app.route error handling', function(){
  it('should enhance path-to-regexp error with path information', function(){
    var app = express();

    // This should throw an error with enhanced message
    try {
      app.route('/:'); // Missing parameter name after :
      throw new Error('Expected error was not thrown');
    } catch (err) {
      if (err instanceof TypeError) {
        // Error message should include the path
        assert.ok(err.message.includes('Missing parameter name'), 'Error message should include "Missing parameter name"');
        assert.ok(err.message.includes('for path "/:"'), 'Error message should include the path "/:"');
      } else {
        throw err;
      }
    }
  });

  it('should enhance path-to-regexp error with path information for wildcard', function(){
    var app = express();

    // This should throw an error with enhanced message
    try {
      app.route('/*'); // Missing parameter name after *
      throw new Error('Expected error was not thrown');
    } catch (err) {
      if (err instanceof TypeError) {
        // Error message should include the path
        assert.ok(err.message.includes('Missing parameter name'), 'Error message should include "Missing parameter name"');
        assert.ok(err.message.includes('for path "/*"'), 'Error message should include the path "/*"');
      } else {
        throw err;
      }
    }
  });

  it('should enhance path-to-regexp error with path information for complex routes', function(){
    var app = express();

    // This should throw an error with enhanced message
    try {
      app.route('/users/:/profile'); // Missing parameter name in middle
      throw new Error('Expected error was not thrown');
    } catch (err) {
      if (err instanceof TypeError) {
        // Error message should include the path
        assert.ok(err.message.includes('Missing parameter name'), 'Error message should include "Missing parameter name"');
        assert.ok(err.message.includes('for path "/users/:/profile"'), 'Error message should include the path "/users/:/profile"');
      } else {
        throw err;
      }
    }
  });

  it('should not modify non-path-to-regexp errors', function(){
    var app = express();

    // This should not throw an error
    var route = app.route('/valid/path');
    assert.ok(route, 'Route should be created successfully');
  });

  it('should not modify valid parameter routes', function(){
    var app = express();

    // This should not throw an error
    var route = app.route('/:id');
    assert.ok(route, 'Route should be created successfully');
  });
});