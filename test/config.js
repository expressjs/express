
var express = require('../')
  , assert = require('assert');

describe('config', function(){
  describe('.set()', function(){
    it('should set a value', function(){
      var app = express();
      app.set('foo', 'bar').should.equal(app);
    })

    it('should return the app when undefined', function(){
      var app = express();
      app.set('foo', undefined).should.equal(app);
    })

    describe('"etag"', function(){
      it('should throw on bad value', function(){
        var app = express()
        app.set.bind(app, 'etag', 42).should.throw(/unknown value/)
      })

      it('should set "etag fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('etag', fn)
        app.get('etag fn').should.equal(fn)
      })
    })

    describe('"trust proxy"', function(){
      it('should set "trust proxy fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('trust proxy', fn)
        app.get('trust proxy fn').should.equal(fn)
      })
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

    describe('when mounted', function(){
      it('should default to the parent app', function(){
        var app = express()
          , blog = express();

        app.set('title', 'Express');
        app.use(blog);
        blog.get('title').should.equal('Express');
      })
      
      it('should given precedence to the child', function(){
        var app = express()
          , blog = express();

        app.use(blog);
        app.set('title', 'Express');
        blog.set('title', 'Some Blog');

        blog.get('title').should.equal('Some Blog');
      })
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
  
  describe('.enabled()', function(){
    it('should default to false', function(){
      var app = express();
      app.enabled('foo').should.be.false;
    })
    
    it('should return true when set', function(){
      var app = express();
      app.set('foo', 'bar');
      app.enabled('foo').should.be.true;
    })
  })
  
  describe('.disabled()', function(){
    it('should default to true', function(){
      var app = express();
      app.disabled('foo').should.be.true;
    })
    
    it('should return false when set', function(){
      var app = express();
      app.set('foo', 'bar');
      app.disabled('foo').should.be.false;
    })
  })
})
