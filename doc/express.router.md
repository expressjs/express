<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='express.router' class='h2'>express.Router([options])</h3>

Creates a new [router](#router) object.

{% highlight js %}
var router = express.Router([options]);
{% endhighlight %}

The optional `options` parameter specifies the behavior of the router.

<div class="table-scroller" markdown="1">

| Property        | Description                                     | Default     | Availability  |
|-----------------|-------------------------------------------------|-------------|---------------|
| `caseSensitive` | Enable case sensitivity. | Disabled by default, treating "/Foo" and "/foo" as the same.|  |
| `mergeParams`   | Preserve the `req.params` values from the parent router. If the parent and the child have conflicting param names, the child's value take precedence.| `false` | 4.5.0+ |
| `strict`        | Enable strict routing. | Disabled by default, "/foo" and "/foo/" are treated the same by the router.| &nbsp; |

</div>

You can add middleware and HTTP method routes (such as `get`, `put`, `post`, and
so on) to `router` just like an application.

For more information, see [Router](#router).
