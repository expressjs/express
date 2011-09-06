### Installation

    $ npm install express

or to access the `express(1)` executable install globally:

    $ npm install -g express

## Quick Start

 The quickest way to get started with express is to utilize the executable `express(1)` to generate an application as shown below:

 Create the app:

    $ npm install -g express
    $ express /tmp/foo && cd /tmp/foo

 Install dependencies:

    $ npm install -d

 Start the server:

    $ node app.js

### Creating A Server

 To create an instance of the _express.HTTPServer_, simply invoke the _createServer()_ method. With our instance _app_ we can then define routes based on the HTTP verbs, in this example _app.get()_.

    var app = require('express').createServer();
    
    app.get('/', function(req, res){
      res.send('hello world');
    });
    
    app.listen(3000);

### Creating An HTTPS Server

 To initialize a _express.HTTPSServer_ we do the same as above, however we
 pass an options object, accepting _key_, _cert_ and the others mentioned in node's [https documentation](http://nodejs.org/docs/v0.3.7/api/https.html#https.createServer).
 
     var app = require('express').createServer({ key: ... });

### Configuration

Express supports arbitrary environments, such as _production_ and _development_. Developers
can use the _configure()_ method to setup needs required by the current environment. When
_configure()_ is called without an environment name it will be run in _every_ environment 
prior to the environment specific callback.

In the example below we only _dumpExceptions_, and respond with exception stack traces
in _development_ mode, however for both environments we utilize _methodOverride_ and _bodyParser_.
Note the use of _app.router_, which can (optionally) be used to mount the application routes,
otherwise the first call to _app.get()_, _app.post()_, etc will mount the routes.

    app.configure(function(){
  		app.use(express.methodOverride());
  		app.use(express.bodyParser());
  		app.use(app.router);
  	});
	
  	app.configure('development', function(){
  		app.use(express.static(__dirname + '/public'));
  		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  	});
	
    app.configure('production', function(){
      var oneYear = 31557600000;
      app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
      app.use(express.errorHandler());
    });

For similar environments you may also pass several env strings:

    app.configure('stage', 'prod', function(){
      // config
    });

For internal and arbitrary settings Express provides the _set(key[, val])_, _enable(key)_, _disable(key)_ methods:

     app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('views');
        // => "/absolute/path/to/views"
        
        app.enable('some feature');
        // same as app.set('some feature', true);
        
        app.disable('some feature');
        // same as app.set('some feature', false);
     
        app.enabled('some feature')
        // => false
     });

To alter the environment we can set the _NODE_ENV_ environment variable, for example:

    $ NODE_ENV=production node app.js

This is _very_ important, as many caching mechanisms are _only enabled_ when in production.

### Settings

Express supports the following settings out of the box:

  * _home_ Application base path used for _res.redirect()_ and transparently handling mounted apps.
  * _views_ Root views directory defaulting to **CWD/views**
  * _view engine_ Default view engine name for views rendered without extensions
  * _view cache_ Enable view caching (enabled in production)
  * _charset_ Alter the default charset of "utf-8"
  * _case sensitive routes_ Enable case-sensitive routing
  * _strict routing_ When enabled trailing slashes are no longer ignored
  * _jsonp callback_ Enable _res.send()_ / _res.json()_ transparent jsonp support

### Routing

Express utilizes the HTTP verbs to provide a meaningful, expressive routing API.
For example we may want to render a user's account for the path _/user/12_, this
can be done by defining the route below. The values associated to the named placeholders 
are available as `req.params`.

    app.get('/user/:id', function(req, res){
  		res.send('user ' + req.params.id);
  	});

A route is simple a string which is compiled to a _RegExp_ internally. For example
when _/user/:id_ is compiled, a simplified version of the regexp may look similar to:

    \/user\/([^\/]+)\/?

Regular expression literals may also be passed for complex uses. Since capture
groups with literal _RegExp_'s are anonymous we can access them directly `req.params`. So our first capture group would be _req.params[0]_ and the second would follow as _req.params[1]_.

    app.get(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, function(req, res){
        res.send(req.params);
    });

Curl requests against the previously defined route:

       $ curl http://dev:3000/user
       [null,null]
       $ curl http://dev:3000/users
       [null,null]
       $ curl http://dev:3000/users/1
       ["1",null]
       $ curl http://dev:3000/users/1..15
       ["1","15"]

Below are some route examples, and the associated paths that they
may consume:

     "/user/:id"
     /user/12

     "/users/:id?"
     /users/5
     /users

     "/files/*"
     /files/jquery.js
     /files/javascripts/jquery.js

     "/file/*.*"
	 /files/jquery.js
	 /files/javascripts/jquery.js
	
	 "/user/:id/:operation?"
	 /user/1
	 /user/1/edit
	
	 "/products.:format"
	 /products.json
	 /products.xml

	 "/products.:format?"
	 /products.json
	 /products.xml
	 /products
	 
	 "/user/:id.:format?"
	 /user/12
	 /user/12.json

For example we can __POST__ some json, and echo the json back using the _bodyParser_ middleware which will parse json request bodies (as well as others), and place the result in _req.body_:

    var express = require('express')
      , app = express.createServer();

    app.use(express.bodyParser());

    app.post('/', function(req, res){
      res.send(req.body);
    });

    app.listen(3000);

Typically we may use a "dumb" placeholder such as "/user/:id" which has no restrictions, however say for example we are limiting a user id to digits, we may use _'/user/:id([0-9]+)'_ which will _not_ match unless the placeholder value contains only digits.

### Passing Route Control

We may pass control to the next _matching_ route, by calling the _third_ argument,
the _next()_ function. When a match cannot be made, control is passed back to Connect,
and middleware continue to be invoked in the order that they are added via _use()_. The same is true for several routes which have the same path defined, they will simply be executed in order until one does _not_ call _next()_ and decides to respond.

	app.get('/users/:id?', function(req, res, next){
		var id = req.params.id;
		if (id) {
			// do something
		} else {
			next();
		}
	});
	
	app.get('/users', function(req, res){
		// do something else
	});

The _app.all()_ method is useful for applying the same logic for all HTTP verbs in a single call. Below we use this to load a user from our fake database, and assign it to _req.user_.

    var express = require('express')
      , app = express.createServer();

    var users = [{ name: 'tj' }];

    app.all('/user/:id/:op?', function(req, res, next){
      req.user = users[req.params.id];
      if (req.user) {
        next();
      } else {
        next(new Error('cannot find user ' + req.params.id));
      }
    });

    app.get('/user/:id', function(req, res){
      res.send('viewing ' + req.user.name);
    });

    app.get('/user/:id/edit', function(req, res){
      res.send('editing ' + req.user.name);
    });

    app.put('/user/:id', function(req, res){
      res.send('updating ' + req.user.name);
    });

    app.get('*', function(req, res){
      res.send(404, 'what???');
    });

    app.listen(3000); 

### Middleware

Middleware via [Connect](http://github.com/senchalabs/connect) can be
passed to _express.createServer()_ as you would with a regular Connect server. For example:

	  var express = require('express');

    var app = express.createServer(
	  	  express.logger()
	  	, express.bodyParser()
	  );

Alternatively we can _use()_ them which is useful when adding middleware within _configure()_ blocks, in a progressive manner.

    app.use(express.logger({ format: ':method :url' }));

Typically with connect middleware you would _require('connect')_ like so:

    var connect = require('connect');
    app.use(connect.logger());
    app.use(connect.bodyParser());

This is somewhat annoying, so express re-exports these middleware properties, however they are _identical_:

    app.use(express.logger());
    app.use(express.bodyParser());

Middleware ordering is important, when Connect receives a request the _first_ middleware we pass to _createServer()_ or _use()_ is executed with three parameters, _request_, _response_, and a callback function usually named _next_. When _next()_ is invoked the second middleware will then have it's turn and so on. This is important to note because many middleware depend on each other, for example _methodOverride()_ checks _req.body._method_ for the HTTP method override, however _bodyParser()_ parses the request body and populates _req.body_. Another example of this is cookie parsing and session support, we must first _use()_ _cookieParser()_ followed by _session()_.

Many Express applications may contain the line _app.use(app.router)_, while this may appear strange, it's simply the middleware function that contains all defined routes, and performs route lookup based on the current request url and HTTP method. Express allows you to position this middleware, though by default it will be added to the bottom. By positioning the router, we can alter middleware precedence, for example we may want to add error reporting as the _last_ middleware so that any exception passed to _next()_ will be handled by it, or perhaps we want static file serving to have low precedence, allowing our routes to intercept requests to a static file to count downloads etc. This may look a little like below

    app.use(express.logger(...));
    app.use(express.bodyParser(...));
    app.use(express.cookieParser(...));
    app.use(express.session(...));
    app.use(app.router);
    app.use(express.static(...));
    app.use(express.errorHandler(...));

First we add _logger()_ so that it may wrap node's _req.end()_ method, providing us with response-time data. Next the request's body will be parsed (if any), followed by cookie parsing and session support, meaning _req.session_ will be defined by the time we hit our routes in _app.router_. If a request such as _GET /javascripts/jquery.js_ is handled by our routes, and we do not call _next()_ then the _static()_ middleware will never see this request, however if were to define a route as shown below, we can record stats, refuse downloads, consume download credits etc.

    var downloads = {};

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.get('/*', function(req, res, next){
      var file = req.params[0];
      downloads[file] = downloads[file] || 0;
      downloads[file]++;
      next();
    });


### Route Middleware

Routes may utilize route-specific middleware by passing one or more additional callbacks (or arrays) to the method. This feature is extremely useful for restricting access, loading data used by the route etc.

Typically async data retrieval might look similar to below, where we take the _:id_ parameter, and attempt loading a user. 

    app.get('/user/:id', function(req, res, next){
      loadUser(req.params.id, function(err, user){
        if (err) return next(err);
        res.send('Viewing user ' + user.name);
      });
    });

To keep things DRY and to increase readability we can apply this logic within a middleware. As you can see below, abstracting this logic into middleware allows us to reuse it, and clean up our route at the same time. 

    function loadUser(req, res, next) {
      // You would fetch your user from the db
      var user = users[req.params.id];
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error('Failed to load user ' + req.params.id));
      }
    }
   
    app.get('/user/:id', loadUser, function(req, res){
      res.send('Viewing user ' + req.user.name);
    });

Multiple route middleware can be applied, and will be executed sequentially to apply further logic such as restricting access to a user account. In the example below only the authenticated user may edit his/her account.

    function andRestrictToSelf(req, res, next) {
      req.authenticatedUser.id == req.user.id
        ? next()
        : next(new Error('Unauthorized'));
    }
    
    app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
      res.send('Editing user ' + req.user.name);
    });

Keeping in mind that middleware are simply functions, we can define function that _returns_ the middleware in order to create a more expressive and flexible solution as shown below.

    function andRestrictTo(role) {
      return function(req, res, next) {
        req.authenticatedUser.role == role
          ? next()
          : next(new Error('Unauthorized'));
      }
    }
    
    app.del('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
      res.send('Deleted user ' + req.user.name);
    });

Commonly used "stacks" of middleware can be passed as an array (_applied recursively_), which can be mixed and matched to any degree.

    var a = [middleware1, middleware2]
      , b = [middleware3, middleware4]
      , all = [a, b];
    
    app.get('/foo', a, function(){});
    app.get('/bar', a, function(){});
    
    app.get('/', a, middleware3, middleware4, function(){});
    app.get('/', a, b, function(){});
    app.get('/', all, function(){});

For this example in full, view the [route middleware example](http://github.com/visionmedia/express/blob/master/examples/route-middleware/app.js) in the repository.

There are times when we may want to "skip" passed remaining route middleware, but continue matching subsequent routes. To do this we invoke `next()` with the string "route" `next('route')`. If no remaining routes match the request url then Express will respond with 404 Not Found.

### HTTP Methods

We have seen _app.get()_ a few times, however Express also exposes other familiar HTTP verbs in the same manner, such as _app.post()_, _app.del()_, etc.

 A common example for _POST_ usage, is when "submitting" a form. Below we simply set our form method to "post" in our html, and control will be given to the route we have defined below it.
 
     <form method="post" action="/">
         <input type="text" name="user[name]" />
         <input type="text" name="user[email]" />
         <input type="submit" value="Submit" />
     </form>

By default Express does not know what to do with this request body, so we should add the _bodyParser_ middleware, which will parse _application/x-www-form-urlencoded_ and _application/json_ request bodies and place the variables in _req.body_. We can do this by "using" the middleware as shown below:

    app.use(express.bodyParser());

Our route below will now have access to the _req.body.user_ object which will contain the _name_ and _email_ properties when defined.

    app.post('/', function(req, res){
      console.log(req.body.user);
      res.redirect('back');
    });

When using methods such as _PUT_ with a form, we can utilize a hidden input named _\_method_, which can be used to alter the HTTP method. To do so we first need the _methodOverride_ middleware, which should be placed below _bodyParser_ so that it can utilize it's _req.body_ containing the form values.

    app.use(express.bodyParser());
    app.use(express.methodOverride());

The reason that these are not always defaults, is simply because these are not required for Express to be fully functional. Depending on the needs of your application, you may not need these at all, your methods such as _PUT_ and _DELETE_ can still be accessed by clients which can use them directly, although _methodOverride_ provides a great solution for forms. Below shows what the usage of _PUT_ might look like:

    <form method="post" action="/">
      <input type="hidden" name="_method" value="put" />
      <input type="text" name="user[name]" />
      <input type="text" name="user[email]" />
      <input type="submit" value="Submit" />    
    </form>

    app.put('/', function(){
        console.log(req.body.user);
        res.redirect('back');
    });

### Error Handling

 Error handling middleware are simply middleware with an arity of 4, aka
 the signature _(err, req, res, next)_. When you _next(err)_ an error,
 only these middleware are executed and have a chance to respond. For example:
 
    app.use(app.bodyParser());
    app.use(app.methodOverride());
    app.use(app.router);
    app.use(function(err, req, res, next){
      res.send(500, 'Server error');
    });

### Route Param Pre-conditions

Route param pre-conditions can drastically improve the readability of your application, through implicit loading of data, and validation of request urls. For example if you are constantly fetching common data for several routes, such as loading a user for _/user/:id_, we might typically do something like below:

    app.get('/user/:userId', function(req, res, next){
      User.get(req.params.userId, function(err, user){
        if (err) return next(err);
        res.send('user ' + user.name);
      });
    }); 

With preconditions our params can be mapped to callbacks which may perform validation, coercion, or even loading data from a database. Below we invoke _app.param()_ with the parameter name we wish to map to some middleware, as you can see we receive the _id_ argument which contains the placeholder value. Using this we load the user and perform error handling as usual, and simple call _next()_ to pass control to the next precondition or route handler.

    app.param('userId', function(req, res, next, id){
      User.get(id, function(err, user){
        if (err) return next(err);
        if (!user) return next(new Error('failed to find user'));
        req.user = user;
        next();
      });
    });

Doing so, as mentioned drastically improves our route readability, and allows us to easily share this logic throughout our application:

    app.get('/user/:userId', function(req, res){
      res.send('user ' + req.user.name);
    });

### View Rendering

View filenames take the form "&lt;name&gt;.&lt;engine&gt;", where &lt;engine&gt; is the name
of the module that will be required. For example the view _layout.ejs_ will
tell the view system to _require('ejs')_, the module being loaded must export the method _exports.compile(str, options)_, and return a _Function_ to comply with Express. To alter this behaviour
_app.register()_ can be used to map engines to file extensions, so that for example "foo.html" can be rendered by ejs.

Below is an example using [Jade](http://github.com/visionmedia/jade) to render _index.html_,
and since we do not use _layout: false_ the rendered contents of _index.jade_ will be passed as 
the _body_ local variable in _layout.jade_.

	app.get('/', function(req, res){
		res.render('index.jade', { title: 'My Site' });
	});

The new _view engine_ setting allows us to specify our default template engine,
so for example when using jade we could set:

    app.set('view engine', 'jade');

Allowing us to render with:

    res.render('index');

vs:

    res.render('index.jade');

When _view engine_ is set, extensions are entirely optional, however we can still
mix and match template engines:

    res.render('another-page.ejs');

 To apply application-level locals, or view engine options may be set using _app.local()_ or _app.locals()_, for example if we don't want layouts for most of our templates we may do:

   app.local('layout', false);

Which can then be overridden within the _res.render()_ call if desired, and is otherwise functionally equivalent to passing directly to `res.render()`:

    res.render('myview.ejs', { layout: true });

When an alternate layout is required, we may also specify a path. For example if we have _view engine_ set to _jade_ and a file named _./views/mylayout.jade_ we can simply pass:

    res.render('page', { layout: 'mylayout' });

Otherwise we must specify the extension:

    res.render('page', { layout: 'mylayout.jade' });

These paths may also be absolute:

    res.render('page', { layout: __dirname + '/../../mylayout.jade' });

### View Partials

The Express view system has built-in support for partials and collections, which are "mini" views representing a document fragment. For example rather than iterating
in a view to display comments, we could use partial collection:

    partial('comment', { collection: comments });

If no other options or local variables are desired, we can omit the object and simply pass our array, which is equivalent to above:

    partial('comment', comments);

When using the partial collection support a few "magic" locals are provided
for free:

  * _firstInCollection_  true if this is the first object
  * _indexInCollection_  index of the object in the collection
  * _lastInCollection_  true if this is the last object
  * _collectionLength_  length of the collection

Local variables passed (or generated) take precedence, however locals passed to the parent view are available in the child view as well. So for example if we were to render a blog post with _partial('blog/post', post)_ it would generate the _post_ local, but the view calling this function had the local _user_, it would be available to the _blog/post_ view as well.

For documentation on altering the object name view [res.partial()](http://expressjs.com/guide.html#res-partial-view-options-).

__NOTE:__ be careful about when you use partial collections, as rendering an array with a length of 100 means we have to render 100 views. For simple collections you may inline the iteration instead of using partial collection support to decrease overhead.

### View Lookup

View lookup is performed relative to the parent view, for example if we had a page view named _views/user/list.jade_, and within that view we did _partial('edit')_ it would attempt to load _views/user/edit.jade_, whereas _partial('../messages')_ would load _views/messages.jade_.

The view system also allows for index templates, allowing you to have a directory of the same name. For example within a route we may have _res.render('users')_ either _views/users.jade_, or _views/users/index.jade_.

When utilizing index views as shown above, we may reference _views/users/index.jade_ from a view in the same directory by _partial('users')_, and the view system will try _../users/index_, preventing us from needing to call _partial('index')_.

### Template Engines

Below are a few template engines commonly used with Express:

  * [Haml](http://github.com/visionmedia/haml.js) haml implementation
  * [Jade](http://jade-lang.com) haml.js successor
  * [EJS](http://github.com/visionmedia/ejs) Embedded JavaScript
  * [CoffeeKup](http://github.com/mauricemach/coffeekup) CoffeeScript based templating
  * [jQuery Templates](https://github.com/kof/node-jqtpl) for node

### Session Support

Sessions support can be added by using Connect's _session_ middleware. To do so we also need the _cookieParser_ middleware place above it, which will parse and populate cookie data to _req.cookies_.

    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));

By default the _session_ middleware uses the memory store bundled with Connect, however many implementations exist. For example [connect-redis](http://github.com/visionmedia/connect-redis) supplies a [Redis](http://code.google.com/p/redis/) session store and can be used as shown below:

    var RedisStore = require('connect-redis')(express);
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));

Now the _req.session_ and _req.sessionStore_ properties will be accessible to all routes and subsequent middleware. Properties on _req.session_ are automatically saved on a response, so for example if we wish to shopping cart data:

    var RedisStore = require('connect-redis')(express);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));

    app.post('/add-to-cart', function(req, res){
      // Perhaps we posted several items with a form
      // (use the bodyParser() middleware for this)
      var items = req.body.items;
      req.session.items = items;
      res.redirect('back');
    });

    app.get('/add-to-cart', function(req, res){
      // When redirected back to GET /add-to-cart
      // we could check req.session.items && req.session.items.length
      // to print out a message
      if (req.session.items && req.session.items.length) {
        req.notify('info', 'You have %s items in your cart', req.session.items.length);
      }
      res.render('shopping-cart');
    });

The _req.session_ object also has methods such as _Session#touch()_, _Session#destroy()_, _Session#regenerate()_ among others to maintain and manipulate sessions. For more information view the [Connect Session](http://senchalabs.github.com/connect/middleware-session.html) documentation.

### Migration Guide

 Express 1.x developers may reference the [Migration Guide](migrate.html) to get up to speed on how to upgrade your application to work with Express 2.x, Connect 1.x, and Node 0.4.x.

### req.header(key[, defaultValue])

Get the case-insensitive request header _key_, with optional _defaultValue_:

    req.header('Host');
    req.header('host');
    req.header('Accept', '*/*');

The _Referrer_ and _Referer_ header fields are special-cased, either will work:

    // sent Referrer: http://google.com

    req.header('Referer');
    // => "http://google.com"

    req.header('Referrer');
    // => "http://google.com"

### req.accepts(type)

Check if the _Accept_ header is present, and includes the given _type_.

When the _Accept_ header is not present _true_ is returned. Otherwise
the given _type_ is matched by an exact match, and then subtypes. You
may pass the subtype such as "html" which is then converted internally
to "text/html" using the mime lookup table.

    // Accept: text/html
    req.accepts('html');
    // => true

    // Accept: text/*; application/json
    req.accepts('html');
    req.accepts('text/html');
    req.accepts('text/plain');
    req.accepts('application/json');
    // => true

    req.accepts('image/png');
    req.accepts('png');
    // => false

### req.is(type)

Check if the incoming request contains the _Content-Type_
header field, and it contains the give mime _type_.
 
       // With Content-Type: text/html; charset=utf-8
       req.is('html');
       req.is('text/html');
       // => true
       
       // When Content-Type is application/json
       req.is('json');
       req.is('application/json');
       // => true
       
       req.is('html');
       // => false
  
Ad-hoc callbacks can also be registered with Express, to perform
assertions again the request, for example if we need an expressive
way to check if our incoming request is an image, we can register _"an image"_
callback:
  
        app.is('an image', function(req){
          return 0 == req.headers['content-type'].indexOf('image');
        });
  
Now within our route callbacks, we can use to to assert content types
such as _"image/jpeg"_, _"image/png"_, etc.
  
       app.post('/image/upload', function(req, res, next){
         if (req.is('an image')) {
           // do something
         } else {
           next();
         }
       });

Keep in mind this method is _not_ limited to checking _Content-Type_, you
can perform any request assertion you wish.

Wildcard matches can also be made, simplifying our example above for _"an image"_, by asserting the _subtype_ only:

    req.is('image/*');

We may also assert the _type_ as shown below, which would return true for _"application/json"_, and _"text/json"_.

    req.is('*/json');

### req.param(name[, default])

Return the value of param _name_ when present or _default_.

  - Checks route params (_req.params_), ex: /user/:id
  - Checks query string params (_req.query_), ex: ?id=12
  - Checks urlencoded body params (_req.body_), ex: id=12

To utilize urlencoded request bodies, _req.body_
should be an object. This can be done by using
the _express.bodyParser middleware.

### req.get(field, param)

 Get _field_'s _param_ value, defaulting to '' when the _param_
 or _field_ is not present.

     req.get('content-disposition', 'filename');
     // => "something.png"

     req.get('Content-Type', 'boundary');
     // => "--foo-bar-baz"

### req.notify(type[, msg])

Queue flash _msg_ of the given _type_.

    req.notify('info', 'email sent');
    req.notify('error', 'email delivery failed');
    req.notify('info', 'email re-sent');
    // => 2

    req.notify('info');
    // => ['email sent', 'email re-sent']

    req.notify('info');
    // => []

    req.notify();
    // => { error: ['email delivery failed'], info: [] }

Flash notification message may also utilize formatters, by default only the %s string and %d integer formatters is available:

    req.notify('info', 'email delivery to <em>%s</em> from <em>%s</em> failed.', toUser, fromUser);

Argument HTML is escaped, to prevent XSS, however HTML notification format is valid.

### req.isXMLHttpRequest

Also aliased as _req.xhr_, this getter checks the _X-Requested-With_ header
to see if it was issued by an _XMLHttpRequest_:

    req.xhr
    req.isXMLHttpRequest

### res.header(key[, val])

Get or set the response header _key_.

    res.header('Content-Length');
    // => undefined

    res.header('Content-Length', 123);
    // => 123
    
    res.header('Content-Length');
    // => 123

### res.charset

Sets the charset for subsequent `Content-Type` header fields. For example `res.send()` and `res.render()` default to "utf8", so we may explicitly set the charset before rendering a template:

    res.charset = 'ISO-8859-1';
    res.render('users');

or before responding with `res.send()`:

    res.charset = 'ISO-8859-1';
    res.send(str);

or with node's `res.end()`:

    res.charset = 'ISO-8859-1';
    res.header('Content-Type', 'text/plain');
    res.end(str);

### res.contentType(type)

Sets the _Content-Type_ response header to the given _type_.

      var filename = 'path/to/image.png';
      res.contentType(filename);
      // Content-Type is now "image/png"

A literal _Content-Type_ works as well:

      res.contentType('application/json');

Or simply the extension without leading `.`:

      res.contentType('json');

### res.attachment([filename])

Sets the _Content-Disposition_ response header to "attachment", with optional _filename_.

      res.attachment('path/to/my/image.png');

### res.status(code)

  Sets the `res.statusCode` property to `code` and returns for chaining:

     res.status(500).send('Something bad happened');

  is equivalent to:
  
     res.statusCode = 500;
     res.send('Something bad happened');

  and:

      res.send(500, 'Something bad happened');

### res.sendfile(path[, options[, callback]])

Used by `res.download()` to transfer an arbitrary file. 

    res.sendfile('path/to/my.file');

This method accepts an optional callback which is called when
an error occurs, or when the transfer is complete. By default failures call `next(err)`, however when a callback is supplied you must do this explicitly, or act on the error.

    res.sendfile(path, function(err){
      if (err) {
        next(err);
      } else {
        console.log('transferred %s', path);
      }
    });

Options may also be passed to the internal _fs.createReadStream()_ call, for example altering the _bufferSize_:

    res.sendfile(path, { bufferSize: 1024 }, function(err){
      // handle
    });

### res.download(file[, filename[, callback[, callback2]]])

Transfer the given _file_ as an attachment with optional alternative _filename_.

    res.download('path/to/image.png');
    res.download('path/to/image.png', 'foo.png');

This is equivalent to:

    res.attachment(file);
    res.sendfile(file);

An optional callback may be supplied as either the second or third argument, which is passed to _res.sendfile()_. Within this callback you may still respond, as the header has not been sent.

    res.download(path, 'expenses.doc', function(err){
      // handle
    });

An optional second callback, _callback2_ may be given to allow you to act on connection related errors, however you should not attempt to respond.

    res.download(path, function(err){
      // error or finished
    }, function(err){
      // connection related error
    });

### res.send(body|status[, body])

The _res.send()_ method is a high level response utility allowing you to pass
objects to respond with json, strings for html, Buffer instances, or numbers representing the status code. The following are all valid uses:

     res.send(new Buffer('wahoo'));
     res.send({ some: 'json' });
     res.send(201, { message: 'User created' });
     res.send('<p>some html</p>');
     res.send(404, 'Sorry, cant find that');
     res.send(404); // "Not Found"
     res.send(500); // "Internal Server Error"

The _Content-Type_ response header is defaulted appropriately unless previously defined via `res.header()` / `res.contentType()` etc.

Note that this method _end()_s the response, so you will want to use node's _res.write()_ for multiple writes or streaming.

### res.json(obj|status[, obj])

 Send an explicit JSON response. This method is ideal for JSON-only APIs, while it is much like _res.send(obj)_, send is not ideal for cases when you want to send for example a single string as JSON, since the default for _res.send(string)_ is text/html.

    res.json(null);
    res.json({ user: 'tj' });
    res.json(500, 'oh noes!');
    res.json(404, 'I dont have that');

### res.redirect(url[, status])

Redirect to the given _url_ with a default response _status_ of 302.

    res.redirect('/', 301);
    res.redirect('/account');
    res.redirect('http://google.com');
    res.redirect('home');
    res.redirect('back');

Express supports "redirect mapping", which by default provides _home_, and _back_.
The _back_ map checks the _Referrer_ and _Referer_ headers, while _home_ utilizes
the "home" setting and defaults to "/".

### res.cookie(name, val[, options])

Sets the given cookie _name_ to _val_, with options _httpOnly_, _secure_, _expires_ etc. The _path_ option defaults to the app's "home" setting, which
is typically "/".

    // "Remember me" for 15 minutes 
    res.cookie('rememberme', 'yes', { expires: new Date(Date.now() + 900000), httpOnly: true });

The _maxAge_ property may be used to set _expires_ relative to _Date.now()_ in milliseconds, so our example above can now become:

    res.cookie('rememberme', 'yes', { maxAge: 900000 });

To parse incoming _Cookie_ headers, use the _cookieParser_ middleware, which provides the _req.cookies_ object:

    app.use(express.cookieParser());
    
    app.get('/', function(req, res){
      // use req.cookies.rememberme
    });

### res.clearCookie(name[, options])

Clear cookie _name_ by setting "expires" far in the past. Much like
_res.cookie()_ the _path_ option also defaults to the "home" setting.

    res.clearCookie('rememberme');

### res.render(view[, options[, fn]])

Render _view_ with the given _options_ and optional callback _fn_.
When a callback function is given a response will _not_ be made
automatically, however otherwise a response of _200_ and _text/html_ is given.

The _options_ passed are the local variables as well, for example if we want to expose "user" to the view, and prevent a local we do so within the same object:

    var user = { name: 'tj' };
    res.render('index', { layout: false, user: user });

This _options_ object is also considered an "options" object. For example 
when you pass the _status_ local, it's not only available to the view, it
sets the response status to this number. This is also useful if a template
engine accepts specific options, such as _debug_, or _compress_. Below
is an example of how one might render an error page, passing the _status_ for
display, as well as it setting _res.statusCode_.

     res.render('error', { status: 500, message: 'Internal Server Error' });

### res.partial(view[, options])

Render _view_ partial with the given _options_. This method is always available
to the view as a local variable.

- _object_ the object named by _as_ or derived from the view name
- _as_ Variable name for each _collection_ or _object_ value, defaults to the view name.
  * as: 'something' will add the _something_ local variable
  * as: this will use the collection value as the template context
  * as: global will merge the collection value's properties with _locals_

- _collection_ Array of objects, the name is derived from the view name itself. 
  For example _video.html_ will have a object _video_ available to it.

The following are equivalent, and the name of collection value when passed
to the partial will be _movie_ as derived from the name.

    partial('theatre/movie.jade', { collection: movies });
    partial('theatre/movie.jade', movies);
    partial('movie.jade', { collection: movies });
    partial('movie.jade', movies);
    partial('movie', movies);
    // In view: movie.director

To change the local from _movie_ to _video_ we can use the "as" option:

	partial('movie', { collection: movies, as: 'video' });
	// In view: video.director

Also we can make our movie the value of _this_ within our view so that instead
of _movie.director_ we could use _this.director_.

    partial('movie', { collection: movies, as: this });
    // In view: this.director

Another alternative is to "expand" the properties of the collection item into
pseudo globals (local variables) by using _as: global_, which again is syntactic sugar:

    partial('movie', { collection: movies, as: global });
    // In view: director

This same logic applies to a single partial object usage:

    partial('movie', { object: movie, as: this });
    // In view: this.director

    partial('movie', { object: movie, as: global });
    // In view: director

    partial('movie', { object: movie, as: 'video' });
    // In view: video.director

    partial('movie', { object: movie });
    // In view: movie.director

When a non-collection (does _not_ have _.length_) is passed as the second argument, it is assumed to be the _object_, after which the object's local variable name is derived from the view name:

    var movie = new Movie('Nightmare Before Christmas', 'Tim Burton')
    partial('movie', movie)
    // => In view: movie.director

The exception of this, is when a "plain" object, aka "{}" or "new Object" is passed, which is considered an object with local variable. For example some may expect a "movie" local with the following, however since it is a plain object "director" and "title" are simply locals:

    var movie = { title: 'Nightmare Before Christmas', director: 'Tim Burton' }; 
    partial('movie', movie)

For cases like this where passing a plain object is desired, simply assign it to a key, or use the `object` key which will use the filename-derived variable name. The examples below are equivalent:

     partial('movie', { locals: { movie: movie }})
     partial('movie', { movie: movie })
     partial('movie', { object: movie })

This exact API can be utilized from within a route, to respond with a fragment via Ajax or WebSockets, for example we can render a collection of users directly from a route:

    app.get('/users', function(req, res){
      if (req.xhr) {
        // respond with the each user in the collection
        // passed to the "user" view
        res.partial('user', users);
      } else {
        // respond with layout, and users page
        // which internally does partial('user', users)
        // along with other UI
        res.render('users', { users: users });
      }
    });

### res.local(name[, val])

Get or set the given local variable _name_. The locals built up for a response are applied to those given to the view rendering methods such as `res.render()`.

      app.all('/movie/:id', function(req, res, next){
        Movie.get(req.params.id, function(err, movie){
          // Assigns res.locals.movie = movie
          res.local('movie', movie);
        });
      });
      
      app.get('/movie/:id', function(req, res){
        // movie is already a local, however we
        // can pass more if we wish
        res.render('movie', { displayReviews: true });
      });

### res.locals(obj)

 Assign several locals with the given _obj_. The following are equivalent:
 
     res.local('foo', bar);
     res.local('bar', baz);

     res.locals({ foo: bar, bar, baz });

### app.set(name[, val])

Apply an application level setting _name_ to _val_, or
get the value of _name_ when _val_ is not present:

    app.set('views', __dirname + '/views');
    app.set('views');
    // => ...path...

Alternatively you may simply access the settings via _app.settings_:

    app.settings.views
    // => ...path...

### app.enable(name)

Enable the given setting _name_:

    app.enable('some arbitrary setting');
    app.set('some arbitrary setting');
    // => true

    app.enabled('some arbitrary setting');
    // => true

### app.enabled(name)

Check if setting _name_ is enabled:

    app.enabled('view cache');
    // => false

    app.enable('view cache');
    app.enabled('view cache');
    // => true

### app.disable(name)

Disable the given setting _name_:

    app.disable('some setting');
    app.set('some setting');
    // => false
    
    app.disabled('some setting');
    // => false

### app.disabled(name)

Check if setting _name_ is disabled:

    app.enable('view cache');

    app.disabled('view cache');
    // => false

    app.disable('view cache');
    app.disabled('view cache');
    // => true

### app.configure(env|function[, function])

Define a callback function for the given _env_ (or all environments) with callback _function_:

    app.configure(function(){
	    // executed for each env
    });

    app.configure('development', function(){
	    // executed for 'development' only
    });

### app.redirect(name, val)

For use with _res.redirect()_ we can map redirects at the application level as shown below:

    app.redirect('google', 'http://google.com');

Now in a route we may call:

   res.redirect('google');

We may also map dynamic redirects:

    app.redirect('comments', function(req, res){
      return '/post/' + req.params.id + '/comments';
    });

So now we may do the following, and the redirect will dynamically adjust to
the context of the request. If we called this route with _GET /post/12_ our
redirect _Location_ would be _/post/12/comments_.

    app.get('/post/:id', function(req, res){
      res.redirect('comments');
    });

When mounted, _res.redirect()_ will respect the mount-point. For example if a blog app is mounted at _/blog_, the following will redirect to _/blog/posts_:

    res.redirect('/posts');

### app.locals(obj)

Registers static view locals.

    app.locals({
        name: function(first, last){ return first + ', ' + last }
      , firstName: 'tj'
      , lastName: 'holowaychuk'
    });

Our view could now utilize the _firstName_ and _lastName_ variables,
as well as the _name()_ function exposed.

    <%= name(firstName, lastName) %>

Express also provides a few locals by default:

    - `settings`  the app's settings object
    - `layout(path)`  specify the layout from within a view

### app.dynamicLocals(obj)

Registers dynamic view locals. Dynamic locals
are simply functions which accept _req_, _res_, and are
evaluated against the _Server_ instance before a view is rendered, and are unique to that specific request. The _return value_ of this function
becomes the local variable it is associated with.

    app.dynamicLocals({
      session: function(req, res){
        return req.session;
      }
    });

All views would now have _session_ available so that session data can be accessed via _session.name_ etc:

    <%= session.name %>

### app.lookup

 The _app.lookup_ http methods returns an array of callback functions
 associated with the given _path_.

 Suppose we define the following routes:
 
      app.get('/user/:id', function(){});
      app.put('/user/:id', function(){});
      app.get('/user/:id/:op?', function(){});

  We can utilize this lookup functionality to check which routes
  have been defined, which can be extremely useful for higher level
  frameworks built on Express.

      app.lookup.get('/user/:id');
      // => [Function]

      app.lookup.get('/user/:id/:op?');
      // => [Function]

      app.lookup.put('/user/:id');
      // => [Function]

      app.lookup.all('/user/:id');
      // => [Function, Function]

      app.lookup.all('/hey');
      // => []

  To alias _app.lookup.VERB()_, we can simply invoke _app.VERB()_
  without a callback, as a shortcut, for example the following are
  equivalent:
  
      app.lookup.get('/user');
      app.get('/user');

  Each function returned has the following properties:
  
      var fn = app.get('/user/:id/:op?')[0];

      fn.regexp
      // => /^\/user\/(?:([^\/]+?))(?:\/([^\/]+?))?\/?$/i

      fn.keys
      // => ['id', 'op']

      fn.path
      // => '/user/:id/:op?'

      fn.method
      // => 'GET'

### app.match

  The _app.match_ http methods return an array of callback functions
  which match the given _url_, which may include a query string etc. This
  is useful when you want reflect on which routes have the opportunity to
  respond.

  Suppose we define the following routes:

        app.get('/user/:id', function(){});
        app.put('/user/:id', function(){});
        app.get('/user/:id/:op?', function(){});

  Our match against __GET__ will return two functions, since the _:op_
  in our second route is optional.

      app.match.get('/user/1');
      // => [Function, Function]

  This second call returns only the callback for _/user/:id/:op?_.

      app.match.get('/user/23/edit');
      // => [Function]

  We can also use _all()_ to disregard the http method:

      app.match.all('/user/20');
      // => [Function, Function, Function]

  Each function matched has the following properties:
  
      var fn = app.match.get('/user/23/edit')[0];

      fn.keys
      // => ['id', 'op']

      fn.params
      // => { id: '23', op: 'edit' }

      fn.method
      // => 'GET'

### app.mounted(fn)

Assign a callback _fn_ which is called when this _Server_ is passed to _Server#use()_.

    var app = express.createServer(),
        blog = express.createServer();
    
    blog.mounted(function(parent){
      // parent is app
      // "this" is blog
    });
    
    app.use(blog);

### app.register(ext, exports)

Register the given template engine _exports_
as _ext_. For example we may wish to map ".html"
files to jade:

     app.register('.html', require('jade'));

This is also useful for libraries that may not
match extensions correctly. For example my haml.js
library is installed from npm as "hamljs" so instead
of layout.hamljs, we can register the engine as ".haml":

     app.register('.haml', require('haml-js'));

For engines that do not comply with the Express
specification, we can also wrap their api this way. Below
we map _.md_ to render markdown files, rendering the html once
since it will not change on subsequent calls, and support local substitution
in the form of "{name}".

      app.register('.md', {
        compile: function(str, options){
          var html = md.toHTML(str);
          return function(locals){
            return html.replace(/\{([^}]+)\}/g, function(_, name){
              return locals[name];
            });
          };
        }
      });

### app.listen([port[, host]])

Bind the app server to the given _port_, which defaults to 3000. When _host_ is omitted all
connections will be accepted via _INADDR_ANY_.

    app.listen();
    app.listen(3000);
    app.listen(3000, 'n.n.n.n');

The _port_ argument may also be a string representing the path to a unix domain socket:

    app.listen('/tmp/express.sock');

Then try it out:

    $ telnet /tmp/express.sock
    GET / HTTP/1.1

    HTTP/1.1 200 OK
    Content-Type: text/plain
    Content-Length: 11
    
	Hello World