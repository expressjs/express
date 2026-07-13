'use strict'

var assert = require('node:assert')
var express = require('..');
var fs = require('node:fs')
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
        const app = express();

        app.engine('tmpl', function () {
          throw new Error('oops')
        })
        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('user.tmpl', function (err) {
          assert.ok(err)
          assert.strictEqual(err.message, 'oops')
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

        it('should ignore stat errors and keep looking up', function(done){
          const app = createApp();
          const views = [
            path.join(__dirname, 'fixtures', 'user.tmpl'), // a file: lookups inside it fail with ENOTDIR
            path.join(__dirname, 'fixtures')
          ]

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
          // a custom view only needs a (name, options) constructor
          // and a render(options, callback) method
          this.name = name;
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
    })

    describe('caching', function(){
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

  describe('view lookup concurrency', function () {
    it('should complete when more renders are in flight than the stat limit', function (done) {
      const app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      let remaining = 30;

      for (let i = 0; i < 30; i++) {
        app.render('user.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')
          if (--remaining === 0) done();
        })
      }
    })

    it('should coalesce concurrent lookups of the same cached view', function (done) {
      const app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.enable('view cache')
      app.locals.user = { name: 'tobi' };

      // count stat calls while delegating to the real fs.stat
      const realStat = fs.stat;
      let stats = 0;
      fs.stat = function countingStat() {
        stats++;
        return realStat.apply(fs, arguments);
      };

      let remaining = 10;

      for (let i = 0; i < 10; i++) {
        app.render('user.tmpl', function (err, str) {
          if (remaining === 0) return; // already failed
          if (err) {
            remaining = 0;
            fs.stat = realStat;
            return done(err);
          }

          assert.strictEqual(str, '<p>tobi</p>')

          if (--remaining === 0) {
            fs.stat = realStat;
            assert.strictEqual(stats, 1)
            done();
          }
        })
      }
    })

    describe('when a render callback throws', function () {
      it('should not stall subsequent lookups', function (done) {
        const app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))
        app.locals.user = { name: 'tobi' };

        // stub fs.stat to call back synchronously so the throw below
        // propagates to this stack frame instead of crashing the process
        const realStat = fs.stat;
        fs.stat = function stubStat(path, cb) {
          const err = new Error('stubbed ENOENT');
          err.code = 'ENOENT';
          cb(err);
        };

        let thrown = 0;

        try {
          // exhaust the stat limit with callbacks that throw
          for (let i = 0; i < 12; i++) {
            try {
              app.render('does-not-exist.tmpl', function () {
                throw new Error('boom');
              })
            } catch (err) {
              assert.strictEqual(err.message, 'boom')
              thrown++;
            }
          }
        } finally {
          fs.stat = realStat;
        }

        // every callback must have run despite the throws
        assert.strictEqual(thrown, 12)

        // a later render must still complete
        app.render('user.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')
          done();
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
