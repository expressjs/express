<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h2>Request</h2>

The `req` object represents the HTTP request and has properties for the
request query string, parameters, body, HTTP headers, and so on.  In this documentation and by convention,
the object is always referred to as `req` (and the HTTP response is `res`) but its actual name is determined
by the parameters to the callback function in which you're working.

For example:

{% highlight js %}
app.get('/user/:id', function(req, res) {
  res.send('user ' + req.params.id);
});
{% endhighlight %}

But you could just as well have:

{% highlight js %}
app.get('/user/:id', function(request, response) {
  response.send('user ' + request.params.id);
});
{% endhighlight %}

<h3 id='req.properties'>Properties</h3>

<div class="doc-box doc-notice" markdown="1">
In Express 4, `req.files` is no longer available on the `req` object by default. To access uploaded files on the `req.files` object, use multipart-handling middleware like [busboy](https://www.npmjs.com/package/busboy), [multer](https://www.npmjs.com/package/multer), [formidable](https://www.npmjs.com/package/formidable), [multiparty](https://www.npmjs.com/package/multiparty), [connect-multiparty](https://www.npmjs.com/package/connect-multiparty), or [pez](https://www.npmjs.com/package/pez).
</div>

<section markdown="1">
  {% include api/en/4x/req-app.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-baseUrl.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-body.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-cookies.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-fresh.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-hostname.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-ip.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-ips.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-method.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-originalUrl.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-params.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-path.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-protocol.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-query.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-route.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-secure.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-signedCookies.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-stale.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-subdomains.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-xhr.md %}
</section>

<h3 id='req.methods'>Methods</h3>

<section markdown="1">
  {% include api/en/4x/req-accepts.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-acceptsCharsets.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-acceptsEncodings.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-acceptsLanguages.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-get.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-is.md %}
</section>

<section markdown="1">
  {% include api/en/4x/req-param.md %}
</section>
