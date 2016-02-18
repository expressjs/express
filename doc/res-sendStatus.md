<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.sendStatus'>res.sendStatus(statusCode)</h3>

Sets the response HTTP status code to `statusCode` and send its string representation as the response body.

{% highlight js %}
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
{% endhighlight %}

If an unsupported status code is specified, the HTTP status is still set to `statusCode` and the string version of the code is sent as the response body.

{% highlight js %}
res.sendStatus(2000); // equivalent to res.status(2000).send('2000')
{% endhighlight %}

[More about HTTP Status Codes](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
