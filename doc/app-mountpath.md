<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.mountpath'>app.mountpath</h3>

The `app.mountpath` property contains one or more path patterns on which a sub-app was mounted.

<div class="doc-box doc-info" markdown="1">
  A sub-app is an instance of `express` that may be used for handling the request to a route.
</div>

{% highlight js %}
var express = require('express');

var app = express(); // the main app
var admin = express(); // the sub app

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // /admin
  res.send('Admin Homepage');
});

app.use('/admin', admin); // mount the sub app
{% endhighlight %}

It is similar to the [baseUrl](#req.baseUrl) property of the `req` object, except `req.baseUrl`
returns the matched URL path, instead of the matched patterns.

If a sub-app is mounted on multiple path patterns, `app.mountpath` returns the list of
patterns it is mounted on, as shown in the following example.

{% highlight js %}
var admin = express();

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
  res.send('Admin Homepage');
});

var secret = express();
secret.get('/', function (req, res) {
  console.log(secret.mountpath); // /secr*t
  res.send('Admin Secret');
});

admin.use('/secr*t', secret); // load the 'secret' router on '/secr*t', on the 'admin' sub app
app.use(['/adm*n', '/manager'], admin); // load the 'admin' router on '/adm*n' and '/manager', on the parent app
{% endhighlight %}
