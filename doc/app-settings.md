<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

The following table lists application settings.

Note that sub-apps will:

* Not inherit the value of settings that have a default value.  You must set the value in the sub-app.
* Inherit the value of settings with no default value; these are explicitly noted in the table below.

Exceptions: Sub-apps will inherit the value of `trust proxy` even though it has a default value (for backward-compatibility);
Sub-apps will not inherit the value of `view cache` in production (when `NODE_ENV` is "production").

<div class="table-scroller">
  <table class="doctable" border="1">
    <thead><tr><th id="app-settings-property">Property</th><th>Type</th><th>Description</th><th>Default</th></tr></thead>
    <tbody>
    <tr>
  <td markdown="1">
  `case sensitive routing`
  </td>
      <td>Boolean</td>
      <td>Enable case sensitivity.
      When enabled, "/Foo" and "/foo" are different routes.
      When disabled, "/Foo" and "/foo" are treated the same.
        <p><b>NOTE</b>: Sub-apps will inherit the value of this setting.</p>
      </td>
      <td>N/A (undefined)
      </td>
    </tr>
    <tr>
  <td markdown="1">
  `env`
  </td>
      <td>String</td>
      <td>Environment mode.
      Be sure to set to "production" in a production environment;
      see <a href="/advanced/best-practice-performance.html#env">Production best practices: performance and reliability</a>.
    </td>
  <td markdown="1">
  `process.env.NODE_ENV` (`NODE_ENV` environment variable) or "development" if `NODE_ENV` is not set.
  </td>
    </tr>
    <tr>
  <td markdown="1">
  `etag`
  </td>
      <td>Varied</td>
  <td markdown="1">
  Set the ETag response header. For possible values, see the [`etag` options table](#etag.options.table).

  [More about the HTTP ETag header](http://en.wikipedia.org/wiki/HTTP_ETag).
  </td>
  <td markdown="1">
  `weak`
  </td>
    </tr>
    <tr>
  <td markdown="1">
  `jsonp callback name`
  </td>
      <td>String</td>
      <td>Specifies the default JSONP callback name.</td>
  <td markdown="1">
  "callback"
  </td>
    </tr>
    <tr>
  <td markdown="1">
  `json replacer`
  </td>
      <td>String</td>
      <td>JSON replacer callback function.
        <p><b>NOTE</b>: Sub-apps will inherit the value of this setting.</p>
      </td>
  <td>N/A (undefined)
  </td>
    </tr>
    <tr>
  <td markdown="1">
  `json spaces`
  </td>
      <td>Number</td>
      <td>When set, sends prettified JSON string indented with the specified amount of spaces.
        <p><b>NOTE</b>: Sub-apps will inherit the value of this setting.</p>
      </td>
      <td>N/A (undefined)</td>
    </tr>
    <tr>
  <td markdown="1">
  `query parser`
  </td>
      <td>Varied</td>
  <td markdown="1">
Disable query parsing by setting the value to `false`, or set the query parser to use either "simple" or "extended" or a custom query string parsing function.

The simple query parser is based on Node's native query parser, [querystring](http://nodejs.org/api/querystring.html).

The extended query parser is based on [qs](https://www.npmjs.org/package/qs).

A custom query string parsing function will receive the complete query string, and must return an object of query keys and their values.
  </td>
      <td>"extended"</td>
    </tr>
    <tr>
  <td markdown="1">
  `strict routing`
  </td>
      <td>Boolean</td>
      <td>Enable strict routing.
      When enabled, the router treats "/foo" and "/foo/" as different.
      Otherwise, the router treats "/foo" and "/foo/" as the same.
        <p><b>NOTE</b>: Sub-apps will inherit the value of this setting.</p>
      </td>
      <td>N/A (undefined) </td>
    </tr>
    <tr>
  <td markdown="1">
  `subdomain offset`
  </td>
      <td>Number</td>
      <td>The number of dot-separated parts of the host to remove to access subdomain.</td>
      <td>2</td>
    </tr>
    <tr>
  <td markdown="1">
  `trust proxy`
  </td>
      <td>Varied</td>
  <td>
  Indicates the app is behind a front-facing proxy, and to use the <code>X-Forwarded-*</code> headers to determine the connection and the IP address of the client. NOTE: <code>X-Forwarded-*</code> headers are easily spoofed and the detected IP addresses are unreliable.
<p>
  When enabled, Express attempts to determine the IP address of the client connected through the front-facing proxy, or series of proxies. The <code>req.ips</code> property, then contains an array of IP addresses the client is connected through. To enable it, use the values described in the <a href="#trust.proxy.options.table">trust proxy options table</a>.
</p><p>
  The <code>trust proxy</code> setting is implemented using the <a href="https://www.npmjs.org/package/proxy-addr">proxy-addr</a> package.  For more information, see its documentation.
</p><p>
<b>NOTE</b>: Sub-apps <i>will</i> inherit the value of this setting, even though it has a default value.
</p>
  </td>
      <td>
      <code>false</code> (disabled)
      </td>
    </tr>
    <tr>
  <td>
  <code>views</code>
  </td>
      <td>String or Array</td>
      <td>A directory or an array of directories for the application's views. If an array, the views are looked up in the order they occur in the array.</td>
  <td markdown="1">
  <code>process.cwd() + '/views'</code>
  </td>
    </tr>
    <tr>
  <td markdown="1">
  <code>view cache</code>
  </td>
      <td>Boolean</td>
      <td>Enables view template compilation caching.
      <br/><b>NOTE</b>: Sub-apps will not inherit the value of this setting in production (when <code>NODE_ENV</code> is "production").
      </td>
  <td markdown="1">
  <code>true</code> in production, otherwise undefined.
  </td>
    </tr>
    <tr>
  <td markdown="1">
  <code>view engine</code>
  </td>
      <td>String</td>
      <td>The default engine extension to use when omitted.
        <br/><b>NOTE</b>: Sub-apps will inherit the value of this setting.
      </td>
      <td>N/A (undefined)</td>
    </tr>
    <tr>
  <td markdown="1">
  <code>x-powered-by</code>
  </td>
      <td>Boolean</td>
      <td>Enables the "X-Powered-By: Express" HTTP header.</td>
  <td markdown="1">
  <code>true</code>
  </td>
    </tr>
    </tbody>
  </table>

  <h5 id="trust.proxy.options.table">Options for <code>trust proxy</code> setting</h5>

  <p markdown="1">
  Read [Express behind proxies](/guide/behind-proxies.html) for more
  information.
  </p>

  <table class="doctable" border="1">
    <thead><tr><th>Type</th><th>Value</th></tr></thead>
    <tbody>
      <tr>
        <td>Boolean</td>
  <td markdown="1">
  If <code>true</code>, the client's IP address is understood as the left-most entry in the <code>X-Forwarded-*</code> header.

  If <code>false</code>, the app is understood as directly facing the Internet and the client's IP address is derived from <code>req.connection.remoteAddress</code>. This is the default setting.
  </td>
      </tr>
      <tr>
        <td>IP addresses</td>
  <td markdown="1">
  An IP address, subnet, or an array of IP addresses, and subnets to trust. Pre-configured subnet names are:

  * loopback - <code>127.0.0.1/8</code>, <code>::1/128</code>
  * linklocal - <code>169.254.0.0/16</code>, <code>fe80::/10</code>
  * uniquelocal - <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>, <code>fc00::/7</code>

  Set IP addresses in any of the following ways:

  <pre><code class="language-js">app.set('trust proxy', 'loopback') // specify a single subnet
app.set('trust proxy', 'loopback, 123.123.123.123') // specify a subnet and an address
app.set('trust proxy', 'loopback, linklocal, uniquelocal') // specify multiple subnets as CSV
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // specify multiple subnets as an array</code></pre>

  When specified, the IP addresses or the subnets are excluded from the address determination process, and the untrusted IP address nearest to the application server is determined as the client's IP address.
  </td>
      </tr>
      <tr>
        <td>Number</td>
  <td markdown="1">
  Trust the nth hop from the front-facing proxy server as the client.
  </td>
      </tr>
      <tr>
        <td>Function</td>
  <td markdown="1">
  Custom trust implementation. Use this only if you know what you are doing.
  <pre><code class="language-js">app.set('trust proxy', function (ip) {
    if (ip === '127.0.0.1' || ip === '123.123.123.123') return true; // trusted IPs
    else return false;
  });</code></pre>
  </td>
      </tr>
    </tbody>
  </table>

  <h5 id="etag.options.table">Options for <code>etag</code> setting</h5>

  <p markdown="1">
  The ETag functionality is implemented using the
  [etag](https://www.npmjs.org/package/etag) package.
  For more information, see its documentation.
  </p>

  <table class="doctable" border="1">
    <thead><tr><th>Type</th><th>Value</th></tr></thead>
    <tbody>
      <tr>
        <td>Boolean</td>
  <td markdown="1">
  <code>true</code> enables weak ETag. This is the default setting.<br>
  <code>false</code> disables ETag altogether.
  </td>
      </tr>
      <tr>
        <td>String</td>
        <td>
            If "strong", enables strong ETag.<br>
            If "weak", enables weak ETag.
        </td>
      </tr>
      <tr>
        <td>Function</td>
  <td markdown="1">Custom ETag function implementation. Use this only if you know what you are doing.

  <pre><code class="language-js">app.set('etag', function (body, encoding) {
  return generateHash(body, encoding); // consider the function is defined
  });</code></pre>

  </td>
      </tr>
    </tbody>
  </table>
</div>
