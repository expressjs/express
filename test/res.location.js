
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.location(url)', function(){
    it('should set the header', function(done){
      var app = express();

      app.use(function(req, res){
        res.location('http://google.com').end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
   
    describe('with leading //', function(){
      it('should pass through scheme-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('//cuteoverload.com').end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('location', '//cuteoverload.com');
          done();
        })
      })
    })
   
    describe('with leading /', function(){
      it('should construct scheme-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('/login').end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('location', '/login');
          done();
        })
      })
    })

    describe('with leading ./', function(){
      it('should construct path-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('./edit').end();
        });

        request(app)
        .get('/post/1')
        .end(function(err, res){
          res.headers.should.have.property('location', '/post/1/edit');
          done();
        })
      })
    })

    describe('with leading ../', function(){
      it('should construct path-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('../new').end();
        });

        request(app)
        .get('/post/1')
        .end(function(err, res){
          res.headers.should.have.property('location', '/post/new');
          done();
        })
      })
    })

    describe('with leading ./ and containing ..', function(){
      it('should construct path-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('./skip/../../new').end();
        });

        request(app)
        .get('/post/1')
        .end(function(err, res){
          res.headers.should.have.property('location', '/post/new');
          done();
        })
      })
    })
    
    describe('without leading /', function(){
      it('should construct mount-point relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.location('login').end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('location', '/login');
          done();
        })
      })
    })
    
    describe('when mounted', function(){
      describe('deeply', function(){
        it('should respect the mount-point', function(done){
          var app = express()
            , blog = express()
            , admin = express();

          admin.use(function(req, res){
            res.location('login').end();
          });

          app.use('/blog', blog);
          blog.use('/admin', admin);

          request(app)
          .get('/blog/admin')
          .end(function(err, res){
            res.headers.should.have.property('location', '/blog/admin/login');
            done();
          })
        })
      })

      describe('omitting leading /', function(){
        it('should respect the mount-point', function(done){
          var app = express()
            , admin = express();

          admin.use(function(req, res){
            res.location('admin/login').end();
          });

          app.use('/blog', admin);

          request(app)
          .get('/blog')
          .end(function(err, res){
            res.headers.should.have.property('location', '/blog/admin/login');
            done();
          })
        })
      })

      describe('providing leading /', function(){
        it('should ignore mount-point', function(done){
          var app = express()
            , admin = express();

          admin.use(function(req, res){
            res.location('/admin/login').end();
          });

          app.use('/blog', admin);

          request(app)
          .get('/blog')
          .end(function(err, res){
            res.headers.should.have.property('location', '/admin/login');
            done();
          })
        })
      })
    })
  })
})
