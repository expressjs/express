<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.route'>req.route</h3>

Contains the currently-matched route, a string.  For example:

{% highlight js %}
app.get('/user/:id?', function userIdHandler(req, res) {
  console.log(req.route);
  res.send('GET');
});
{% endhighlight %}

Example output from the previous snippet:

{% highlight js %}
{ path: '/user/:id?',
  stack:
   [ { handle: [Function: userIdHandler],
       name: 'userIdHandler',
       params: undefined,
       path: undefined,
       keys: [],
       regexp: /^\/?$/i,
       method: 'get' } ],
  methods: { get: true } }
{% endhighlight %}
