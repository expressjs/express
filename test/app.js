
var assert = require('assert')
var express = require('..')
var request = require('supertest')

describe('app', function(){
  it('should inherit from event emitter', function(done){
    var app = express();
    app.on('foo', done);
    app.emit('foo');
  })

  it('should be callable', function(){
    var app = express();
    assert(typeof app, 'function');
  })

  it('should 500 without routes', function(done){
    request(express())
    .get('/')
    .expect(500, done);
  })
})

describe('app.parent', function(){
  it('should return the parent when mounted', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    assert(!app.parent, 'app.parent');
    blog.parent.should.equal(app);
    blogAdmin.parent.should.equal(blog);
  })
})

describe('app.mountpath', function(){
  it('should return the mounted path', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    app.mountpath.should.equal('/');
    blog.mountpath.should.equal('/blog');
    blogAdmin.mountpath.should.equal('/admin');
  })
})

describe('app.router', function(){
  it('should throw with notice', function(done){
    var app = express()

    try {
      app.router;
    } catch(err) {
      done();
    }
  })
})

describe('app.path()', function(){
  it('should return the canonical', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    app.path().should.equal('');
    blog.path().should.equal('/blog');
    blogAdmin.path().should.equal('/blog/admin');
  })
})

describe('in development', function(){
  it('should disable "view cache"', function(){
    process.env.NODE_ENV = 'development';
    var app = express();
    app.enabled('view cache').should.be.false;
    process.env.NODE_ENV = 'test';
  })
})

describe('in production', function(){
  it('should enable "view cache"', function(){
    process.env.NODE_ENV = 'production';
    var app = express();
    app.enabled('view cache').should.be.true;
    process.env.NODE_ENV = 'test';
  })
})

describe('without NODE_ENV', function(){
  it('should default to development', function(){
    process.env.NODE_ENV = '';
    var app = express();
    app.get('env').should.equal('development');
    process.env.NODE_ENV = 'test';
  })
})
