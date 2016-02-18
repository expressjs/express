<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.links'>res.links(links)</h3>

Joins the `links` provided as properties of the parameter to populate the response's
`Link` HTTP header field.

For example, the following call:

{% highlight js %}
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5'
});
{% endhighlight %}

Yields the following results:

{% highlight js %}
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
{% endhighlight %}
