<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.xhr'>req.xhr</h3>

A Boolean property that is `true` if the request's `X-Requested-With` header field is
"XMLHttpRequest", indicating that the request was issued by a client library such as jQuery.

{% highlight js %}
req.xhr
// => true
{% endhighlight %}
