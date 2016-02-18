<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h2>Router</h2>

<section markdown="1">
A `router` object is an isolated instance of middleware and routes. You can think of it
as a "mini-application," capable only of performing middleware and routing
functions. Every Express application has a built-in app router.

A router behaves like middleware itself, so you can use it as an argument to
[app.use()](#app.use) or as the argument to another router's  [use()](#router.use) method.

The top-level `express` object has a [Router()](#express.router) method that creates a new `router` object.

Once you've created a router object, you can add middleware and HTTP method routes (such as `get`, `put`, `post`,
and so on) to it just like an application.  For example:

{% highlight js %}
// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

// will handle any request that ends in /events
// depends on where the router is "use()'d"
router.get('/events', function(req, res, next) {
  // ..
});
{% endhighlight %}

You can then use a router for a particular root URL in this way separating your routes into files or even mini-apps.

{% highlight js %}
// only requests to /calendar/* will be sent to our "router"
app.use('/calendar', router);
{% endhighlight %}


</section>

<h3 id='router.methods'>Methods</h3>

<section markdown="1">
  {% include api/en/4x/router-all.md %}
</section>

<section markdown="1">
  {% include api/en/4x/router-METHOD.md %}
</section>

<section markdown="1">
  {% include api/en/4x/router-param.md %}
</section>

<section markdown="1">
  {% include api/en/4x/router-route.md %}
</section>

<section markdown="1">
  {% include api/en/4x/router-use.md %}
</section>
