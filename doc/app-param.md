<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.param'>app.param([name], callback)</h3>

Add callback triggers to route parameters, where `name` is the name of the parameter or an array of them, and `function` is the callback function. The parameters of the callback function are the request object, the response object, the next middleware, the value of the parameter and the name of the parameter, in that order.

If `name` is an array, the `callback` trigger is registered for each parameter declared in it, in the order in which they are declared. Furthermore, for each declared parameter except the last one, a call to `next` inside the callback will call the callback for the next declared parameter. For the last parameter, a call to `next` will call the next middleware in place for the route currently being processed, just like it would if `name` were just a string.

For example, when `:user` is present in a route path, you may map user loading logic to automatically provide `req.user` to the route, or perform validations on the parameter input.

{% highlight js %}
app.param('user', function(req, res, next, id) {

  // try to get the user details from the User model and attach it to the request object
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});
{% endhighlight %}

Param callback functions are local to the router on which they are defined. They are not inherited by mounted apps or routers. Hence, param callbacks defined on `app` will be triggered only by route parameters defined on `app` routes.

All param callbacks will be called before any handler of any route in which the param occurs, and they will each be called only once in a request-response cycle, even if the parameter is matched in multiple routes, as shown in the following examples.

{% highlight js %}
app.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

app.get('/user/:id', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});
{% endhighlight %}

On `GET /user/42`, the following is printed:

```
CALLED ONLY ONCE
although this matches
and this matches too
```

{% highlight js %}
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});

app.get('/user/:id/:page', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too');
  res.end();
});
{% endhighlight %}

On `GET /user/42/3`, the following is printed:

```
CALLED ONLY ONCE with 42
CALLED ONLY ONCE with 3
although this matches
and this matches too
```

<div class="doc-box doc-warn" markdown="1">
The following section describes `app.param(callback)`, which is deprecated as of v4.11.0.
</div>

The behavior of the `app.param(name, callback)` method can be altered entirely by passing only a function to `app.param()`. This function is a custom implementation of how `app.param(name, callback)` should behave - it accepts two parameters and must return a middleware.

The first parameter of this function is the name of the URL parameter that should be captured, the second parameter can be any JavaScript object which might be used for returning the middleware implementation.

The middleware returned by the function decides the behavior of what happens when a URL parameter is captured.

In this example, the `app.param(name, callback)` signature is modified to `app.param(name, accessId)`. Instead of accepting a name and a callback, `app.param()` will now accept a name and a number.

{% highlight js %}
var express = require('express');
var app = express();

// customizing the behavior of app.param()
app.param(function(param, option) {
  return function (req, res, next, val) {
    if (val == option) {
      next();
    }
    else {
      res.sendStatus(403);
    }
  }
});

// using the customized app.param()
app.param('id', 1337);

// route to trigger the capture
app.get('/user/:id', function (req, res) {
  res.send('OK');
});

app.listen(3000, function () {
  console.log('Ready');
});
{% endhighlight %}

In this example, the `app.param(name, callback)` signature remains the same, but instead of a middleware callback, a custom data type checking function has been defined to validate the data type of the user id.

{% highlight js %}
app.param(function(param, validator) {
  return function (req, res, next, val) {
    if (validator(val)) {
      next();
    }
    else {
      res.sendStatus(403);
    }
  }
});

app.param('id', function (candidate) {
  return !isNaN(parseFloat(candidate)) && isFinite(candidate);
});
{% endhighlight %}

<div class="doc-box doc-info" markdown="1">
The '`.`' character can't be used to capture a character in your capturing regexp. For example you can't use `'/user-.+/'` to capture `'users-gami'`, use `[\\s\\S]` or `[\\w\\W]` instead (as in `'/user-[\\s\\S]+/'`.

Examples:

<pre><code class="language-js">//captures '1-a_6' but not '543-azser-sder'
router.get('/[0-9]+-[[\\w]]*', function);

//captures '1-a_6' and '543-az(ser"-sder' but not '5-a s'
router.get('/[0-9]+-[[\\S]]*', function);

//captures all (equivalent to '.*')
router.get('[[\\s\\S]]*', function);
</code></pre>

</div>
