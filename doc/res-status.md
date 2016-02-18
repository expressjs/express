<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.status'>res.status(code)</h3>

Sets the HTTP status for the response.
It is a chainable alias of Node's [response.statusCode](http://nodejs.org/api/http.html#http_response_statuscode).

{% highlight js %}
res.status(403).end();
res.status(400).send('Bad Request');
res.status(404).sendFile('/absolute/path/to/404.png');
{% endhighlight %}
