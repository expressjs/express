<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.enabled'>app.enabled(name)</h3>

Returns `true` if the setting `name` is enabled (`true`), where `name` is one of the
properties from the [app settings table](#app.settings.table).

{% highlight js %}
app.enabled('trust proxy');
// => false

app.enable('trust proxy');
app.enabled('trust proxy');
// => true
{% endhighlight %}
