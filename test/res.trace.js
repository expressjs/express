
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

  describe('.trace(event) with parents', function(){
    it('should call parent tracers too', function(done){

      var app = express();
      var appParent1 = express();
      var appParent2 = express();

      var parentTraces1 = [];
      var parentTraces2 = [];

      appParent1.instrument(function(options){
        options.res.id.should.be.equal('1');
        parentTraces1.push(options.event + ':parent1');
      });

      appParent2.instrument(function(options){
        options.res.id.should.be.equal('1');
        parentTraces2.push(options.event + ':parent2');
      });

      appParent1.use('/childof1', app);
      appParent2.use('/childof2', app);
      app.instrument(function(options){
        'one:event'.should.be.equal(options.event);
        'info'.should.be.equal(options.args[0]);
      });

      app.use(function(req, res, next){
        res.id = '1';
        next();
      });

      app.get('/', function(req, res){
        res.trace('one:event', 'info');
        res.send('ok');
      });

      request(appParent1)
        .get('/childof1')
        .expect(200, function(){

        parentTraces1.length.should.be.equal(1);
        parentTraces2.length.should.be.equal(1);
        parentTraces1[0].should.be.equal('one:event:parent1');
        parentTraces2[0].should.be.equal('one:event:parent2');

        request(appParent2)
          .get('/childof2')
          .expect(200, function(){

          parentTraces1.length.should.be.equal(2);
          parentTraces2.length.should.be.equal(2);
          parentTraces1[0].should.be.equal('one:event:parent1');
          parentTraces2[0].should.be.equal('one:event:parent2');
          parentTraces1[1].should.be.equal('one:event:parent1');
          parentTraces2[1].should.be.equal('one:event:parent2');
          done();
        });
      });
    });
  })
});
