
var express = require('../')
  , request = require('supertest')
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
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    })

    it('should use first callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something&callback=somethingelse')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    })

    it('should ignore object callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback[a]=something')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"count":1}', done)
    })

    it('should allow renaming callback', function(done){
      var app = express();

      app.set('jsonp callback name', 'clb');

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?clb=something')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    })

    it('should allow []', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=callbacks[123]')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /callbacks\[123\]\(\{"count":1\}\);/, done);
    })

    it('should disallow arbitrary js', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({});
      });

      request(app)
      .get('/?callback=foo;bar()')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /foobar\(\{\}\);/, done);
    })

    it('should escape utf whitespace', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ str: '\u2028 \u2029 woot' });
      });

      request(app)
      .get('/?callback=foo')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\(\{"str":"\\u2028 \\u2029 woot"\}\);/, done);
    });

    it('should not escape utf whitespace for json fallback', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ str: '\u2028 \u2029 woot' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"str":"\u2028 \u2029 woot"}', done);
    });

    it('should include security header and prologue', function (done) {
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, /^\/\*\*\//, done);
    })

    it('should not override previous Content-Types with no callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.example+json; charset=utf-8')
      .expect(200, '{"hello":"world"}', function (err, res) {
        if (err) return done(err);
        res.headers.should.not.have.property('x-content-type-options');
        done();
      });
    })

    it('should override previous Content-Types with callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/?callback=cb')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, /cb\(\{"hello":"world"\}\);$/, done);
    })

    describe('when given primitives', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(null);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, 'null', done)
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
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '["foo","bar","baz"]', done)
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
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      })
    })

    describe('when given primitives', function(){
      it('should respond with json for null', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(null);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, 'null', done)
      })

      it('should respond with json for Number', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(300);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '300', done)
      })

      it('should respond with json for String', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp('str');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '"str"', done)
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
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      })
    })

    describe('"json spaces" setting', function(){
      it('should be undefined by default', function(){
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
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}', done)
      })
    })
  })

  describe('.jsonp(status, object)', function(){
    it('should respond with json and set the .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp(201, { id: 1 });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201, '{"id":1}', done)
    })
  })

  it('should not override previous Content-Types', function(done){
    var app = express();

    app.get('/', function(req, res){
      res.type('application/vnd.example+json');
      res.jsonp({ hello: 'world' });
    });

    request(app)
    .get('/')
    .expect('content-type', 'application/vnd.example+json; charset=utf-8')
    .expect(200, '{"hello":"world"}', done)
  })
})
