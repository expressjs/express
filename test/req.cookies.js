
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.cookies', function(){
    it('should expose cookie data', function(done){
      var app = express();

      app.use(express.cookieParser());

      app.use(function(req, res){
        res.end(req.cookies.name + ' ' + req.cookies.species);
      });

      request(app)
      .get('/')
      .set('Cookie', 'name=tobi; species=ferret')
      .end(function(res){
        res.body.should.equal('tobi ferret');
        done();
      })
    })
    
    it('should parse JSON cookies', function(done){
      var app = express();

      app.use(express.cookieParser());

      app.use(function(req, res){
        res.end(req.cookies.user.name);
      });

      request(app)
      .get('/')
      .set('Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D')
      .end(function(res){
        res.body.should.equal('tobi');
        done();
      })
    })
  })
})
