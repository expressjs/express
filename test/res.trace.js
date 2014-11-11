
var express = require('../');
var request = require('supertest');

describe('res', function(){
  describe('.trace(event)', function(){
    it('should activate all tracers set at application level', function(done){
      var app = express();

      app.instrument(function(traceApp, req, res, event, date, args){
        (traceApp === traceApp).should.be.ok;
        req.url.should.be.equal('/');
        res.id.should.be.equal('1');
        'one:event'.should.be.equal(event);
        'info'.should.be.equal(args[0]);
      });

      app.use(function(req, res, next){
        res.id = '1';
        res.trace('one:event', 'info');
        next();
      });

      app.get('/', function(req, res){
        res.send('ok');
      });

      request(app)
        .get('/')
        .end(function(err, res) {
          done();
        });
    })
  })
})
