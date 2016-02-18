<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.send'>res.send([body])</h3>

Sends the HTTP response.

The `body` parameter can be a `Buffer` object, a `String`, an object, or an `Array`.
For example:

{% highlight js %}
res.send(new Buffer('whoop'));
res.send({ some: 'json' });
res.send('<p>some html</p>');
res.status(404).send('Sorry, we cannot find that!');
res.status(500).send({ error: 'something blew up' });
{% endhighlight %}

This method performs many useful tasks for simple non-streaming responses:
For example, it automatically assigns the `Content-Length` HTTP response header field
(unless previously defined) and provides automatic HEAD and HTTP cache freshness support.

When the parameter is a `Buffer` object, the method sets the `Content-Type`
response header field  to "application/octet-stream", unless previously defined as shown below:

{% highlight js %}
res.set('Content-Type', 'text/html');
res.send(new Buffer('<p>some html</p>'));
{% endhighlight %}

When the parameter is a `String`, the method sets the `Content-Type` to "text/html":

{% highlight js %}
res.send('<p>some html</p>');
{% endhighlight %}

When the parameter is an `Array` or `Object`, Express responds with the JSON representation:

{% highlight js %}
res.send({ user: 'tobi' });
res.send([1,2,3]);
{% endhighlight %}
