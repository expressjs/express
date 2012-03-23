
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('res', function(){
  describe('.json(object)', function(){
    describe('when given primitives', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(null);
        });

        request(app)
        .get('/')
        .end(function(res){
          res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
          res.body.should.equal('null');
          done();
        })
      })
    })
    
    describe('when given an object', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json({ name: 'tobi' });
        });

        request(app)
        .get('/')
        .end(function(res){
          res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
          res.body.should.equal('{"name":"tobi"}');
          done();
        })
      })
    })

    describe('"json replacer" setting', function(){
      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json replacer', function(key, val){
          return '_' == key[0]
            ? undefined
            : val;
        });

        app.use(function(req, res){
          res.json({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('{"name":"tobi"}');
          done();
        });
      })
    })

    describe('"json spaces" setting', function(){
      it('should default to 2 in development', function(){
        process.env.NODE_ENV = 'development';
        var app = express();
        app.get('json spaces').should.equal(2);
        process.env.NODE_ENV = 'test';
      })

      it('should be undefined otherwise', function(){
        var app = express();
        assert(undefined === app.get('json spaces'));
      })

      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json spaces', 2);

        app.use(function(req, res){
          res.json({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('{\n  "name": "tobi",\n  "age": 2\n}');
          done();
        });
      })
    })
  })
  
  describe('.json(status, object)', function(){
    it('should respond with json and set the .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.json(201, { id: 1 });
      });

      request(app)
      .get('/')
      .end(function(res){
        res.statusCode.should.equal(201);
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.body.should.equal('{"id":1}');
        done();
      })
    })
  })
})
