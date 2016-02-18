<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.clearCookie'>res.clearCookie(name [, options])</h3>

Clears the cookie specified by `name`. For details about the `options` object, see [res.cookie()](#res.cookie).

{% highlight js %}
res.cookie('name', 'tobi', { path: '/admin' });
res.clearCookie('name', { path: '/admin' });
{% endhighlight %}
