
var express = require('../');
var request = require('supertest');

describe('res', function(){
  describe('.trace(event)', function(){
    it('should call all tracers set at application level', function(done){
      var app = express();

      app.instrument(function(options){
        (options.app === app).should.be.ok;
        options.req.url.should.be.equal('/');
        options.res.id.should.be.equal('1');
        'one:event'.should.be.equal(options.event);
        'info'.should.be.equal(options.args[0]);
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
        .expect(200, done);
    })
  })
})
