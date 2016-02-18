<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.set'>app.set(name, value)</h3>

Assigns setting `name` to `value`, where `name` is one of the properties from
the [app settings table](#app.settings.table).

Calling `app.set('foo', true)` for a Boolean property is the same as calling
`app.enable('foo')`. Similarly, calling `app.set('foo', false)` for a Boolean
property is the same as calling `app.disable('foo')`.

Retrieve the value of a setting with [`app.get()`](#app.get).

{% highlight js %}
app.set('title', 'My Site');
app.get('title'); // "My Site"
{% endhighlight %}

<h4 id='app.settings.table'>Application Settings</h4>

{% include api/en/4x/app-settings.md %}
