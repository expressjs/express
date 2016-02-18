<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.locals'>res.locals</h3>

An object that contains response local variables scoped to the request, and therefore available only to
the view(s) rendered during that request / response cycle (if any). Otherwise,
this property is identical to [app.locals](#app.locals).

This property is useful for exposing request-level information such as the request path name,
authenticated user, user settings, and so on.

{% highlight js %}
app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.authenticated = ! req.user.anonymous;
  next();
});
{% endhighlight %}
