<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.location'>res.location(path)</h3>

Sets the response `Location` HTTP header to the specified `path` parameter.

{% highlight js %}
res.location('/foo/bar');
res.location('http://example.com');
res.location('back');
{% endhighlight %}

A `path` value of "back" has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the `Referer` header was not specified, it refers to "/".

<div class='doc-box doc-warn' markdown="1">
Express passes the specified URL string as-is to the browser in the `Location` header,
without any validation or manipulation, except in case of `back`.

Browsers take the responsibility of deriving the intended URL from the current URL
or the referring URL, and the URL specified in the `Location` header; and redirect the user accordingly.
</div>
