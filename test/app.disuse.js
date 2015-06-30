
var after = require('after');
var assert = require('assert');
var express = require('..');
var request = require('supertest');

describe('app', function(){
  it('should emit "dismount" when dismounted', function(done){
    var blog = express()
      , app = express();

    blog.on('dismount', function(arg){
      arg.should.equal(app);
      done();
    });

    app.use(blog);
    app.disuse(blog);
  })


  describe('.disuse(app)', function(){
    it('should dismount the app', function(done){
      var blog = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });

      app.use(blog);
      app.disuse(blog);

      request(app)
      .get('/blog')
      .expect(404, done);
    })
    it('should remove the child\'s .parent', function(){
      var blog = express()
        , app = express();

      app.use('/blog', blog);
      app.disuse('/blog', blog);
      assert.equal(blog.parent, null);
    })
  })

  describe('.disuse(middleware)', function(){

    it('should not call disused middleware', function(done){
      var app = express();

      function middleware(req,res)
      {
         res.send('test');
      }

      app.use('/test',middleware);
      app.disuse('/test',middleware);

      request(app)
      .get('/test')
      .expect(404, done);
    })

    it('should remove a single middleware instance', function(done){
      var app = express();

      var z = 0;
      function middleware(req,res,next)
      {
         z++;
         next();
      }
       function endMiddleware(req,res,next)
      {
         res.send(''+z);
      }

      app.use('/blog', middleware);
      app.use('/blog', middleware);
      app.use('/blog', middleware);
      app.use('/blog', endMiddleware);
      app.disuse('/blog', middleware);

      request(app)
      .get('/blog')
      .expect('2', done);
    })

    it('should accept multiple arguments', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use(fn1, fn2,fn3 );
      app.disuse(fn1, fn2,fn3 );

      request(app)
      .get('/')
      .expect(404)
      .expect(404)
      .expect(404,done);
    })

    it('should accept array of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([fn1, fn2, fn3]);
      app.disuse([fn1, fn2, fn3]);

      request(app)
      .get('/')
      .expect(404)
      .expect(404)
      .expect(404, done);
      
    })

    it('should accept multiple arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([fn1, fn2], [fn3]);
      app.disuse([fn1, fn2], [fn3]);

      request(app)
      .get('/')
      .expect(404)
      .expect(404)
      .expect(404, done);
    })

    it('should accept nested arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([[fn1], fn2], [fn3]);
      app.disuse([[fn1], fn2], [fn3]);

      request(app)
      .get('/')
      .expect(404)
      .expect(404)
      .expect(404, done);
    })
  })

  describe('.use(path, middleware)', function(){

    it('should reject non-functions as middleware', function () {
      var app = express();
      app.disuse.bind(app, '/', 'hi').should.throw(/requires middleware function.*string/);
      app.disuse.bind(app, '/', 5).should.throw(/requires middleware function.*number/);
      app.disuse.bind(app, '/', null).should.throw(/requires middleware function.*Null/);
      app.disuse.bind(app, '/', new Date()).should.throw(/requires middleware function.*Date/);
    })

    it('should accept array of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, fn2, fn3]);
      app.disuse('/foo', [fn1, fn2, fn3]);

      request(app)
      .get('/foo')
      .expect(404)
      .expect(404)
      .expect(404,done);
    })

    it('should accept multiple arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, fn2], [fn3]);
      app.disuse('/foo', [fn1, fn2], [fn3]);

      request(app)
      .get('/foo')
      .expect(404)
      .expect(404)
      .expect(404,done);
    })

    it('should accept nested arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, [fn2]], [fn3]);
      app.disuse('/foo', [fn1, [fn2]], [fn3]);

      request(app)
      .get('/foo')
      .expect(404)
      .expect(404)
      .expect(404,done);
    })

    it('should support empty string path', function (done) {
      var app = express();

      function index(req, res) {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl);
      }
      app.use('', index);
      app.disuse('',index);

      request(app)
      .get('/')
      .expect(404, done);
    })
  })
})
