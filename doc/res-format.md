<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.format'>res.format(object)</h3>

Performs content-negotiation on the `Accept` HTTP header on the request object, when present.
It uses [req.accepts()](#req.accepts) to select a handler for the request, based on the acceptable
types ordered by their quality values. If the header is not specified, the first callback is invoked.
When no match is found, the server responds with 406 "Not Acceptable", or invokes the `default` callback.

The `Content-Type` response header is set when a callback is selected. However, you may alter
this within the callback using methods such as `res.set()` or `res.type()`.

The following example would respond with `{ "message": "hey" }` when the `Accept` header field is set
to "application/json" or "\*/json" (however if it is "\*/\*", then the response will be "hey").

{% highlight js %}
res.format({
  'text/plain': function(){
    res.send('hey');
  },

  'text/html': function(){
    res.send('<p>hey</p>');
  },

  'application/json': function(){
    res.send({ message: 'hey' });
  },

  'default': function() {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable');
  }
});
{% endhighlight %}

In addition to canonicalized MIME types, you may also use extension names mapped
to these types for a slightly less verbose implementation:

{% highlight js %}
res.format({
  text: function(){
    res.send('hey');
  },

  html: function(){
    res.send('<p>hey</p>');
  },

  json: function(){
    res.send({ message: 'hey' });
  }
});
{% endhighlight %}
