
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.cookie(name, object)', function(){
    it('should generate a JSON cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('user', { name: 'tobi' }).end();
      });

      request(app)
      .get('/')
      .end(function(res){
        var val = ['user=j%3A%7B%22name%22%3A%22tobi%22%7D; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })

  describe('.cookie(name, string)', function(){
    it('should set a cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi').end();
      });

      request(app)
      .get('/')
      .end(function(res){
        var val = ['name=tobi; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
    
    it('should allow multiple calls', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi');
        res.cookie('age', 1);
        res.end();
      });

      request(app)
      .get('/')
      .end(function(res){
        var val = ['name=tobi; path=/', 'age=1; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })
  
  describe('.cookie(name, string, options)', function(){
    it('should set params', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi', { httpOnly: true, secure: true });
        res.end();
      });

      request(app)
      .get('/')
      .end(function(res){
        var val = ['name=tobi; path=/; httpOnly; secure'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
    
    describe('maxAge', function(){
      it('should set relative expires', function(done){
        var app = express();

        app.use(function(req, res){
          res.cookie('name', 'tobi', { maxAge: 1000 });
          res.end();
        });

        request(app)
        .get('/')
        .end(function(res){
          res.headers['set-cookie'][0].should.not.include('Thu, 01 Jan 1970 00:00:01 GMT');
          done();
        })
      })
    })
  })
})
