<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.path'>req.path</h3>

Contains the path part of the request URL.

{% highlight js %}
// example.com/users?sort=desc
req.path
// => "/users"
{% endhighlight %}

<div class="doc-box doc-info" markdown="1">
When called from a middleware, the mount point is not included in `req.path`. See [app.use()](/4x/api.html#app.use) for more details.
</div>
