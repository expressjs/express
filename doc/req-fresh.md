<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.fresh'>req.fresh</h3>

Indicates whether the request is "fresh."  It is the opposite of `req.stale`.

It is true if the `cache-control` request header doesn't have a `no-cache` directive and any
of the following are true:

* The `if-modified-since` request header is specified  and `last-modified` request header is equal to or earlier than the `modified` response header.
* The `if-none-match` request header is `*`.
* The `if-none-match` request header, after being parsed into its directives, does not
match the `etag` response header.

{% highlight js %}
req.fresh
// => true
{% endhighlight %}

For more information, issues, or concerns, see [fresh](https://github.com/jshttp/fresh).
