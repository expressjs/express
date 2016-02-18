<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.attachment'>res.attachment([filename])</h3>

Sets the HTTP response `Content-Disposition` header field to "attachment". If a `filename` is given,
then it sets the Content-Type based on the extension name via `res.type()`,
and sets the `Content-Disposition` "filename=" parameter.

{% highlight js %}
res.attachment();
// Content-Disposition: attachment

res.attachment('path/to/logo.png');
// Content-Disposition: attachment; filename="logo.png"
// Content-Type: image/png
{% endhighlight %}
