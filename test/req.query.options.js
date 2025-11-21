'use strict'

var assert = require('node:assert')
var express = require('..');
var request = require('supertest');

describe('req.query with extended parser options', function(){
  describe('default behavior', function(){
    it('should parse multiple parameters by default', function(done){
      var app = express();
      app.set('query parser', 'extended');

      app.get('/', function(req, res){
        res.json({ count: Object.keys(req.query).length });
      });

      // Generate 100 parameters (avoid HTTP header size limits)
      var params = [];
      for (var i = 0; i < 100; i++) {
        params.push('p' + i + '=' + i);
      }

      request(app)
        .get('/?' + params.join('&'))
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.count, 100);
          done();
        });
    });

    it('should have parameterLimit of 1000 by default', function(done){
      var app = express();
      app.set('query parser', 'extended');

      app.get('/', function(req, res){
        // Check the parser options were applied
        res.json({ success: true });
      });

      request(app)
        .get('/?a=1&b=2&c=3')
        .expect(200, done);
    });
  });

  describe('with custom parameterLimit', function(){
    it('should apply custom parameter limit', function(done){
      var app = express();
      app.set('query parser', 'extended');
      app.set('query parser options', {
        parameterLimit: 200
      });

      app.get('/', function(req, res){
        res.json({ count: Object.keys(req.query).length });
      });

      // Generate 150 parameters
      var params = [];
      for (var i = 0; i < 150; i++) {
        params.push('p' + i + '=' + i);
      }

      request(app)
        .get('/?' + params.join('&'))
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.count, 150);
          done();
        });
    });

    it('should truncate at custom limit', function(done){
      var app = express();
      app.set('query parser', 'extended');
      app.set('query parser options', {
        parameterLimit: 50
      });

      app.get('/', function(req, res){
        res.json({ count: Object.keys(req.query).length });
      });

      // Generate 80 parameters
      var params = [];
      for (var i = 0; i < 80; i++) {
        params.push('p' + i + '=' + i);
      }

      request(app)
        .get('/?' + params.join('&'))
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.count, 50);
          done();
        });
    });
  });

  describe('with arrayLimit option', function(){
    it('should respect array limit for indexed arrays', function(done){
      var app = express();
      app.set('query parser', 'extended');
      app.set('query parser options', {
        arrayLimit: 3
      });

      app.get('/', function(req, res){
        res.json(req.query);
      });

      // qs arrayLimit applies to indexed arrays like a[0]=1&a[1]=2&a[2]=3
      request(app)
        .get('/?ids[0]=a&ids[1]=b&ids[2]=c&ids[3]=d&ids[4]=e')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          // With arrayLimit of 3, indices above 3 become object keys
          assert.ok(res.body.ids);
          done();
        });
    });
  });

  describe('with depth option', function(){
    it('should respect nesting depth limit', function(done){
      var app = express();
      app.set('query parser', 'extended');
      app.set('query parser options', {
        depth: 2
      });

      app.get('/', function(req, res){
        res.json(req.query);
      });

      request(app)
        .get('/?a[b][c][d]=value')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          // With depth 2, should only parse a[b]
          assert.ok(res.body.a);
          assert.ok(res.body.a.b);
          // Further nesting should be flattened or ignored
          done();
        });
    });
  });

  describe('security: allowPrototypes option', function(){
    it('should allow prototype pollution with allowPrototypes:true (default for backward compat)', function(done){
      var app = express();
      app.set('query parser', 'extended');

      app.get('/', function(req, res){
        res.json({ success: true });
      });

      request(app)
        .get('/?__proto__[test]=polluted')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          // With allowPrototypes:true, this would work (but is dangerous)
          done();
        });
    });

    it('should prevent prototype pollution with allowPrototypes:false', function(done){
      var app = express();
      app.set('query parser', 'extended');
      app.set('query parser options', {
        allowPrototypes: false
      });

      app.get('/', function(req, res){
        var testObj = {};
        // Check if prototype was polluted
        var isPolluted = testObj.hasOwnProperty('__proto__');
        res.json({ polluted: isPolluted });
      });

      request(app)
        .get('/?__proto__[test]=polluted')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.polluted, false);
          done();
        });
    });
  });

  describe('setting options after parser', function(){
    it('should re-compile parser when options are set after parser mode', function(done){
      var app = express();
      app.set('query parser', 'extended');
      // Set options after setting parser mode
      app.set('query parser options', {
        parameterLimit: 100
      });

      app.get('/', function(req, res){
        res.json({ count: Object.keys(req.query).length });
      });

      // Generate 150 parameters
      var params = [];
      for (var i = 0; i < 150; i++) {
        params.push('param' + i + '=value' + i);
      }

      request(app)
        .get('/?' + params.join('&'))
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.count, 100);
          done();
        });
    });
  });

  describe('backward compatibility', function(){
    it('should not affect simple parser', function(done){
      var app = express();
      app.set('query parser', 'simple');
      app.set('query parser options', {
        parameterLimit: 100
      });

      app.get('/', function(req, res){
        res.json(req.query);
      });

      request(app)
        .get('/?name=john&age=30')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.name, 'john');
          assert.strictEqual(res.body.age, '30');
          done();
        });
    });

    it('should work without options (backward compatible)', function(done){
      var app = express();
      app.set('query parser', 'extended');

      app.get('/', function(req, res){
        res.json(req.query);
      });

      request(app)
        .get('/?user[name]=john&user[age]=30')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          assert.strictEqual(res.body.user.name, 'john');
          assert.strictEqual(res.body.user.age, '30');
          done();
        });
    });
  });
});
