
### Installation

curl:

    $ curl -# http://expressjs.com/install.sh | sh

npm:

    $ npm install express

git clone, first update the submodules:

    $ git submodule update --init
    $ make install
    $ make install-support

### Creating An Application

The _express.Server_ now inherits from _http.Server_, however
follows the same idiom by providing _express.createServer()_ as shown below. This means
that you can utilize Express server's transparently with other libraries.

    var app = require('express').createServer();
	
	app.get('/', function(req, res){
		res.send('hello world');
	});
	
	app.listen(3000);

### Configuration

Express supports arbitrary environments, such as _production_ and _development_. Developers
can use the _configure()_ method to setup needs required by the current environment. When
_configure()_ is called without an environment name it will be run in _every_ environment 
prior to the environment specific callback.

In the example below we only _dumpExceptions_, and respond with exception stack traces
in _development_ mode, however for both environments we utilize _methodOverride_ and _bodyDecoder_.
Note the use of _app.router_, which can (optionally) be used to mount the application routes,
otherwise the first call to _app.{get,put,del,post}()_ will mount the routes.

    app.configure(function(){
		app.use(express.methodOverride());
		app.use(express.bodyDecoder());
		app.use(app.router);
		app.use(express.staticProvider(__dirname + '/public'));
	});
	
	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	
	app.configure('production', function(){
		app.use(express.errorHandler());
	});

For internal and arbitrary settings Express provides the _set(key[, val])_, _enable(key)_, _disable(key)_ methods:

    app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('views');
		// => "... views directory ..."
		
		app.enable('some feature');
		// same as app.set('some feature', true);
		
		app.disable('some feature');
		// same as app.set('some feature', false);
	});

To alter the environment we can set the _CONNECT_ENV_ environment variable,
or more specifically _EXPRESS_ENV_, for example:

    $ EXPRESS_ENV=production node app.js

### Settings

Express supports the following settings out of the box:

  * _env_ Application environment set internally, use _app.set('env')_ on _Server#listen()_
  * _home_ Application base path used for _res.redirect()_ and transparently handling mounted apps.
  * _views_ Root views directory defaulting to **CWD/views**
  * _view engine_ Default view engine name for views rendered without extensions
  * _view options_ An object specifying global view options
  * _partials_ Root view partials directory defaulting to _views_/partials. 

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
groups with literal _RegExp_'s are anonymous we can access them directly `req.params`.

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

### Passing Route Control

We may pass control to the next _matching_ route, by calling the _third_ argument,
the _next()_ function. When a match cannot be made, control is passed back to Connect,
and middleware continue to be invoked.

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

### Middleware

The Express _Plugin_ is no more! middleware via [Connect](http://github.com/senchalabs/connect) can be
passed to _express.createServer()_ as you would with a regular Connect server. For example:

	var express = require('express');

    var app = express.createServer(
		express.logger(),
		express.bodyDecoder()
	);

Alternatively we can _use()_ them which is useful when adding middleware within _configure()_ blocks:

    app.use(express.logger({ format: ':method :uri' }));

Typically with connect middleware you would _require('connect')_ like so:

    var connect = require('connect');
    app.use(connect.logger());

This is somewhat annoying, so express re-exports these middleware properties, however they are _identical_:

    app.use(express.logger());

### Error Handling

Express provides the _app.error()_ method which receives exceptions thrown within a route,
or passed to _next(err)_. Below is an example which serves different pages based on our
ad-hoc _NotFound_ exception:

	function NotFound(msg){
	    this.name = 'NotFound';
	    Error.call(this, msg);
	    Error.captureStackTrace(this, arguments.callee);
	}

	sys.inherits(NotFound, Error);

	app.get('/404', function(req, res){
	    throw new NotFound;
	});

	app.get('/500', function(req, res){
	    throw new Error('keyboard cat!');
	});

We can call _app.error()_ several times as shown below.
Here we check for an instanceof _NotFound_ and show the
404 page, or we pass on to the next error handler.

Note that these handlers can be defined anywhere, as they
will be placed below the route handlers on _listen()_. This 
allows for definition within _configure()_ blocks so we can
handle exceptions in different ways based on the environment.

	app.error(function(err, req, res, next){
	    if (err instanceof NotFound) {
	        res.render('404.jade');
	    } else {
	        next(err);
	    }
	});

Here we assume all errors as 500 for the simplicity of
this demo, however you can choose whatever you like

	app.error(function(err, req, res){
	    res.render('500.jade', {
	       locals: {
	           error: err
	       } 
	    });
	});

Our apps could also utilize the Connect _errorHandler_ middleware
to report on exceptions. For example if we wish to output exceptions 
in "development" mode to _stderr_ we can use:

    app.use(express.errorHandler({ dumpExceptions: true }));

Also during development we may want fancy html pages to show exceptions
that are passed or thrown, so we can set _showStack_ to true:

    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));

The _errorHandler_ middleware also responds with _json_ if _Accept: application/json_
is present, which is useful for developing apps that rely heavily on client-side JavaScript.

### View Rendering

View filenames take the form _NAME_._ENGINE_, where _ENGINE_ is the name
of the module that will be required. For example the view _layout.ejs_ will
tell the view system to _require('ejs')_, the module being loaded must export the method _exports.render(str, options)_ to comply with Express, however 
_app.register()_ can be used to map engines to file extensions, so that for example "foo.html" can be rendered by jade.

Below is an example using [Haml.js](http://github.com/visionmedia/haml.js) to render _index.html_,
and since we do not use _layout: false_ the rendered contents of _index.html_ will be passed as 
the _body_ local variable in _layout.haml_.

	app.get('/', function(req, res){
		res.render('index.haml', {
			locals: { title: 'My Site' }
		});
	});

The new _view engine_ setting allows us to specify our default template engine,
so for example when using [Jade](http://github.com/visionmedia/jade) we could set:

    app.set('view engine', 'jade');

Allowing us to render with:

    res.render('index');

vs:

    res.render('index.jade');

When _view engine_ is set, extensions are entirely optional, however we can still
mix and match template engines:

    res.render('another-page.ejs');

Express also provides the _view options_ setting, which is applied each time a view is rendered, so for example if you rarely use layouts you may set:

	app.set('view options', {
	    layout: false
	});

Which can then be overridden within the `res.render()` call if need be:

    res.render('myview.ejs', { layout: true });

A good example of this is specifying custom _ejs_ opening and closing tags:

	app.set('view options', {
	    open: '{{',
	    close: '}}'
	});

### View Partials

The Express view system has built-in support for partials and collections, which are
sort of "mini" views representing a document fragment. For example rather than iterating
in a view to display comments, we would use a partial with collection support:

    partial('comment.haml', { collection: comments });

To make things even less verbose we can assume the extension as _.haml_ when omitted,
however if we wished we could use an ejs partial, within a haml view for example.

    partial('comment', { collection: comments });

And once again even further, when rendering a collection we can simply pass
an array, if no other options are desired:

    partial('comments', comments);

When using the partial collection support a few "magic" variables are provided
for free:

  * _firstInCollection_  True if this is the first object
  * _indexInCollection_  Index of the object in the collection
  * _lastInCollection_  True if this is the last object

### Template Engines

Below are a few template engines commonly used with Express:

  * [Jade](http://jade-lang.com) haml.js successor
  * [Haml](http://github.com/visionmedia/haml.js) pythonic indented templates
  * [EJS](http://github.com/visionmedia/ejs) Embedded JavaScript

### req.header(key[, defaultValue])

Get the case-insensitive request header _key_, with optional _defaultValue_:

    req.header('Host');
    req.header('host');
    req.header('Accept', '*/*');

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

### req.param(name)

Return the value of param _name_ when present.

  - Checks route placeholders (_req.params_), ex: /user/:id
  - Checks query string params (_req.query_), ex: ?id=12
  - Checks urlencoded body params (_req.body_), ex: id=12

To utilize urlencoded request bodies, _req.body_
should be an object. This can be done by using
the _express.bodyDecoder_ middleware.

### req.flash(type[, msg])

Queue flash _msg_ of the given _type_.

    req.flash('info', 'email sent');
    req.flash('error', 'email delivery failed');
    req.flash('info', 'email re-sent');
    // => 2

    req.flash('info');
    // => ['email sent', 'email re-sent']

    req.flash('info');
    // => []

    req.flash();
    // => { error: ['email delivery failed'], info: [] }

Flash notification message may also utilize formatters, by default only the %s string formatter is available:

    req.flash('info', 'email delivery to _%s_ from _%s_ failed.', toUser, fromUser);

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

### res.contentType(type)

Sets the _Content-Type_ response header to the given _type_.

      var filename = 'path/to/image.png';
      res.contentType(filename);
      // res.headers['Content-Type'] is now "image/png"

### res.attachment([filename])

Sets the _Content-Disposition_ response header to "attachment", with optional _filename_.

      res.attachment('path/to/my/image.png');

### res.sendfile(path)

Used by `res.download()` to transfer an arbitrary file. 

    res.sendfile('path/to/my.file');

This is _not_ a substitution for Connect's _staticProvider_ middleware, it does not
support HTTP caching, and does not perform any security checks. This method is utilized
by _res.download()_ to transfer static files, and allows you do to so from outside of
the public directory, so suitable security checks should be applied.

### res.download(file[, filename])

Transfer the given _file_ as an attachment with optional alternative _filename_.

    res.download('path/to/image.png');
    res.download('path/to/image.png', 'foo.png');

This is equivalent to:

    res.attachment(file);
    res.sendfile(file);

### res.send(body|status[, headers|status[, status]])

The `res.send()` method is a high level response utility allowing you to pass
objects to respond with json, strings for html, arbitrary _Buffer_s or numbers for status
code based responses. The following are all valid uses:

     res.send(new Buffer('wahoo'));
     res.send({ some: 'json' });
     res.send('<p>some html</p>');
     res.send('Sorry, cant find that', 404);
     res.send('text', { 'Content-Type': 'text/plain' }, 201);
     res.send(404);

By default the _Content-Type_ response header is set, however if explicitly
assigned through `res.send()` or previously with `res.header()` or `res.contentType()`
it will not be set again.

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

### res.render(view[, options[, fn]])

Render _view_ with the given _options_ and optional callback _fn_.
When a callback function is given a response will _not_ be made
automatically, however otherwise a response of _200_ and _text/html_ is given.

 Most engines accept one or more of the following options,
 both [haml](http://github.com/visionmedia/haml.js) and [jade](http://github.com/visionmedia/jade) accept all:

  - _context|scope_   Template evaluation context (_this_)
  - _locals_          Object containing local variables
  - _debug_           Output debugging information

### res.partial(view[, options])

Render _view_ partial with the given _options_. This method is always available
to the view as a local variable.

- _as_ Variable name for each _collection_ value, defaults to the view name.
  * as: 'something' will add the _something_ local variable
  * as: this will use the collection value as the template context
  * as: global will merge the collection value's properties with _locals_

- _collection_ Array of objects, the name is derived from the view name itself. 
  For example _video.html_ will have a object _video_ available to it.

The following are equivalent, and the name of collection value when passed
to the partial will be _movie_ as derived from the name.

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

Another alternative is to "explode" the properties of the collection item into
pseudo globals (local variables) by using _as: global_, which again is syntactic sugar:

    partials('movie', { collection: movies, as: global });
    // In view: director

### app.set(name[, val])

Apply an application level setting _name_ to _val_, or
get the value of _name_ when _val_ is not present:

    app.set('views', __dirname + '/views');
    app.set('views');
    // => ...path...

### app.enable(name)

Enable the given setting _name_:

    app.enable('some arbitrary setting');
    app.set('some arbitrary setting');
    // => true

### app.disable(name)

Disable the given setting _name_:

    app.disable('some setting');
    app.set('some setting');
    // => false

### app.configure(env|function[, function])

Define a callback function for the given _env_ (or all environments) with callback _function_:

    app.configure(function(){
	    // executed for each env
    });

    app.configure('development', function(){
	    // executed for 'development' only
    });

### app.redirect(name, val)

For use with `res.redirect()` we can map redirects at the application level as shown below:

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

### app.error(function)

Adds an error handler _function_ which will receive the exception as the first parameter as shown below.
Note that we may set several error handlers by making several calls to this method, however the handler
should call _next(err)_ if it does not wish to deal with the exception:

    app.error(function(err, req, res, next){
		res.send(err.message, 500);
	});

### app.helpers(obj)

Registers static view helpers.

    app.helpers({
		name: function(first, last){ return first + ', ' + last },
		firstName: 'tj',
		lastName: 'holowaychuk'
	});

Our view could now utilize the _firstName_ and _lastName_ variables,
as well as the _name()_ function exposed.

    <%= name(firstName, lastName) %>

### app.dynamicHelpers(obj)

Registers dynamic view helpers. Dynamic view helpers
are simply functions which accept _req_, _res_, and are
evaluated against the _Server_ instance before a view is rendered. The _return value_ of this function
becomes the local variable it is associated with.

    app.dynamicHelpers({
		session: function(req, res){
			return req.session;
		}
    });

All views would now have _session_ available so that session data can be accessed via _session.name_ etc:

    <%= session.name %>

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
specification, we can also wrap their api this way.

     app.register('.foo', {
         render: function(str, options) {
             // perhaps their api is
             // foo.toHTML(str, options);
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