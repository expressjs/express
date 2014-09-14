
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.secure', function(){
    describe('when X-Forwarded-Proto is missing', function(){
      it('should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('no', done)
      })
    })
  })

  describe('.secure', function(){
    describe('when X-Forwarded-Proto is present', function(){
      it('should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('no', done)
      })

      it('should return true when "trust proxy" is enabled', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('yes', done)
      })

      it('should return false when initial proxy is http', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'http, https')
        .expect('no', done)
      })

      it('should return true when initial proxy is https', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https, http')
        .expect('yes', done)
      })
    })
  })
})
