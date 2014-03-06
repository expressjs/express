
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.auth', function(){
    describe('when Authorization is missing', function(){
      it('should return undefined', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.auth || 'none');
        });

        request(app)
        .get('/')
        .expect('none', done)
      })
    })

    describe('when Authorization is malformed', function(){
      it('should return undefined', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.auth || 'none');
        });

        request(app)
        .get('/')
        .set('Authorization', 'meow')
        .expect('none', done)
      })
    })

    describe('when Authorization is not Basic', function(){
      it('should return undefined', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.auth || 'none');
        });

        request(app)
        .get('/')
        .set('Authorization', 'Meow dG9iaTpmZXJyZXQ')
        .expect('none', done)
      })
    })

    describe('when encoded string is malformed', function(){
      it('should return undefined', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.auth || 'none');
        });

        request(app)
        .get('/')
        .set('Authorization', 'Basic Z21ldGh2aW4=')
        .expect('none', done)
      })
    })

    describe('when password contains a colon', function(){
      it('should return .username and .password', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.auth || 'none');
        });

        request(app)
        .get('/')
        .set('Authorization', 'Basic dG9iaTpmZXJyZXQ6ZmVycmV0')
        .expect('{"username":"tobi","password":"ferret:ferret"}', done)
      })
    })

    it('should return .username and .password', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.send(req.auth || 'none');
      });

      request(app)
      .get('/')
      .set('Authorization', 'Basic dG9iaTpmZXJyZXQ=')
      .expect('{"username":"tobi","password":"ferret"}', done)
    })
  })
})
