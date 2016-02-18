<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.ip'>req.ip</h3>

Contains the remote IP address of the request.

When the [`trust proxy` setting](/4x/api.html#trust.proxy.options.table) does not evaluate to `false`,
the value of this property is derived from the left-most entry in the
`X-Forwarded-For` header. This header can be set by the client or by the proxy.

{% highlight js %}
req.ip
// => "127.0.0.1"
{% endhighlight %}
