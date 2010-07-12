
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

