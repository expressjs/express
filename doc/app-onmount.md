<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.onmount'>app.on('mount', callback(parent))</h3>

The `mount` event is fired on a sub-app, when it is mounted on a parent app. The parent app is passed to the callback function.

<div class="doc-box doc-info" markdown="1">
**NOTE**

Sub-apps will:

* Not inherit the value of settings that have a default value.  You must set the value in the sub-app.
* Inherit the value of settings with no default value.

For details, see [Application settings](/en/4x/api.html#app.settings.table).
</div>

{% highlight js %}
var admin = express();

admin.on('mount', function (parent) {
  console.log('Admin Mounted');
  console.log(parent); // refers to the parent app
});

admin.get('/', function (req, res) {
  res.send('Admin Homepage');
});

app.use('/admin', admin);
{% endhighlight %}
