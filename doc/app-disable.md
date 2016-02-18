<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.disable'>app.disable(name)</h3>

Sets the Boolean setting `name` to `false`, where `name` is one of the properties from the [app settings table](#app.settings.table).
Calling `app.set('foo', false)` for a Boolean property is the same as calling `app.disable('foo')`.

For example:

{% highlight js %}
app.disable('trust proxy');
app.get('trust proxy');
// => false
{% endhighlight %}
