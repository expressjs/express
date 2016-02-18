<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.render'>app.render(view, [locals], callback)</h3>

Returns the rendered HTML of a view via the `callback` function. It accepts an optional parameter
that is an object containing local variables for the view. It is like [res.render()](#res.render),
except it cannot send the rendered view to the client on its own.

<div class="doc-box doc-info" markdown="1">
Think of `app.render()` as a utility function for generating rendered view strings.
Internally `res.render()` uses `app.render()` to render views.
</div>

<div class="doc-box doc-notice" markdown="1">
The local variable `cache` is reserved for enabling view cache. Set it to `true`, if you want to
cache view during development; view caching is enabled in production by default.
</div>

{% highlight js %}
app.render('email', function(err, html){
  // ...
});

app.render('email', { name: 'Tobi' }, function(err, html){
  // ...
});
{% endhighlight %}
