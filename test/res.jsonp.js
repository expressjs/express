
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('res', function(){
  describe('.jsonp(object)', function(){
    it('should respond with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('something && something({"count":1});');
        done();
      })
    })

    it('should allow renaming callback', function(done){
      var app = express();

      app.set('jsonp callback name', 'clb');

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?clb=something')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('something && something({"count":1});');
        done();
      })
    })      

    it('should allow []', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=callbacks[123]')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('callbacks[123] && callbacks[123]({"count":1});');
        done();
      })
    })

    it('should disallow arbitrary js', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({});
      });

      request(app)
      .get('/?callback=foo;bar()')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('foobar && foobar({});');
        done();
      })
    })

    describe('when given primitives', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(null);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
          res.text.should.equal('null');
          done();
        })
      })
    })

    describe('when given an array', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(['foo', 'bar', 'baz']);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
          res.text.should.equal('["foo","bar","baz"]');
          done();
        })
      })
    })
    
    describe('when given an object', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp({ name: 'tobi' });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
          res.text.should.equal('{"name":"tobi"}');
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
          res.jsonp({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('{"name":"tobi"}');
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
          res.jsonp({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('{\n  "name": "tobi",\n  "age": 2\n}');
          done();
        });
      })
    })
  })
  
  describe('.json(status, object)', function(){
    it('should respond with json and set the .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp(201, { id: 1 });
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.text.should.equal('{"id":1}');
        done();
      })
    })
  })

  describe('.json(object, status)', function(){
    it('should respond with json and set the .statusCode for backwards compat', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ id: 1 }, 201);
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
        res.text.should.equal('{"id":1}');
        done();
      })
    })
  })
})
