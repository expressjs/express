<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.locals'>app.locals</h3>

The `app.locals` object is has properties that are local variables within the application.

{% highlight js %}
app.locals.title
// => 'My App'

app.locals.email
// => 'me@myapp.com'
{% endhighlight %}

Once set, the value of `app.locals` properties persist throughout the life of the application,
in contrast with [res.locals](#res.locals) properties that
are valid only for the lifetime of the request.

You can access local variables in templates rendered within the application.
This is useful for providing helper functions to templates, as well as application-level data.
Local variables are available in middleware via `req.app.locals` (see [req.app](#req.app))

{% highlight js %}
app.locals.title = 'My App';
app.locals.strftime = require('strftime');
app.locals.email = 'me@myapp.com';
{% endhighlight %}
