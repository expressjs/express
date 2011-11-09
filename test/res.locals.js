
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.locals(obj)', function(){
    it('should merge locals', function(done){
      var app = express();

      app.use(function(req, res){
        Object.keys(res.locals).should.eql([]);
        res.locals({ user: 'tobi', age: 1 });
        res.locals.user.should.equal('tobi');
        res.locals.age.should.equal(1);
        res.end();
      });

      request(app)
      .get('/')
      .end(function(res){
        done();
      })
    })
  })
})
