<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.originalUrl'>req.originalUrl</h3>

<div class="doc-box doc-notice" markdown="1">
`req.url` is not a native Express property, it is inherited from Node's [http module](https://nodejs.org/api/http.html#http_message_url).
</div>

This property is much like `req.url`; however, it retains the original request URL,
allowing you to rewrite `req.url` freely for internal routing purposes. For example,
the "mounting" feature of [app.use()](#app.use) will rewrite `req.url` to strip the mount point.

{% highlight js %}
// GET /search?q=something
req.originalUrl
// => "/search?q=something"
{% endhighlight %}
