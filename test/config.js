
var express = require('../')
  , assert = require('assert');

describe('config', function(){
  describe('.set()', function(){
    it('should set a value', function(){
      var app = express();
      app.set('foo', 'bar').should.equal(app);
    })
  })

  describe('.get()', function(){
    it('should return undefined when unset', function(){
      var app = express();
      assert(undefined === app.get('foo'));
    })
    
    it('should otherwise return the value', function(){
      var app = express();
      app.set('foo', 'bar');
      app.get('foo').should.equal('bar');
    })
  })

  describe('.enable()', function(){
    it('should set the value to true', function(){
      var app = express();
      app.enable('tobi').should.equal(app);
      app.get('tobi').should.be.true;
    })
  })
  
  describe('.disable()', function(){
    it('should set the value to false', function(){
      var app = express();
      app.disable('tobi').should.equal(app);
      app.get('tobi').should.be.false;
    })
  })
})