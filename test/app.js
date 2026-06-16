'use strict'

var assert = require('node:assert')
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
    assert.equal(typeof app, 'function');
  })

  it('should 404 without routes', function(done){
    request(express())
    .get('/')
    .expect(404, done);
  })

  it('should not log client errors', function(done){
    var app = express()
    var errors = []
    var original = console.error

    app.set('env', 'development')
    app.use(function (req, res, next) {
      var err = new Error('missing')
      err.status = 404
      next(err)
    })

    console.error = function (err) {
      errors.push(err)
    }

    request(app)
      .get('/')
      .expect(404, function (err) {
        setImmediate(function () {
          console.error = original

          if (err) return done(err)

          assert.strictEqual(errors.length, 0)
          done()
        })
      })
  })

  it('should log server errors', function(done){
    var app = express()
    var errors = []
    var original = console.error

    app.set('env', 'development')
    app.use(function (req, res, next) {
      next(new Error('boom'))
    })

    console.error = function (err) {
      errors.push(err)
    }

    request(app)
      .get('/')
      .expect(500, function (err) {
        setImmediate(function () {
          console.error = original

          if (err) return done(err)

          assert.strictEqual(errors.length, 1)
          assert.match(errors[0], /Error: boom/)
          done()
        })
      })
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

describe('in development', function(){
  before(function () {
    this.env = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
  })

  after(function () {
    process.env.NODE_ENV = this.env
  })

  it('should disable "view cache"', function(){
    var app = express();
    assert.ok(!app.enabled('view cache'))
  })
})

describe('in production', function(){
  before(function () {
    this.env = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
  })

  after(function () {
    process.env.NODE_ENV = this.env
  })

  it('should enable "view cache"', function(){
    var app = express();
    assert.ok(app.enabled('view cache'))
  })
})

describe('without NODE_ENV', function(){
  before(function () {
    this.env = process.env.NODE_ENV
    process.env.NODE_ENV = ''
  })

  after(function () {
    process.env.NODE_ENV = this.env
  })

  it('should default to development', function(){
    var app = express();
    assert.strictEqual(app.get('env'), 'development')
  })
})
