<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.cookies'>req.cookies</h3>

When using [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware, this property is an object that
contains cookies sent by the request.  If the request contains no cookies, it defaults to `{}`.

{% highlight js %}
// Cookie: name=tj
req.cookies.name
// => "tj"
{% endhighlight %}

For more information, issues, or concerns, see [cookie-parser](https://github.com/expressjs/cookie-parser).
