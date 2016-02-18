<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='router.METHOD'>router.METHOD(path, [callback, ...] callback)</h3>

The `router.METHOD()` methods provide the routing functionality in Express,
where METHOD is one of the HTTP methods, such as GET, PUT, POST, and so on,
in lowercase.  Thus, the actual methods are `router.get()`, `router.post()`,
`router.put()`, and so on.

You can provide multiple callbacks, and all are treated equally, and behave just
like middleware, except that these callbacks may invoke `next('route')`
to bypass the remaining route callback(s).  You can use this mechanism to perform
pre-conditions on a route then pass control to subsequent routes when there is no
reason to proceed with the route matched.

The following snippet illustrates the most simple route definition possible.
Express translates the path strings to regular expressions, used internally
to match incoming requests. Query strings are _not_ considered when performing
these matches, for example "GET /" would match the following route, as would
"GET /?name=tobi".

{% highlight js %}
router.get('/', function(req, res){
  res.send('hello world');
});
{% endhighlight %}

You can also use regular expressions&mdash;useful if you have very specific
constraints, for example the following would match "GET /commits/71dbb9c" as well
as "GET /commits/71dbb9c..4c084f9".

{% highlight js %}
router.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
  var from = req.params[0];
  var to = req.params[1] || 'HEAD';
  res.send('commit range ' + from + '..' + to);
});
{% endhighlight %}
