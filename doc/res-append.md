<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.append'>res.append(field [, value])</h3>

<div class="doc-box doc-info" markdown="1">
`res.append()` is supported by Express v4.11.0+
</div>

Appends the specified `value` to the HTTP response header `field`.  If the header is not already set,
it creates the header with the specified value.  The `value` parameter can be a string or an array.

Note: calling `res.set()` after `res.append()` will reset the previously-set header value.

{% highlight js %}
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
res.append('Warning', '199 Miscellaneous warning');
{% endhighlight %}
