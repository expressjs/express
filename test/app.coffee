express = require('../')
assert = require('assert')

describe 'app', ->
  it 'should inherit from event emitter', (done) ->
    express().on('fire', done).emit('fire')

describe 'app.parent', ->
  it 'should return the parent when mounted', ->
    app = express()
    blog = express()
    blogAdmin = express()

    app.use('/blog', blog)
    blog.use('/admin', blogAdmin)

    assert(!app.parent, 'app.parent')
    blog.parent.should.equal(app)
    blogAdmin.parent.should.equal(blog)

describe 'app.mountpath', ->
  it 'should return the mounted path', ->
    app = express()
    blog = express()
    blogAdmin = express()

    app.use('/blog', blog)
    blog.use('/admin', blogAdmin)

    app.mountpath.should.equal('/')
    blog.mountpath.should.equal('/blog')
    blogAdmin.mountpath.should.equal('/admin')

describe 'app.router', ->
  it 'should throw with notice', (done) ->
    try
      express().router
    catch err
      done()

describe 'app.path()', ->
  it 'should return the canonical', ->
    app = express()
    blog = express()
    blogAdmin = express()

    app.use('/blog', blog)
    blog.use('/admin', blogAdmin)

    app.path().should.equal('')
    blog.path().should.equal('/blog')
    blogAdmin.path().should.equal('/blog/admin')

describe 'in development', ->
  it 'should disable "view cache"', ->
    process.env.NODE_ENV = 'development'
    app = express()
    app.enabled('view cache').should.be.false
    process.env.NODE_ENV = 'test'

describe 'in production', ->
  it 'should enable "view cache"', ->
    process.env.NODE_ENV = 'production'
    app = express()
    app.enabled('view cache').should.be.true
    process.env.NODE_ENV = 'test'
