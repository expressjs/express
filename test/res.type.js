'use strict'

var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.type(str)', function(){
    it('should set the Content-Type based on a filename', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('foo.js').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .end(done)
    })

    it('should default to application/octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('rawr').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/octet-stream', done);
    })

    it('should set the Content-Type with type/subtype', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('application/vnd.amazon.ebook')
          .end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.amazon.ebook', done);
    })
    describe('edge cases', function(){
      it('should handle empty string gracefully', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('').end('test');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/octet-stream')
        .end(done);
      })

      it('should handle file extension with dots', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('.json').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      })

      it('should handle multiple file extensions', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('file.tar.gz').end('compressed');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/gzip')
        .end(done);
      })

      it('should handle uppercase extensions', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('FILE.JSON').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      })

      it('should handle extension with special characters', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('file@test.json').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      })
    })
  })
})


