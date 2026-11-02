'use strict'

var assert = require('node:assert')
var ejs = require('ejs');
var express = require('..');
var path = require('node:path')
var tmpl = require('./support/tmpl');

describe('app', function(){
  describe('.render(name, fn)', function(){
    it('should support absolute paths', function(done){
      var app = createApp();

      app.locals.user = { name: 'tobi' };

      app.render(path.join(__dirname, 'fixtures', 'user.tmpl'), function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    })

    it('should support absolute paths with "view engine"', function(done){
      var app = createApp();

      app.set('view engine', 'tmpl');
      app.locals.user = { name: 'tobi' };

      app.render(path.join(__dirname, 'fixtures', 'user'), function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    })

    it('should throw without a view engine or file extension', function(){
      var app = express();

      assert.throws(function () {
        app.render('user', function () {
          assert.fail('render callback should not be called');
        });
      }, /No default engine was specified and no extension was provided\./);
    })

    it('should throw when the view engine module does not exist', function(){
      var app = express();

      app.set('view engine', 'express-test-missing-engine');

      assert.throws(function () {
        app.render('user', function () {
          assert.fail('render callback should not be called');
        });
      }, {
        code: 'MODULE_NOT_FOUND',
        message: /^Cannot find module 'express-test-missing-engine'(?:\n|$)/
      });
    })

    it('should expose app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.render('user.tmpl', function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    })

    it('should support index.<engine>', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.set('view engine', 'tmpl');

      app.render('blog/post', function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<h1>blog post</h1>')
        done();
      })
    })

    it('should handle render error throws', function(done){
      var app = express();

      function View(name, options){
        this.name = name;
        this.path = 'fale';
      }

      View.prototype.render = function(options, fn){
        throw new Error('err!');
      };

      app.set('view', View);

      app.render('something', function(err, str){
        assert.ok(err)
        assert.strictEqual(err.message, 'err!')
        done();
      })
    })

    describe('when the file does not exist', function(){
      it('should provide a helpful error', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))
        app.render('rawr.tmpl', function (err) {
          assert.ok(err)
          assert.equal(err.message, 'Failed to lookup view "rawr.tmpl" in views directory "' + path.join(__dirname, 'fixtures') + '"')
          done();
        });
      })
    })

    describe('when an error occurs', function(){
      it('should invoke the callback', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('user.tmpl', function (err) {
          assert.ok(err)
          assert.equal(err.name, 'RenderError')
          done()
        })
      })

      it('should pass a sync engine throw to the callback on first render', function(done){
        var app = express();
        var error = new Error('render failed');

        app.engine('tmpl', function () {
          throw error;
        });
        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('user.tmpl', function (err) {
          assert.strictEqual(err, error)
          done();
        })
      })
    })

    describe('when the view name ends with a "."', function(){
      it('should invoke the callback with a lookup error instead of crashing', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))
        app.set('view engine', 'tmpl');

        app.render('user.', function (err) {
          assert.ok(err)
          assert.notStrictEqual(err.code, 'ERR_INVALID_ARG_VALUE')
          assert.equal(err.message, 'Failed to lookup view "user." in views directory "' + path.join(__dirname, 'fixtures') + '"')
          done()
        })
      })
    })

    describe('when an extension is given', function(){
      it('should render the template', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>This is an email</p>')
          done();
        })
      })
    })

    describe('when "view engine" is given', function(){
      it('should render the template', function(done){
        var app = createApp();

        app.set('view engine', 'tmpl');
        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email', function(err, str){
          if (err) return done(err);
          assert.strictEqual(str, '<p>This is an email</p>')
          done();
        })
      })
    })

    describe('when "views" is given', function(){
      it('should lookup the file in the path', function(done){
        var app = createApp();

        app.set('views',  path.join(__dirname, 'fixtures', 'default_layout'))
        app.locals.user = { name: 'tobi' };

        app.render('user.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')
          done();
        })
      })

      describe('when array of paths', function(){
        it('should lookup the file in the path', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.user = { name: 'tobi' };

          app.render('user.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<span>tobi</span>')
            done();
          })
        })

        it('should lookup in later paths until found', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.name = 'tobi';

          app.render('name.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<p>tobi</p>')
            done();
          })
        })

        it('should continue past an empty-string root', function(done){
          var app = createApp();

          app.set('views', ['', path.join(__dirname, 'fixtures')]);
          app.locals.user = { name: 'tobi' };

          app.render('user.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<p>tobi</p>')
            done();
          })
        })

        it('should continue looking up after an ENOTDIR stat error', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'user.tmpl'),
            path.join(__dirname, 'fixtures')
          ];

          app.set('views', views);
          app.locals.user = { name: 'tobi' };

          app.render('user.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<p>tobi</p>')
            done();
          })
        })

        it('should error if file does not exist', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.name = 'tobi';

          app.render('pet.tmpl', function (err, str) {
            assert.ok(err)
            assert.equal(err.message, 'Failed to lookup view "pet.tmpl" in views directories "' + views[0] + '" or "' + views[1] + '"')
            done();
          })
        })
      })
    })

    describe('when a "view" constructor is given', function(){
      it('should create an instance of it', function(done){
        var app = express();

        function View(name, options){
          this.name = name;
          this.path = 'path is required by application.js as a signal of success even though it is not used there.';
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(str, 'abstract engine')
          done();
        })
      })

      it('should error when a custom view leaves path unset', function(done){
        var app = express();

        function View(name, options){
          this.name = name;
          this.root = options.root;
        }

        View.prototype.render = function(){
          throw new Error('render should not be called');
        };

        app.set('view', View);

        app.render('something', function(err){
          assert.ok(err)
          assert.match(err.message, /^Failed to lookup view "something"/)
          done();
        })
      })

      it('should honor a View subclass that clears path to deny a view', function(done){
        var app = express();
        var BaseView = app.get('view');

        app.engine('tmpl', function (file, options, fn) {
          fn(null, 'served');
        });
        app.set('views', path.join(__dirname, 'fixtures'))

        function DenyView(name, options){
          BaseView.call(this, name, options);
          this.path = null;
        }

        DenyView.prototype = Object.create(BaseView.prototype);
        DenyView.prototype.constructor = DenyView;

        app.set('view', DenyView);

        app.render('user.tmpl', function (err){
          assert.ok(err, 'denied view must not be served')
          assert.match(err.message, /^Failed to lookup view "user\.tmpl"/)
          done();
        })
      })
    })

    describe('engine caching', function(){
      it('should cache an automatically loaded engine', function(done){
        var app = express();

        app.disable('view cache');
        app.set('views', path.join(__dirname, 'fixtures'))
        app.locals.user = { name: 'tobi' };

        assert.strictEqual(app.engines['.ejs'], undefined)

        app.render('user.ejs', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')
          assert.strictEqual(app.engines['.ejs'], ejs.__express)
          done();
        })
      })

      it('should use a replacement engine on subsequent renders', function(done){
        var app = express();
        var calls = 0;

        // Construct a new View on each render so its cached engine is exercised.
        app.disable('view cache');
        app.set('views', path.join(__dirname, 'fixtures'))
        app.locals.user = { name: 'tobi' };

        app.render('user.ejs', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')

          var engine = app.engines['.ejs'];
          assert.strictEqual(engine, ejs.__express)

          app.engine('ejs', function (file, options, callback) {
            calls++;
            engine(file, options, callback);
          });
          app.locals.user = { name: 'loki' };

          app.render('user.ejs', function (err2, str2) {
            if (err2) return done(err2);
            assert.strictEqual(str2, '<p>loki</p>')
            assert.strictEqual(calls, 1)
            done();
          })
        })
      })
    })

    describe('caching', function(){
      it('should not cache views whose lookup failed', function(done){
        var app = createApp();

        app.enable('view cache');
        app.set('views', path.join(__dirname, 'fixtures', 'local_layout'))

        app.render('email.tmpl', function (err) {
          assert.ok(err)
          assert.match(err.message, /^Failed to lookup view "email\.tmpl"/)

          app.set('views', path.join(__dirname, 'fixtures'))

          app.render('email.tmpl', function (err2, str) {
            if (err2) return done(err2);
            assert.strictEqual(str, '<p>This is an email</p>')
            done();
          })
        })
      })

      it('should always lookup view without cache', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', false);
        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 2)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      })

      it('should cache with "view cache" setting', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', true);
        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      })
    })
  })

  describe('.render(name, options, fn)', function(){
    it('should render the template', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      var user = { name: 'tobi' };

      app.render('user.tmpl', { user: user }, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    })

    it('should expose app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.render('user.tmpl', {}, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    })

    it('should give precedence to app.render() locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };
      var jane = { name: 'jane' };

      app.render('user.tmpl', { user: jane }, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>jane</p>')
        done();
      })
    })

    it('should accept null or undefined options', function (done) {
      var app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.render('user.tmpl', null, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')

        app.render('user.tmpl', undefined, function (err2, str2) {
          if (err2) return done(err2);
          assert.strictEqual(str2, '<p>tobi</p>')
          done()
        })
      })
    })

    describe('caching', function(){
      it('should cache with cache option', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', false);
        app.set('view', View);

        app.render('something', {cache: true}, function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', {cache: true}, function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      })
    })
  })
})

function createApp() {
  var app = express();

  app.engine('.tmpl', tmpl);

  return app;
}
