
/**
 * Module dependencies.
 */

var express = require('express')
  , connect = require('connect')
  , assert = require('assert')
  , should = require('should')
  , View = require('../lib/view')
  , partial = require('../lib/view/partial')

/**
 * Create a test server with views set to ./fixtures.
 */

var create = function(){
  var app = express.createServer.apply(express, arguments);
  app.set('views', __dirname + '/fixtures');
  return app;
};

module.exports = {
  'test View#path': function(){
    var view = new View('forum/thread.ejs', { root: '/www/mysite/views' });
    view.path.should.equal('/www/mysite/views/forum/thread.ejs');

    var view = new View('/www/mysite/views/path.ejs');
    view.path.should.equal('/www/mysite/views/path.ejs');

    var view = new View('user', { parentView: view });
    view.path.should.equal('/www/mysite/views/user.ejs');

    var view = new View('user/list', { parentView: view });
    view.path.should.equal('/www/mysite/views/user/list.ejs');

    var view = new View('user.jade', { parentView: new View('foo', { root: '/bar' }) });
    view.path.should.equal('/bar/user.jade');

    var view = new View('/foo.bar.baz/user.ejs');
    view.path.should.equal('/foo.bar.baz/user.ejs');
    
    var view = new View('/foo.bar.baz/user', { parentView: view });
    view.path.should.equal('/foo.bar.baz/user.ejs');

    var view = new View('user', { parentView: view });
    view.path.should.equal('/foo.bar.baz/user.ejs');
  },
  
  'test View#engine': function(){
    var view = new View('/absolute/path.ejs');
    view.engine.should.equal('ejs');

    var view = new View('user', { parentView: view });
    view.engine.should.equal('ejs');

    var view = new View('/user', { defaultEngine: 'jade' });
    view.engine.should.equal('jade');

    var view = new View('/foo.bar/user.ejs');
    view.engine.should.equal('ejs');
  },
  
  'test View#extension': function(){
    var view = new View('/absolute/path.ejs');
    view.extension.should.equal('.ejs');

    var view = new View('user', { parentView: view });
    view.extension.should.equal('.ejs');

    var view = new View('/user', { defaultEngine: 'jade' });
    view.extension.should.equal('.jade');

    var view = new View('/foo.bar/user.ejs');
    view.extension.should.equal('.ejs');
  },
  
  'test View#dirname': function(){
    var view = new View('/absolute/path.ejs');
    view.dirname.should.equal('/absolute');

    var view = new View('user', { parentView: view });
    view.dirname.should.equal('/absolute');
  },
  
  'test View#contents': function(){
    var view = new View(__dirname + '/fixtures/hello.jade');
    view.contents.should.equal('p :(');
  },
  
  'test View#templateEngine': function(){
    var view = new View(__dirname + '/fixtures/hello.jade');
    view.templateEngine.should.equal(require('jade'));
  },
  
  'test partial.resolveObjectName()': function(){
    var resolve = partial.resolveObjectName;
    resolve('/path/to/user.ejs').should.equal('user');
    resolve('/path/to/user-post.ejs').should.equal('userPost');
    resolve('/path/to/user   post.ejs').should.equal('userPost');
    resolve('forum thread post.ejs').should.equal('forumThreadPost');
    resolve('forum   thread post.ejs').should.equal('forumThreadPost');
  },
  
  'test #render()': function(){
    var app = create();
    app.set('view engine', 'jade');
    app.register('haml', require('hamljs'));
  
    app.get('/', function(req, res){
      res.render('index.jade', { layout: false });
    });
  
    app.get('/jade', function(req, res){
      res.render('index', { layout: false });
    });
  
    app.get('/haml', function(req, res){
      res.render('hello.haml', { layout: false });
    });
  
    app.get('/callback/layout/no-options', function(req, res){
      res.render('hello.jade', function(err, str){
        assert.ok(!err);
        res.send(str.replace(':(', ':)'));
      });
    });
  
    app.get('/callback/layout', function(req, res){
      res.render('hello.jade', {}, function(err, str){
        assert.ok(!err);
        res.send(str.replace(':(', ':)'));
      });
    });
  
    app.get('/callback', function(req, res){
      res.render('hello.haml', { layout: false }, function(err, str){
        assert.ok(!err);
        res.send(str.replace('Hello World', ':)'));
      });
    });
  
    app.get('/invalid', function(req, res){
      res.render('invalid.jade', { layout: false });
    });
  
    app.get('/invalid-async', function(req, res){
      process.nextTick(function(){
        res.render('invalid.jade', { layout: false });
      });
    });
  
    app.get('/error', function(req, res){
      res.render('invalid.jade', { layout: false }, function(err){
        res.send(err.arguments[0]);
      });
    });
  
    app.get('/absolute', function(req, res){
      res.render(__dirname + '/fixtures/index.jade', { layout: false });
    });
  
    app.get('/ferret', function(req, res){
      res.render('ferret', { layout: false, ferret: { name: 'Tobi' }});
    });
  
    app.get('/status', function(req, res){
      res.render('hello.jade', { status: 500 });
    });
  
    assert.response(app,
      { url: '/status' },
      { status: 500 });
    assert.response(app,
      { url: '/ferret' },
      { body: '<li class="ferret">Tobi</li>' });
    assert.response(app,
      { url: '/' },
      { body: '<p>Welcome</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    assert.response(app,
      { url: '/jade' },
      { body: '<p>Welcome</p>' });
    assert.response(app,
      { url: '/absolute' },
      { body: '<p>Welcome</p>' });
    assert.response(app,
      { url: '/haml' },
      { body: '\n<p>Hello World</p>' });
    assert.response(app,
      { url: '/callback' },
      { body: '\n<p>:)</p>' });
    assert.response(app,
      { url: '/callback/layout' },
      { body: '<html><body><p>:)</p></body></html>' });
    assert.response(app,
      { url: '/callback/layout/no-options' },
      { body: '<html><body><p>:)</p></body></html>' });
    assert.response(app,
      { url: '/error' },
      { body: 'doesNotExist' });
    assert.response(app,
      { url: '/invalid' },
      function(res){
        assert.ok(res.body.indexOf('ReferenceError') >= 0);
        assert.ok(res.body.indexOf('doesNotExist') >= 0);
      });
    assert.response(app,
      { url: '/invalid-async' },
      function(res){
        assert.ok(res.body.indexOf('ReferenceError') >= 0);
        assert.ok(res.body.indexOf('doesNotExist') >= 0);
      });
  },
  
  'test #render() layout': function(){
    var app = create();
    app.set('view engine', 'jade');
  
    app.get('/', function(req, res){
      res.render('index.jade');
    });
    app.get('/jade', function(req, res){
      res.render('index');
    });
  
    assert.response(app,
      { url: '/' },
      { body: '<html><body><p>Welcome</p></body></html>' });
  },
  
  'test #render() specific layout': function(beforeExit){
    var app = create()
      , called;
  
    app.get('/', function(req, res){
      res.render('index.jade', { layout: 'cool-layout.jade' }, function(err, html){
        called = true;
        res.send(html);
      });
    });
    app.get('/no-ext', function(req, res){
      res.render('index.jade', { layout: 'cool-layout' });
    });
    app.get('/relative', function(req, res){
      res.render('index.jade', { layout: 'layouts/foo.jade' });
    });
    app.get('/absolute', function(req, res){
      res.render('index.jade', { layout: __dirname + '/fixtures/layouts/foo.jade' });
    });
    app.get('/nope', function(req, res){
      res.render('index.jade', { layout: 'nope.jade' });
    });
  
    assert.response(app,
      { url: '/' },
      { body: '<cool><p>Welcome</p></cool>' });
    assert.response(app,
      { url: '/no-ext' },
      { body: '<cool><p>Welcome</p></cool>' });
    assert.response(app,
      { url: '/relative' },
      { body: '<foo></foo>' });
    assert.response(app,
      { url: '/absolute' },
      { body: '<foo></foo>' });
    assert.response(app,
      { url: '/nope' },
      function(res){
        assert.ok(~res.body.indexOf('Error: failed to locate view'));
        assert.ok(~res.body.indexOf('nope'));
      });
  
    beforeExit(function(){
      assert.ok(called, 'Layout callback never called'); 
    });
  },
  
  'test #render() specific layout "view engine"': function(){
    var app = create();
    app.set('view engine', 'jade');
    
    app.get('/', function(req, res){
      res.render('index', { layout: 'cool-layout' });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<cool><p>Welcome</p></cool>' });
  },
  
  'test #render() view layout control': function(){
    var app = create();
    app.set('view engine', 'jade');
    
    app.get('/', function(req, res){
      res.render('layout-switch');
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<div id="alternate"><h1>My Page</h1></div>' });
  },
  
  'test #render() "view engine" with periods in dirname': function(){
    var app = create();
    app.set('view engine', 'jade');
    
    app.get('/', function(req, res){
      res.render('index', { layout: __dirname + '/fixtures/user/../cool-layout' });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<cool><p>Welcome</p></cool>' });
  },
  
  'test #render() view helpers': function(beforeExit){
    var app = create()
      , calls = 0;
  
    app.locals({
      lastName: 'holowaychuk'
    });
  
    app.helpers({ 
      greetings: function(sess, lastName){
        return 'Hello ' + sess.name + ' ' + lastName; 
      }
    });
  
    var ret = app.dynamicHelpers({
      session: function(req, res){
        ++calls;
        req.should.be.a('object');
        res.should.be.a('object');
        this.should.equal(app);
        return req.session;
      }
    });
  
    assert.equal(app, ret, 'Server#helpers() is not chainable');
    
    app.get('/', function(req, res){
      req.session = { name: 'tj' };
      res.render('dynamic-helpers.jade', { layout: false });
    });
  
    app.get('/ejs', function(req, res){
      req.session = { name: 'tj' };
      res.render('dynamic-helpers.ejs', { layout: false });
    });
  
    app.get('/precedence', function(req, res){
      req.session = { name: 'tj' };
      res.render('dynamic-helpers.jade', {
        lastName: 'foobar'
      });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<p>Hello tj holowaychuk</p>' });
    assert.response(app,
      { url: '/ejs' },
      { body: '<p>Hello tj holowaychuk</p>' });
    assert.response(app,
      { url: '/precedence' },
      { body: '<html><body><p>Hello tj foobar</p></body></html>' });
  
    beforeExit(function(){
      assert.equal(3, calls);
    });
  },
  
  'test #partial() collection object': function(){
    var app = create();

    app.get('/', function(req, res){
      var items = { 2: 'foo', bar: 'bar' };
      res.partial('object-item.jade', { as: 'item', collection: items });
    });

    assert.response(app,
      { url: '/' },
      { body: '<li>2: foo</li><li>bar: bar</li>' });
  },
  
  'test #partial()': function(){
    var app = create();
  
    app.set('view engine', 'jade');
  
    // Auto-assigned local w/ collection option
    app.get('/', function(req, res){
      res.render('items.jade', { items: ['one', 'two'] });
    });
    
   assert.response(app,
      { url: '/' },
      { body: '<html><body><ul><li>one</li><li>two</li></ul></body></html>' });
  
    // Auto-assigned local w/ collection array    
    var movies = [
      { title: 'Nightmare Before Christmas', director: 'Tim Burton' },
      { title: 'Avatar', director: 'James Cameron' }
    ];
    app.get('/movies', function(req, res){
      res.render('movies.jade', { movies: movies });
    });
  
    var html = [
      '<html>',
      '<body>',
      '<ul>',
      '<li>',
      '<div class="title">Nightmare Before Christmas</div>',
      '<div class="director">Tim Burton</div>',
      '</li>',
      '<li>',
      '<div class="title">Avatar</div>',
      '<div class="director">James Cameron</div>',
      '</li>',
      '</ul>',
      '</body>',
      '</html>'
    ].join('');
  
    assert.response(app,
      { url: '/movies' },
      { body: html });
  
    // as: str collection option
    app.get('/user', function(req, res){
      res.partial('user', {
        as: 'person',
        collection: [{ name: 'tj' }]
      });
    });
    
    assert.response(app,
      { url: '/user' },
      { body: '<p>tj</p>' });
  
    // as: with object collection
    app.get('/user/object', function(req, res){
      res.partial('user.jade', {
        as: 'person',
        collection: { 0: { name: 'tj' }, length: 1 }
      });
    });
    
    assert.response(app,
      { url: '/user' },
      { body: '<p>tj</p>' });

    // as: global collection option
    app.get('/videos', function(req, res){
      res.partial('video.jade', {
        as: global,
        collection: movies
      });
    });
  
    assert.response(app,
      { url: '/videos' },
      { body: '<p>Tim Burton</p><p>James Cameron</p>' });
    
    // Magic variables
    app.get('/magic', function(req, res){
      res.partial('magic.jade', {
        as: 'word',
        collection: ['one', 'two', 'three']
      });
    });
    
    assert.response(app,
      { url: '/magic' },
      { body: '<li class="first">one</li><li class="word-1">two</li><li class="last">three</li>' });
    
    // Non-collection support
    app.get('/movie', function(req, res){
      res.partial('movie.jade', {
        object: movies[0]
      });
    });
    
    assert.response(app,
      { url: '/movie' },
      { body: '<li><div class="title">Nightmare Before Christmas</div><div class="director">Tim Burton</div></li>' });

    app.get('/video-global', function(req, res){
      res.partial('video.jade', {
        object: movies[0],
        as: global
      }); 
    });
    
    // Non-collection as: global
    assert.response(app,
      { url: '/video-global' },
      { body: '<p>Tim Burton</p>' });
  
    // No options
    app.get('/nothing', function(req, res){
      res.partial('hello.ejs');
    });
    
    assert.response(app,
      { url: '/nothing' },
      { body: 'Hello' });
  
    // Path segments + "as"
    app.get('/role/as', function(req, res){
      res.partial('user/role.ejs', { as: 'role', collection: ['admin', 'member'] });
    });
      
    assert.response(app,
      { url: '/role/as' },
      { body: '<li>Role: admin</li><li>Role: member</li>' });
      
    // Deduce name from last segment
    app.get('/role', function(req, res){
      res.partial('user/role.ejs', ['admin', 'member']);
    });
      
    assert.response(app,
      { url: '/role' },
      { body: '<li>Role: admin</li><li>Role: member</li>' });
      
    // Non-basic object support
    function Movie(title, director){
      this.title = title;
      this.director = director;
    }
      
    app.get('/movie/object', function(req, res){
      res.partial('movie', new Movie('The TJ', 'tj'));
    });
      
    assert.response(app,
      { url: '/movie/object' },
      { body: '<li><div class="title">The TJ</div><div class="director">tj</div></li>' });

    // Locals
    app.get('/stats', function(req, res){
      res.partial('stats', {
          hits: 12
        , misses: 1
      });
    });

    assert.response(app,
      { url: '/stats' },
      { body: '<p>Hits 12</p><p>Misses 1</p>' });

    // Locals
    app.get('/stats/locals', function(req, res){
      res.partial('stats', {
        locals: {
             hits: 12
          , misses: 1 
        }
      });
    });

    assert.response(app,
      { url: '/stats/locals' },
      { body: '<p>Hits 12</p><p>Misses 1</p>' });

    // Collection + locals
    app.get('/items', function(req, res){
      res.partial('item-title', {
          collection: ['foo', 'bar']
        , title: 'test'
        , as: 'item'
      });
    });
      
    assert.response(app,
      { url: '/items' },
      { body: '<li>test foo</li><li>test bar</li>' });
    
    app.get('/stats/callback', function(req, res){
      res.partial('stats', { hits: 12, misses: 1 }, function(err, html){
        res.send('got: ' + html);
      });
    });

    assert.response(app,
      { url: '/stats/callback' },
      { body: 'got: <p>Hits 12</p><p>Misses 1</p>' });

    app.get('/stats/callback/2', function(req, res){
      res.locals({ hits: 12, misses: 1 });
      res.partial('stats', function(err, html){
        res.send('got: ' + html);
      });
    });

    assert.response(app,
      { url: '/stats/callback/2' },
      { body: 'got: <p>Hits 12</p><p>Misses 1</p>' });

    // root lookup

    app.get('/root', function(req, res){
      res.partial('nested/partial');
    });

    assert.response(app,
      { url: '/root' },
      { body: '<p>Hits 15</p><p>Misses 1</p>' });

    // root _* lookup

    app.get('/root/underscore', function(req, res){
      res.partial('nested/partial2');
    });

    assert.response(app,
      { url: '/root/underscore' },
      { body: '<p>Testing</p>' });

    // error in template

    app.get('/error', function(req, res){
      process.nextTick(function(){
        res.partial('error');
      });
    });

    assert.response(app,
      { url: '/error' },
      { status: 500 });

    app.get('/underscore', function(req, res, next){
      res.partial('foobar');
    });

    assert.response(app,
      { url: '/underscore' },
      { body: '<p>two</p>' });
  },
  
  'test #partial() relative lookup with "view engine"': function(){
    var app = create();
    app.set('view engine', 'jade');

    app.get('/', function(req, res, next){
      res.render('forum/thread', { layout: false });
    });

    app.get('/2', function(req, res, next){
      res.render('forum/../forum/thread', { layout: false });
    });

    assert.response(app,
      { url: '/2' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });

    assert.response(app,
      { url: '/' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });
  },

  'test #partial() relative lookup without "view engine"': function(){
    var app = create();

    app.get('/', function(req, res, next){
      res.render('forum/thread.jade', { layout: false });
    });

    app.get('/2', function(req, res, next){
      res.render('forum/../forum/thread.jade', { layout: false });
    });

    assert.response(app,
      { url: '/2' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });

    assert.response(app,
      { url: '/' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });
  },
  
  'test #partial() relative lookup': function(){
    var app = create();

    app.get('/', function(req, res, next){
      res.partial('forum/thread.jade');
    });

    app.get('/2', function(req, res, next){
      res.partial('forum/../forum/thread.jade');
    });

    assert.response(app,
      { url: '/2' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });

    assert.response(app,
      { url: '/' },
      { body: '<h1>Forum Thread</h1><p>:(</p>\n<p>Hello World</p>' });
  },

  'test #partial() with several calls': function(){
    var app = create();
  
    app.get('/', function(req, res, next){
      res.render('list.jade', { layout: false });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<ul><li>foo</li><li>empty</li></ul>' });
  },
  
  'test #partial() with several calls using locals': function(){
    var app = create();
  
    app.get('/', function(req, res, next){
      res.render('list2.jade', { layout: false });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<ul><li>foo</li><li>bar</li><li>empty</li></ul>' });
  },
  
  'test #partial() locals': function(){
    var app = create();
  
    app.set('view engine', 'jade');
  
    app.get('/', function(req, res, next){
      res.partial('pet-count', {
        locals: {
          pets: {
            length: 5
          }
        }
      });
    });
  
    assert.response(app,
      { url: '/' },
      { body: 'We have 5 cool pets\n' });
  },
  
  'test #partial() locals precedence': function(){
    var app = create();
  
    app.get('/', function(req, res, next){
      res.render('greetings.jade', {
          name: 'TJ'
        , locals: { otherName: 'Overridden' }
      });
    });
  
    assert.response(app,
      { url: '/' },
      { body: '<html><body><h1>TJ</h1><p>Welcome Overridden</p></body></html>' });
  },
  
  'test #partial() index': function(){
    var app = create();
  
    app.set('view engine', 'jade');

    function Ferret(name){ this.name = name; };

    app.get('/ferret', function(req, res){
      res.partial('ferret', new Ferret('Tobi'));
    });
    
    app.get('/ferret/basic', function(req, res){
      res.partial('ferret', { ferret: { name: 'Tobi' }});
    });

    assert.response(app,
      { url: '/ferret/basic' },
      { body: '<li class="ferret">Tobi</li>' });

    assert.response(app,
      { url: '/ferret' },
      { body: '<li class="ferret">Tobi</li>' });
  },
  
  'test #partial() relative index': function(){
    var app = create();

    app.set('view engine', 'jade');

    function Ferret(name) { this.name = name; }
    app.get('/ferret', function(req, res){
      var tobi = new Ferret('Tobi')
        , loki = new Ferret('Loki');
      res.partial('ferret/list', { object: [tobi, loki] });
    });
  
    assert.response(app,
      { url: '/ferret' },
      { body: '<ul id="ferrets"><li class="ferret">Tobi</li><li class="ferret">Loki</li></ul>' });
  },
  
  'test #partial() object': function(){
    var app = create();
  
    app.get('/', function(req, res, next){
      function Movie(title, director) {
        this.title = title;
        this.director = director;
      }
      res.partial('movie.jade', new Movie('Foobar', 'Tim Burton'));
    });
  
    assert.response(app,
      { url: '/' },
      { body: '<li><div class="title">Foobar</div><div class="director">Tim Burton</div></li>' });
  },
  
  'test #partial() locals with collection': function(){
    var app = create();
  
    app.get('/', function(req, res, next){
      res.render('pet-land.jade', {
        pets: ['Ewald']
      });
    });
  
    assert.response(app,
      { url: '/' },
      { body: '<html><body><div><li>Ewald is the coolest of Animal land</li></div></body></html>' });
  },
  
  'test #partial() inheriting initial locals': function(){
    var app = create();
  
    app.get('/pets', function(req, res, next){
      res.render('pets.jade', {
          site: 'My Cool Pets'
        , pets: ['Tobi', 'Jane', 'Bandit']
      });
    });
  
    var html = [
      '<html>',
      '<body>',
      '<h1>My Cool Pets</h1>',
      '<p>We have 3 cool pets\n</p>',
      '<ul>',
      '<li>Tobi is the coolest of My Cool Pets</li>',
      '<li>Jane</li>',
      '<li>Bandit</li>',
      '</ul>',
      '</body>',
      '</html>'
    ].join('');
  
    assert.response(app,
      { url: '/pets' },
      { body: html });
  },
  
  'test #partial() with array-like collection': function(){
    var app = create();
  
    var movies = {
      0: { title: 'Nightmare Before Christmas', director: 'Tim Burton' },
      1: { title: 'Avatar', director: 'James Cameron' },
      length: 2
    };
    app.get('/movies', function(req, res){
        res.render('movies.jade', { movies: movies });
    });
        
    var html = [
      '<html>',
      '<body>',
      '<ul>',
      '<li>',
      '<div class="title">Nightmare Before Christmas</div>',
      '<div class="director">Tim Burton</div>',
      '</li>',
      '<li>',
      '<div class="title">Avatar</div>',
      '<div class="director">James Cameron</div>',
      '</li>',
      '</ul>',
      '</body>',
      '</html>'
    ].join('');
  
    assert.response(app,
      { url: '/movies' },
      { body: html });
  },
  
  'test "partials" setting': function(){
    var app = create();
    app.set('partials', __dirname + '/fixtures/sub-templates');
  
    app.get('/', function(req, res){
      res.render('items.jade', {
        layout: false,
        items: ['foo', 'bar']
      });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<ul><li>foo</li><li>bar</li></ul>' });
  },
  
  'test "view options"': function(){
    var app = create();
    
    app.set('view options', {
        layout: false
      , open: '{{'
      , close: '}}'
    });
    
    app.get('/', function(req, res, next){
      res.render('user.ejs', {
          name: 'tj'
        , email: 'tj@vision-media.ca'
      });
    });
    
    app.get('/video', function(req, res, next){
      res.render('video.ejs', {
          open: '<?'
        , close: '?>'
        , title: 'keyboard cat'
      });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<h1>tj</h1>\n<p>tj@vision-media.ca</p>' });
    assert.response(app,
      { url: '/video' },
      { body: '<h1>keyboard cat</h1>' });
  },
  
  'test .register()': function(){
    var app = create();
    
    app.register('.bar', require('jade'));
    
    app.get('/', function(req, res, next){
      res.render('foo.bar', { layout: false });
    });
    
    assert.response(app,
      { url: '/' },
      { body: '<p>This is actually jade :)</p>' });
  },
  
  'test res.local()': function(){
    var app = create();
    
    app.get('/video', function(req, res, next){
      res.local('open', '<?');
      res.local('close', '?>');
      res.local('title', 'Wahoo');
      res.render('video.ejs', { layout: false });
    });
    
    assert.response(app,
      { url: '/video' },
      { body: '<h1>Wahoo</h1>' });
  },
  
  'test res.local() render() precedence': function(){
    var app = create();
    
    app.get('/video', function(req, res, next){
      res.local('open', '<?');
      res.local('close', '?>');
      res.local('title', 'Wahoo');
      res.render('video.ejs', { layout: false, title: 'keyboard cat' });
    });
    
    assert.response(app,
      { url: '/video' },
      { body: '<h1>keyboard cat</h1>' });
  },
  
  'test res.local() "view options" precedence': function(){
    var app = create();
    
    app.set('view options', {
        layout: false
      , open: '<?'
      , title: 'Original'
    });
  
    function setTitle(req, res, next) {
      res.local('title', 'Wahoo');
      next();
    }
  
    app.get('/video', setTitle, function(req, res, next){
      res.local('close', '?>');
      res.render('video.ejs', { layout: false, title: 'keyboard cat' });
    });
    
    app.get('/video/2', setTitle, function(req, res, next){
      res.local('close', '?>');
      res.render('video.ejs', { layout: false });
    });
  
    app.get('/video/3', function(req, res, next){
      res.local('close', '?>');
      res.render('video.ejs', { layout: false });
    });
  
    assert.response(app,
      { url: '/video' },
      { body: '<h1>keyboard cat</h1>' });
  
    assert.response(app,
      { url: '/video/2' },
      { body: '<h1>Wahoo</h1>' });
  
    assert.response(app,
      { url: '/video/3' },
      { body: '<h1>Original</h1>' });
  },
  
  'test res.local() partials': function(){
    var app = create();
    
    app.set('view options', {
      site: 'My Cool Pets'
    });
    
    app.get('/pets', function(req, res, next){
      res.local('pets', ['Tobi']);
      next();
    });
    
    app.get('/pets', function(req, res, next){
      var pets;
      if (pets = res.local('pets')) {
        pets.push('Jane', 'Bandit');
      }
      next();
    });
  
    app.get('/pets', function(req, res, next){
      res.render('pets.jade');
    });
  
    var html = [
      '<html>',
      '<body>',
      '<h1>My Cool Pets</h1>',
      '<p>We have 3 cool pets\n</p>',
      '<ul>',
      '<li>Tobi is the coolest of My Cool Pets</li>',
      '<li>Jane</li>',
      '<li>Bandit</li>',
      '</ul>',
      '</body>',
      '</html>'
    ].join('');
  
    assert.response(app,
      { url: '/pets' },
      { body: html });
  },
  
  'test .charset with res.render()': function(){
    var app = create();
  
    app.get('/', function(req, res){
      res.charset = 'ISO-8859-1';
      res.render('hello.jade');
    });
  
    assert.response(app,
      { url: '/' },
      { headers: { 'Content-Type': 'text/html; charset=ISO-8859-1' }});
  },
  
  'test charset res.render() option': function(){
    var app = create();
  
    app.get('/', function(req, res){
      res.render('hello.jade', { charset: 'ISO-8859-1' });
    });
  
    assert.response(app,
      { url: '/' },
      { headers: { 'Content-Type': 'text/html; charset=ISO-8859-1' }});
  },
  
  'test charset option': function(){
    var app = create();
    app.set('view options', { charset: 'ISO-8859-1' });
  
    app.get('/', function(req, res){
      res.render('hello.jade');
    });
  
    assert.response(app,
      { url: '/' },
      { headers: { 'Content-Type': 'text/html; charset=ISO-8859-1' }});
  },
  
  'test charset override': function(){
    var app = create();
    app.set('view options', { charset: 'ISO-8859-1' });
  
    app.get('/', function(req, res){
      res.render('hello.jade', { charset: 'utf8' });
    });
  
    assert.response(app,
      { url: '/' },
      { headers: { 'Content-Type': 'text/html; charset=utf8' }});
  }
};
