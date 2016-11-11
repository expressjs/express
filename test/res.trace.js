
var express = require('../');
var request = require('supertest');
var assert = require('assert');

describe('res', function(){
  describe('.trace(event)', function(){
    it('should call all tracers set at application level', function(done){
      var app = express();

      app.instrument(function(options){
        assert.equal(options.app, app)
        assert.equal(options.req.url, '/');
        assert.equal(options.res.id, '1');
        assert.equal(options.event, 'one:event');
        assert.equal(options.args[0], 'info');
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

  describe('.trace(event) with parents', function(){
    it('should call parent tracers too', function(done){

      var app = express();
      var appParent1 = express();
      var appParent2 = express();

      var parentTraces1 = [];
      var parentTraces2 = [];

      appParent1.instrument(function(options){
        assert.equal(options.req.id, '1');
        parentTraces1.push(options.event + ':parent1');
      });

      appParent2.instrument(function(options){
        assert.equal(options.req.id, '1');
        parentTraces2.push(options.event + ':parent2');
      });

      appParent1.use('/childof1', app);
      appParent2.use('/childof2', app);
      app.instrument(function(options){
        assert.equal(options.event, 'one:event');
        assert.equal(options.args[0], 'info');
      });

      app.use(function(req, res, next){
        req.id = '1';
        next();
      });

      app.get('/', function(req, res){
        res.trace('one:event', 'info');
        res.send('ok');
      });

      request(appParent1)
        .get('/childof1')
        .expect(200, function(err){
        if (err) return done(err);

        assert.equal(parentTraces1.length, 1);
        assert.equal(parentTraces2.length, 1);
        assert.equal(parentTraces1[0], 'one:event:parent1');
        assert.equal(parentTraces2[0], 'one:event:parent2');

        request(appParent2)
          .get('/childof2')
          .expect(200, function(err){
          if (err) return done(err);

          assert.equal(parentTraces1.length, 2);
          assert.equal(parentTraces2.length, 2);
          assert.equal(parentTraces1[0], 'one:event:parent1');
          assert.equal(parentTraces2[0], 'one:event:parent2');
          assert.equal(parentTraces1[1], 'one:event:parent1');
          assert.equal(parentTraces2[1], 'one:event:parent2');
          done();
        });
      });
    });
  })
});
