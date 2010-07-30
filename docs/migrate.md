
### Built On Connect

Express 1.x is written to run on-top of the [Connect](http://extjs.github.com/Connect) middlware
framework, thus the _Plugin_ has been replaced by Connect's middleware. By abstracting our middleware
to Connect we allow additional community frameworks to develop robust, high-level frameworks using
the same technologies as Express.

### Creating Applications

Previously due to legacy code implemented in the early days of node,
Express unfortunately had some globals. The DSL would previously be
accessed as shown below:

    require('express');

    configure(function(){
	    // app configuration
    });

    get('/', function(){
	    return 'hello world';
    });

Now we utilize the CommonJS module system appropriately, and
introduce _express.createServer()_ which accepts the same arguments
as _http.createServer()_:

    var express = require('express'),
		app = express.createServer();
	
	app.configure(function(){
		// app configuration
	});
	
	app.get('/', function(req, res){
		res.send('hello world');
	});

Express 1.x does _not_ currently allow returning of a string.

### Plugins vs Middleware

Previously Express was bundled with plugins, which were essentially what
are now Connect middleware. Previously plugins would be utilized in a manor
similar to below:

    use(Logger);
    use(MethodOverride);
    use(Cookie);

Which we can now _use()_ within our app, or pass to the _express.createServer()_ method:

	var connect = require('connect');

    var app = express.createServer(
		connect.logger(),
		connect.methodOverride(),
		connect.cookieDecoder()
	);

or:

    var connect = require('connect');
	var app = express.createServer();

	app.use(connect.logger());
	app.use(connect.methodOverride());
	app.use(connect.cookieDecoder());

For documentation on creating Connect middleware visit [Middleware Authoring](http://extjs.github.com/Connect/#Middleware-Authoring).

### Running Applications

Previously a global function _run()_, was available:

    run();

The new _express.Server_ has the same API as _http.Server_,
so we can do things like:

	app.listen();
	app.listen(3000);

### Route Parameters

Previously we could use _this.param()_ to attempt
fetching a route, query string, or request body parameter:

    get('/user/:id', function(){
		this.param('id');
    });

Polymorphic parameter access can be done using `req.param()`:

    app.get('/user/:id', function(req, res){
		req.param('id');
	});

Route parameters are available via `req.params`:

    app.get('/user/:id', function(req, res){
		req.params.id;
    });

### Passing Route Control

Old express had a weak notion of route passing,
which did not support async, and was never properly 
implemented for practical use:

    get('/', function(){
	    this.pass('/foobar');
    });

Now Express has access to Connect's _next()_ function,
which is passed as the third and final argument. Calling _next()_ will
pass control to the next _matching route_, or continue down the stack
of Connect middleware.

    app.get('/user/:id?', function(req, res, next){
	    next();
    });

	app.get('/user', function(){
		// ... respond
	});

### View Rendering

View filenames no longer take the form _NAME_._TYPE_._ENGINE_,
the _Content-Type_ can be set via _res.contentType()_ or
_res.header()_. For example what was previously _layout.html.haml_,
should now be _layout.haml_.

Previously a view render looked something like this:

    get('/', function(){
		this.render('index.html.haml', {
			locals: { title: 'My Site' }
		});
	});

We now have _res.render()_, however the options passed to [haml](http://github.com/visionmedia/haml.js), [jade](http://github.com/visionmedia/jade), and others
remain the same.

	app.get('/', function(req, res){
		res.render('index.haml', {
			locals: { title: 'My Site' }
		});
	});

Previously rendering of a collection via _partial()_ would look something like this:

	this.partial('comment.html.haml', { collection: comments });

Although this worked just fine, it was generally to verbose, the similar but new API
looks like this, as _partial()_ is _always_ passed as a local variable:

    partial('comment.haml', { collection: comments });

To make things even less verbose we can assume the extension when omitted:

    partial('comment', { collection: comments });

And once again even further, when rendering a collection we can simply pass
an array, if no other options are desired:

    partial('comments', comments);

### Redirecting

Previously you would

    this.redirect('/somewhere');

However you would now:

    res.redirect('/somewhere');
    res.redirect('/somewhere', 301);

### HTTP Client

Previously Express provided a high level http client, this library is no more
as it does not belong in Express, however it may be resurrected as a separate module.

### Core Extensions

Express is no longer dependent on the [JavaScript Extensions](http://github.com/visionmedia/ext.js) library, so those of you using the methods provided by it such as `Object.merge(a, b)` will need to
roll your own, or install the module via:

    $ npm install ext