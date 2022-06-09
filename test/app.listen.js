'use strict'

var express = require('../')
var assert = require('assert')

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = express();

    var server = app.listen('1200', function(){
      server.close();
      done();
    });
  })
  it('should only accept numbers for port param', function(done){
    var app = express();
    assert.throws(function() { app.listen('foo', function(){
      server.close();
    }); }, TypeError);
    done();
  })
})
