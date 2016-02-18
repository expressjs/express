<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.secure'>req.secure</h3>

A Boolean property that is true if a TLS connection is established. Equivalent to:

{% highlight js %}
'https' == req.protocol;
{% endhighlight %}
