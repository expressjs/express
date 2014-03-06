
var express = require('../')
  , assert = require('assert')
  , request = require('supertest');

describe('app.routes', function(){
  it('should be initialized', function(){
    var app = express();
    app.routes.should.eql({});
  })

  it('should be populated with routes', function(){
    var app = express();

    app.get('/', function(req, res){});
    app.get('/user/:id', function(req, res){});

    var get = app.routes.get;
    get.should.have.length(2);

    get[0].path.should.equal('/');
    get[0].method.should.equal('get');
    get[0].regexp.toString().should.equal('/^\\/\\/?$/i');

    get[1].path.should.equal('/user/:id');
    get[1].method.should.equal('get');
  })

  it('should be mutable', function(done){
    var app = express();

    app.get('/', function(req, res){});
    app.get('/user/:id', function(req, res){});

    var get = app.routes.get;
    get.should.have.length(2);

    get[0].path.should.equal('/');
    get[0].method.should.equal('get');
    get[0].regexp.toString().should.equal('/^\\/\\/?$/i');

    get.splice(1);

    request(app)
    .get('/user/12')
    .expect(404, done);
  })
})