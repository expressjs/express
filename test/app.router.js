
var express = require('../')
  , request = require('./support/http');

describe('app.router', function(){
  it('should be .use()able', function(done){
    var app = express();

    var calls = [];

    app.use(function(req, res, next){
      calls.push('before');
      next();
    });
    
    app.use(app.router);

    app.use(function(req, res, next){
      calls.push('after');
      res.end();
    });

    app.get('/', function(req, res, next){
      calls.push('GET /')
      next();
    });

    request(app)
    .get('/')
    .end(function(res){
      calls.should.eql(['before', 'GET /', 'after'])
      done();
    })
  })
  
  it('should be auto .use()d on the first app.VERB() call', function(done){
    var app = express();

    var calls = [];

    app.use(function(req, res, next){
      calls.push('before');
      next();
    });
    
    app.get('/', function(req, res, next){
      calls.push('GET /')
      next();
    });

    app.use(function(req, res, next){
      calls.push('after');
      res.end();
    });

    request(app)
    .get('/')
    .end(function(res){
      calls.should.eql(['before', 'GET /', 'after'])
      done();
    })
  })
})
