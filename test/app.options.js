
var express = require('../')
  , request = require('./support/http');

describe('OPTIONS', function(){
  it('should default to the routes defined', function(done){
    var app = express();

    app.del('/', function(){});
    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});

    request(app)
    .options('/users')
    .end(function(res){
      res.body.should.equal('GET,PUT');
      res.headers.should.have.property('content-type');
      res.headers.should.have.property('allow', 'GET,PUT');
      done();
    });
  })
})

describe('app.options()', function(){
  it('should override the default behavior', function(done){
    var app = express();

    app.options('/users', function(req, res){
      res.set('Allow', 'GET');
      res.send('GET');
    });

    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});

    request(app)
    .options('/users')
    .end(function(res){
      res.body.should.equal('GET');
      res.headers.should.have.property('allow', 'GET');
      done();
    });
  })
})