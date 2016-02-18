<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h2>Response</h2>

The `res` object represents the HTTP response that an Express app sends when it gets an HTTP request.

In this documentation and by convention,
the object is always referred to as `res` (and the HTTP request is `req`) but its actual name is determined
by the parameters to the callback function in which you're working.

For example:

{% highlight js %}
app.get('/user/:id', function(req, res){
  res.send('user ' + req.params.id);
});
{% endhighlight %}

But you could just as well have:

{% highlight js %}
app.get('/user/:id', function(request, response){
  response.send('user ' + request.params.id);
});
{% endhighlight %}

<h3 id='res.properties'>Properties</h3>

<section markdown="1">
  {% include api/en/4x/res-app.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-headersSent.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-locals.md %}
</section>

<h3 id='res.methods'>Methods</h3>

<section markdown="1">
  {% include api/en/4x/res-append.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-attachment.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-cookie.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-clearCookie.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-download.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-end.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-format.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-get.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-json.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-jsonp.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-links.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-location.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-redirect.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-render.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-send.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-sendFile.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-sendStatus.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-set.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-status.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-type.md %}
</section>

<section markdown="1">
  {% include api/en/4x/res-vary.md %}
</section>
