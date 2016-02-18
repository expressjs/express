<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.listen'>app.listen(port, [hostname], [backlog], [callback])</h3>

Binds and listens for connections on the specified host and port.
This method is identical to Node's [http.Server.listen()](http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback).

{% highlight js %}
var express = require('express');
var app = express();
app.listen(3000);
{% endhighlight %}

The `app` returned by `express()` is in fact a JavaScript
`Function`, designed to be passed to Node's HTTP servers as a callback
to handle requests. This makes it easy to provide both HTTP and HTTPS versions of
your app with the same code base, as the app does not inherit from these
(it is simply a callback):

{% highlight js %}
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
{% endhighlight %}

The `app.listen()` method returns an [http.Server](https://nodejs.org/api/http.html#http_class_http_server) object and (for HTTP) is a convenience method for the following:

{% highlight js %}
app.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
{% endhighlight %}
