<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='router.use'>router.use([path], [function, ...] function)</h3>

Uses the specified middleware function or functions, with optional mount path `path`, that defaults to "/".

This method is similar to [app.use()](#app.use). A simple example and use case is described below.
See [app.use()](#app.use) for more information.

Middleware is like a plumbing pipe: requests start at the first middleware function defined
and work their way "down" the middleware stack processing for each path they match.

{% highlight js %}
var express = require('express');
var app = express();
var router = express.Router();

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// this will only be invoked if the path starts with /bar from the mount point
router.use('/bar', function(req, res, next) {
  // ... maybe some additional /bar logging ...
  next();
});

// always invoked
router.use(function(req, res, next) {
  res.send('Hello World');
});

app.use('/foo', router);

app.listen(3000);
{% endhighlight %}

The "mount" path is stripped and is _not_ visible to the middleware function.
The main effect of this feature is that a mounted middleware function may operate without
code changes regardless of its "prefix" pathname.

The order in which you define middleware with `router.use()` is very important.
They are invoked sequentially, thus the order defines middleware precedence. For example,
usually a logger is the very first middleware you would use, so that every request gets logged.

{% highlight js %}
var logger = require('morgan');

router.use(logger());
router.use(express.static(__dirname + '/public'));
router.use(function(req, res){
  res.send('Hello');
});
{% endhighlight %}

Now suppose you wanted to ignore logging requests for static files, but to continue
logging routes and middleware defined after `logger()`.  You would simply move the call to `express.static()` to the top,
before adding the logger middleware:

{% highlight js %}
router.use(express.static(__dirname + '/public'));
router.use(logger());
router.use(function(req, res){
  res.send('Hello');
});
{% endhighlight %}

Another example is serving files from multiple directories,
giving precedence to "./public" over the others:

{% highlight js %}
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));
{% endhighlight %}

The `router.use()` method also supports named parameters so that your mount points
for other routers can benefit from preloading using named parameters.

__NOTE__: Although these middleware functions are added via a particular router, _when_
they run is defined by the path they are attached to (not the router). Therefore,
middleware added via one router may run for other routers if its routes
match. For example, this code shows two different routers mounted on the same path:

{% highlight js %}
var authRouter = express.Router();
var openRouter = express.Router();

authRouter.use(require('./authenticate').basic(usersdb));

authRouter.get('/:user_id/edit', function(req, res, next) { 
  // ... Edit user UI ...  
});
openRouter.get('/', function(req, res, next) { 
  // ... List users ... 
})
openRouter.get('/:user_id', function(req, res, next) { 
  // ... View user ... 
})

app.use('/users', authRouter);
app.use('/users', openRouter);
{% endhighlight %}

Even though the authentication middleware was added via the `authRouter` it will run on the routes defined by the `openRouter` as well since both routers were mounted on `/users`.  To avoid this behavior, use different paths for each router.
