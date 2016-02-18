<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.json'>res.json([body])</h3>

Sends a JSON response. This method is identical to `res.send()` with an object or array as the parameter.
However, you can use it to convert other values to JSON, such as `null`, and `undefined` 
(although these are technically not valid JSON).

{% highlight js %}
res.json(null);
res.json({ user: 'tobi' });
res.status(500).json({ error: 'message' });
{% endhighlight %}
