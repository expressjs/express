'use strict'

var assert = require('node:assert')
var express = require('..')
var request = require('supertest')
var support = require('./support/env')

describe('app', function(){
  it('should inherit from event emitter', function(done){
    var app = express();
    app.on('foo', done);
    app.emit('foo');
  })

  it('should be callable', function(){
    var app = express();
    assert.equal(typeof app, 'function');
  })

  it('should 404 without routes', function(done){
    request(express())
    .get('/')
    .expect(404, done);
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
    assert.strictEqual(blog.parent, app)
    assert.strictEqual(blogAdmin.parent, blog)
  })
})

describe('app.mountpath', function(){
  it('should return the mounted path', function(){
    var admin = express();
    var app = express();
    var blog = express();
    var fallback = express();

    app.use('/blog', blog);
    app.use(fallback);
    blog.use('/admin', admin);

    assert.strictEqual(admin.mountpath, '/admin')
    assert.strictEqual(app.mountpath, '/')
    assert.strictEqual(blog.mountpath, '/blog')
    assert.strictEqual(fallback.mountpath, '/')
  })
})

describe('app.path()', function(){
  it('should return the canonical', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    assert.strictEqual(app.path(), '')
    assert.strictEqual(blog.path(), '/blog')
    assert.strictEqual(blogAdmin.path(), '/blog/admin')
  })
})

describe('default configuration', function(){
  function createApp () {
    // bypass the test-suite override of "env" in test/support/env.js
    var app = express()
    support.defaultConfiguration.call(app)
    return app
  }

  it('should default "env" to production', function(){
    var app = createApp()
    assert.strictEqual(app.get('env'), 'production')
  })

  it('should enable "view cache"', function(){
    var app = createApp()
    assert.ok(app.enabled('view cache'))
  })

  it('should ignore NODE_ENV', function(){
    var env = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    try {
      var app = createApp()
      assert.strictEqual(app.get('env'), 'production')
      assert.ok(app.enabled('view cache'))
    } finally {
      process.env.NODE_ENV = env
    }
  })
})
