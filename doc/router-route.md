<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='router.route'>router.route(path)</h3>

Returns an instance of a single route which you can then use to handle HTTP verbs
with optional middleware. Use `router.route()` to avoid duplicate route naming and
thus typo errors.

Building on the `router.param()` example above, the following code shows how to use
`router.route()` to specify various HTTP method handlers.

{% highlight js %}
var router = express.Router();

router.param('user_id', function(req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
  req.user = {
    id: id,
    name: 'TJ'
  };
  next();
});

router.route('/users/:user_id')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(function(req, res, next) {
  res.json(req.user);
})
.put(function(req, res, next) {
  // just an example of maybe updating the user
  req.user.name = req.params.name;
  // save user ... etc
  res.json(req.user);
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
});
{% endhighlight %}

This approach re-uses the single `/users/:user_id` path and add handlers for
various HTTP methods.

<div class="doc-box doc-info" markdown="1">
NOTE: When you use `router.route()`, middleware ordering is based on when the _route_ is created, not when method handlers are added to the route.  For this purpose, you can consider method handlers to belong to the route to which they were added.
</div>
