<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.headersSent'>res.headersSent</h3>

Boolean property that indicates if the app sent HTTP headers for the response.

{% highlight js %}
app.get('/', function (req, res) {
  console.log(res.headersSent); // false
  res.send('OK');
  console.log(res.headersSent); // true
});
{% endhighlight %}
