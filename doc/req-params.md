<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.params'>req.params</h3>

This property is an object containing properties mapped to the named route "parameters". For example, if you have the route `/user/:name`, then the "name" property is available as `req.params.name`. This object defaults to `{}`.

{% highlight js %}
// GET /user/tj
req.params.name
// => "tj"
{% endhighlight %}

When you use a regular expression for the route definition, capture groups are provided in the array using `req.params[n]`, where `n` is the n<sup>th</sup> capture group. This rule is applied to unnamed wild card matches with string routes such as `/file/*`:

{% highlight js %}
// GET /file/javascripts/jquery.js
req.params[0]
// => "javascripts/jquery.js"
{% endhighlight %}
