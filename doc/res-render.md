<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.render'>res.render(view [, locals] [, callback])</h3>

Renders a `view` and sends the rendered HTML string to the client.
Optional parameters:

- `locals`, an object whose properties define local variables for the view.
- `callback`, a callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes `next(err)` internally.

<div class="doc-box doc-notice" markdown="1">
The local variable `cache` enables view caching. Set it to `true`,
to cache the view during development; view caching is enabled in production by default.
</div>

{% highlight js %}
// send the rendered view to the client
res.render('index');

// if a callback is specified, the rendered HTML string has to be sent explicitly
res.render('index', function(err, html) {
  res.send(html);
});

// pass a local variable to the view
res.render('user', { name: 'Tobi' }, function(err, html) {
  // ...
});
{% endhighlight %}
