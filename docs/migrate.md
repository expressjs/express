
## Migration Guide

Express 1.x is written to run on-top of the [Connect](http://extjs.github.com/Connect) middlware
framework, thus the `Plugin` has been replaced by Connect's middleware.

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
introduce `express.createServer()` which accepts the same arguments
as `http.createServer()`:

    var express = require('express'),
		app = express.createServer();
	
	app.configure(function(){
		// app configuration
	});
	
	app.get('/', function(req, res){
		res.send('hello world');
	});

Express 1.x does _not_ allow returning of a string.

### Running Applications

Previously a global function `run()`, was available:

    run();

The new `express.Server` has the same API as `http.Server`,
so we can do things like:

	app.listen();
	app.listen(3000);

### Route Parameters

Previously we could use `this.param()` to attempt
fetching a route, query string, or request body parameter:

    get('/user/:id', function(){
		this.param('id');
    });

Now they (_route params only_) are passed as the third argument:

    app.get('/user/:id', function(req, res, params){
		params.id;
    });

### Passing Route Control

Old express had a weak notion of route passing,
which did not support async, and was never properly 
implemented for practical use:

    get('/', function(){
	    this.pass('/foobar');
    });

Now Express has access to Connect's `next()` function,
which is passed as the fourth and final argument. Calling `next()` will
pass control to the next _matching route_, or continue down the stack
of Connect middleware.

    app.get('/user/:id?', function(req, res, params, next){
	    next();
    });

	app.get('/user', function(){
		// ... respond
	});

### View Rendering

View filenames no longer take the form _NAME_._TYPE_._ENGINE_,
the _Content-Type_ can be set via `ServerResponse#contentType()` or
`ServerResponse#header()`. For example what was previously _layout.html.haml_,
should now be _layout.haml_.

Previously a view render looked something like this:

    get('/', function(){
		this.render('index.html.haml', {
			locals: { title: 'My Site' }
		});
	});

We now have `ServerResponse#render()`, however the options passed to [haml](http://github.com/visionmedia/haml.js), [jade](http://github.com/visionmedia/jade), and others
remain the same.

	app.get('/', function(req, res){
		res.render('index.haml', {
			locals: { title: 'My Site' }
		});
	});