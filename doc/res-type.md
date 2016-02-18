<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.type'>res.type(type)</h3>

Sets the `Content-Type` HTTP header to the MIME type as determined by
[mime.lookup()](https://github.com/broofa/node-mime#mimelookuppath) for the specified `type`.
If `type` contains the "/" character, then it sets the `Content-Type` to `type`.

{% highlight js %}
res.type('.html');              // => 'text/html'
res.type('html');               // => 'text/html'
res.type('json');               // => 'application/json'
res.type('application/json');   // => 'application/json'
res.type('png');                // => image/png:
{% endhighlight %}
