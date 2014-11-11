
var express = require('../');

describe('app', function(){
  describe('._callTracers(res, event, args)', function(){
    it('should activate all tracers', function(){
      var app = express();
      app.id = 'app-1';
      var log = '';

      function tracer(traceApp, req, res, event, date, args){
        (traceApp === app).should.be.ok;
        req.url.should.be.equal('/');
        res.id.should.be.equal('1');
        event.should.be.equal('new:event');
      }

      function otherTracer(traceApp, req, res, event, date, args){
        log = event;
      }

      app.instrument(tracer);
      app.instrument(otherTracer);

      var res = Object.create(app.response);
      res.req = Object.create(app.request);
      res.req.url = '/';
      res.id = '1';
      app._callTracers(res, 'new:event', []);

      log.should.be.equal('new:event');
    });
  })
})
