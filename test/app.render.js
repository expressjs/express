'use strict'

var assert = require('node:assert')
var express = require('..');
var path = require('node:path')
var tmpl = require('./support/tmpl');
const View = require('../lib/view.js'); 

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

describe('View.prototype.render', function () {
  it('should force callback to be async and pass correct arguments', function (done) {
    var mockEngine = function (filePath, options, callback) {
      callback(null, 'rendered content');
    };

    var view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    var isAsync = false;

    var originalCallback = function (err, html) {
      assert(isAsync, 'Callback should be async');
      assert.strictEqual(err, null, 'Error should be null');
      assert.strictEqual(html, 'rendered content', 'Rendered content should match');
      done();
    };

    view.render({}, function (err, html) {
      isAsync = true;
      originalCallback(err, html);
    });
  });

  it('should handle errors correctly', function (done) {
    var mockEngine = function (filePath, options, callback) {
      callback(new Error('render error'));
    };

    var view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    view.render({}, function (err, html) {
      assert(err instanceof Error, 'Error should be an instance of Error');
      assert.strictEqual(err.message, 'render error', 'Error message should match');
      assert.strictEqual(html, undefined, 'HTML should be undefined when there is an error');
      done();
    });
  });

  it('should handle synchronous callbacks correctly', function (done) {
    var mockEngine = function (filePath, options, callback) {
      callback(null, 'sync rendered content');
    };

    var view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    var isAsync = false;

    var originalCallback = function (err, html) {
      assert(isAsync, 'Callback should be async');
      assert.strictEqual(err, null, 'Error should be null');
      assert.strictEqual(html, 'sync rendered content', 'Rendered content should match');
      done();
    };

    view.render({}, function (err, html) {
      isAsync = true;
      originalCallback(err, html);
    });
  });

  it('should pass correct arguments to the engine', function (done) {
    var mockEngine = function (filePath, options, callback) {
      assert.strictEqual(filePath, view.path, 'File path should match');
      assert.deepStrictEqual(options, { key: 'value' }, 'Options should match');
      callback(null, 'rendered content');
    };

    var view = new View('test', {
      root: path.join(__dirname, 'fixtures'),
      engines: { '.tmpl': mockEngine },
      defaultEngine: '.tmpl'
    });

    view.render({ key: 'value' }, function (err, html) {
      assert.strictEqual(err, null, 'Error should be null');
      assert.strictEqual(html, 'rendered content', 'Rendered content should match');
      done();
    });
  });
});

function createApp() {
  var app = express();

  app.engine('.tmpl', tmpl);

  return app;
}
