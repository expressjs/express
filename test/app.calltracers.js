
var express = require('../');

describe('app', function(){
  describe('._callTracers(options)', function(){
    it('should activate all tracers', function(){
      var app = express();
      app.id = 'app-1';
      var log = '';

      function tracer(options){
        (options.app === app).should.be.ok;
        options.req.url.should.be.equal('/');
        options.res.id.should.be.equal('1');
        options.event.should.be.equal('new:event');
        options.date.should.exist;
        (options.args[0] === 'arg1').should.be.ok;
      }

      function otherTracer(options){
        log = options.event;
      }

      app.instrument(tracer);
      app.instrument(otherTracer);

      var res = Object.create(app.response);
      res.req = Object.create(app.request);
      res.req.url = '/';
      res.id = '1';
      app._callTracers(res, 'new:event', ['arg1']);

      log.should.be.equal('new:event');
    });
  })
})
