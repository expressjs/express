<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.disabled'>app.disabled(name)</h3>

Returns `true` if the Boolean setting `name` is disabled (`false`), where `name` is one of the properties from
the [app settings table](#app.settings.table).

{% highlight js %}
app.disabled('trust proxy');
// => true

app.enable('trust proxy');
app.disabled('trust proxy');
// => false
{% endhighlight %}
