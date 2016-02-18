<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.post.method'>app.post(path, callback [, callback ...])</h3>

Routes HTTP POST requests to the specified path with the specified callback functions.
For more information, see the [routing guide](/guide/routing.html).

You can provide multiple callback functions that behave just like middleware,
except that these callbacks can invoke `next('route')` to bypass the
remaining route callback(s). You can use this mechanism to impose pre-conditions on
a route, then pass control to subsequent routes if there's no reason to proceed with
the current route.

{% highlight js %}
app.post('/', function (req, res) {
  res.send('POST request to homepage');
});
{% endhighlight %}
