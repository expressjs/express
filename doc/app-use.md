<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='app.use'>app.use([path,] function [, function...])</h3>

Mounts the specified [middleware](/guide/using-middleware.html) function or functions at the specified path.
If `path` is not specified, it defaults to "/".

<div class="doc-box doc-info" markdown="1">
  A route will match any path that follows its path immediately with a "<code>/</code>".
  For example: <code>app.use('/apple', ...)</code> will match "/apple", "/apple/images",
  "/apple/images/news", and so on.
</div>

Note that `req.originalUrl` in a middleware function is a combination of `req.baseUrl` and `req.path`, as shown in the following example.

{% highlight js %}
app.use('/admin', function(req, res, next) {
  // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
  next();
});
{% endhighlight %}

Mounting a middleware function at a `path` will cause the middleware function to be executed whenever the base of the requested path matches the `path`.

Since `path` defaults to "/", middleware mounted without a path will be executed for every request to the app.

{% highlight js %}
// this middleware will be executed for every request to the app
app.use(function (req, res, next) {
  console.log('Time: %d', Date.now());
  next();
});
{% endhighlight %}

<div class="doc-box doc-info" markdown="1">
**NOTE**

Sub-apps will:

* Not inherit the value of settings that have a default value.  You must set the value in the sub-app.
* Inherit the value of settings with no default value.

For details, see [Application settings](/en/4x/api.html#app.settings.table).
</div>

Middleware functions are executed sequentially, therefore the order of middleware inclusion is important.

{% highlight js %}
// this middleware will not allow the request to go beyond it
app.use(function(req, res, next) {
  res.send('Hello World');
});

// requests will never reach this route
app.get('/', function (req, res) {
  res.send('Welcome');
});
{% endhighlight %}

`path` can be a string representing a path, a path pattern, a regular expression to match paths,
or an array of combinations thereof.


The following table provides some simple examples of mounting middleware.

<div class="table-scroller">
<table class="doctable" border="1">

  <thead>
    <tr>
      <th> Type </th>
      <th> Example </th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <td>Path</td>
      <td>
      This will match paths starting with `/abcd`:
        <pre><code class="language-js">app.use('/abcd', function (req, res, next) {
  next();
});</code></pre>
      </td>
    </tr>

    <tr>
      <td>Path Pattern</td>
      <td>
      This will match paths starting with `/abcd` and `/abd`:
        <pre><code class="language-js">app.use('/abc?d', function (req, res, next) {
  next();
});</code></pre>

This will match paths starting with `/abcd`, `/abbcd`, `/abbbbbcd`, and so on:
<pre><code class="language-js">
app.use('/ab+cd', function (req, res, next) {
  next();
});</code></pre>

This will match paths starting with `/abcd`, `/abxcd`, `/abFOOcd`, `/abbArcd`, and so on:
<pre><code class="language-js">
app.use('/ab\*cd', function (req, res, next) {
  next();
});</code></pre>

This will match paths starting with `/ad` and `/abcd`:
<pre><code class="language-js">
app.use('/a(bc)?d', function (req, res, next) {
  next();
});</code></pre>
      </td>
    </tr>

    <tr>
      <td>Regular Expression</td>
      <td>
      This will match paths starting with `/abc` and `/xyz`:
        <pre><code class="language-js">app.use(/\/abc|\/xyz/, function (req, res, next) {
  next();
});</code></pre>
      </td>
    </tr>

    <tr>
      <td>Array</td>
      <td>
      This will match paths starting with `/abcd`, `/xyza`, `/lmn`, and `/pqr`:
        <pre><code class="language-js">app.use(['/abcd', '/xyza', /\/lmn|\/pqr/], function (req, res, next) {
  next();
});</code></pre>
      </td>
    </tr>

  </tbody>

</table>
</div>

`function` can be a middleware function, a series of middleware functions,
an array of middleware functions, or a combination of all of them.
Since [router](#router) and [app](#application) implement the middleware interface, you can use them
as you would any other middleware function.

<table class="doctable" border="1">

  <thead>
    <tr>
      <th>Usage</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <td>Single Middleware</td>
      <td>You can define and mount a middleware function locally.
<pre><code class="language-js">app.use(function (req, res, next) {
  next();
});
</code></pre>
A router is valid middleware.

<pre><code class="language-js">var router = express.Router();
router.get('/', function (req, res, next) {
  next();
});
app.use(router);
</code></pre>

An Express app is valid middleware.
<pre><code class="language-js">var subApp = express();
subApp.get('/', function (req, res, next) {
  next();
});
app.use(subApp);
</code></pre>
      </td>
    </tr>

    <tr>
      <td>Series of Middleware</td>
      <td>
        You can specify more than one middleware function at the same mount path.
<pre><code class="language-js">var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use(r1, r2);
</code></pre>
      </td>
    </tr>

    <tr>
      <td>Array</td>
      <td>
      Use an array to group middleware logically.
      If you pass an array of middleware as the first or only middleware parameters,
      then you <em>must</em> specify the mount path.
<pre><code class="language-js">var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use('/', [r1, r2]);
</code></pre>
      </td>
    </tr>

    <tr>
      <td>Combination</td>
      <td>
        You can combine all the above ways of mounting middleware.
<pre><code class="language-js">function mw1(req, res, next) { next(); }
function mw2(req, res, next) { next(); }

var r1 = express.Router();
r1.get('/', function (req, res, next) { next(); });

var r2 = express.Router();
r2.get('/', function (req, res, next) { next(); });

var subApp = express();
subApp.get('/', function (req, res, next) { next(); });

app.use(mw1, [mw2, r1, r2], subApp);
</code></pre>
      </td>
    </tr>

  </tbody>

</table>

Following are some examples of using the [express.static](/guide/using-middleware.html#middleware.built-in)
middleware in an Express app.

Serve static content for the app from the "public" directory in the application directory:

{% highlight js %}
// GET /style.css etc
app.use(express.static(__dirname + '/public'));
{% endhighlight %}

Mount the middleware at "/static" to serve static content only when their request path is prefixed with "/static":

{% highlight js %}
// GET /static/style.css etc.
app.use('/static', express.static(__dirname + '/public'));
{% endhighlight %}

Disable logging for static content requests by loading the logger middleware after the static middleware:

{% highlight js %}
app.use(express.static(__dirname + '/public'));
app.use(logger());
{% endhighlight %}

Serve static files from multiple directories, but give precedence to "./public" over the others:

{% highlight js %}
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));
{% endhighlight %}
