<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.is'>req.is(type)</h3>

Returns `true` if the incoming request's "Content-Type" HTTP header field
matches the MIME type specified by the `type` parameter.
Returns `false` otherwise.

{% highlight js %}
// With Content-Type: text/html; charset=utf-8
req.is('html');
req.is('text/html');
req.is('text/*');
// => true

// When Content-Type is application/json
req.is('json');
req.is('application/json');
req.is('application/*');
// => true

req.is('html');
// => false
{% endhighlight %}

For more information, or if you have issues or concerns, see [type-is](https://github.com/expressjs/type-is).
