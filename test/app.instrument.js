
var express = require('../');

describe('app', function(){
  describe('.instrument(fn)', function(){
    it('should add function to the tracer list', function(){
      var app = express();
      function debug (app, req, res, event, args) {
        console.log(event);
      }
      app.instrument(debug);
      debug.should.be.equal(app.tracers[0]);
    });

    it('should throw err if tracer is not a function', function(){
      var app = express();

      (function(){
        app.instrument('notatracer');
      }).should.throw('instrument expects a function');
    });
  })
})
