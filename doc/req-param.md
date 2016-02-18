<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.param'>req.param(name [, defaultValue])</h3>

<div class="doc-box doc-warn" markdown="1">
Deprecated. Use either `req.params`, `req.body` or `req.query`, as applicable.
</div>

Returns the value of param `name` when present.

{% highlight js %}
// ?name=tobi
req.param('name')
// => "tobi"

// POST name=tobi
req.param('name')
// => "tobi"

// /user/tobi for /user/:name
req.param('name')
// => "tobi"
{% endhighlight %}

Lookup is performed in the following order:

* `req.params`
* `req.body`
* `req.query`

Optionally, you can specify `defaultValue` to set a default value if the parameter is not found in any of the request objects.

<div class="doc-box doc-warn" markdown="1">
Direct access to `req.body`, `req.params`, and `req.query` should be favoured for clarity - unless you truly accept input from each object.

Body-parsing middleware must be loaded for `req.param()` to work predictably. Refer [req.body](#req.body) for details.
</div>
