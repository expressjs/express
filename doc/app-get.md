<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.get'>app.get(name)</h3>

Returns the value of `name` app setting, where `name` is one of strings in the
[app settings table](#app.settings.table). For example:

{% highlight js %}
app.get('title');
// => undefined

app.set('title', 'My Site');
app.get('title');
// => "My Site"
{% endhighlight %}
