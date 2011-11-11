
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.param(name, default)', function(){
    it('should use the default value unless defined', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.param('name', 'tj'));
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('tj');
        done();
      })
    })
  })

  describe('.param(name)', function(){
    it('should check req.query', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.param('name'));
      });

      request(app)
      .get('/?name=tj')
      .end(function(res){
        res.body.should.equal('tj');
        done();
      })
    })
    
    it('should check req.body', function(done){
      var app = express();

      app.use(express.bodyParser());

      app.use(function(req, res){
        res.end(req.param('name'));
      });

      request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .write('{"name":"tj"}')
      .end(function(res){
        res.body.should.equal('tj');
        done();
      })
    })
    
    it('should check req.params', function(done){
      var app = express();

      app.get('/user/:name', function(req, res){
        res.end(req.param('name'));
      });

      request(app)
      .get('/user/tj')
      .end(function(res){
        res.body.should.equal('tj');
        done();
      })
    })
  })
})
