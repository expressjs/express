<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='express.static' class='h2'>express.static(root, [options])</h3>

This is the only built-in middleware function in Express.
It serves static files and is based on [serve-static](https://github.com/expressjs/serve-static).

The `root` argument refers to the root directory from which the static assets are to be served.
The file to serve will be determined by combining `req.url` with the provided `root` directory.
When a file is not found, instead of sending a 404 response, this module will instead call `next()`
to move on to the next middleware, allowing for stacking and fall-backs.

The following table describes the properties of the `options` object.

| Property      | Description                                                           |   Type      | Default         |
|---------------|-----------------------------------------------------------------------|-------------|-----------------|
| `dotfiles`    | Determines how dotfiles (files or directories that begin with a dot ".") are treated.  <br/><br/>See [dotfiles](#dotfiles) below. | String | "ignore"|
| `etag`        | Enable or disable etag generation  | Boolean | `true` |
| `extensions`  | Sets file extension fallbacks: If a file is not found, search for files with the specified extensions and serve the first one found. Example: `['html', 'htm']`.| Boolean | `false` |
| `fallthrough`  | Let client errors fall-through as unhandled requests, otherwise forward a client error. <br/><br/>See [fallthrough](#fallthrough) below.| Boolean | `true` |
| `index`       | Sends the specified directory index file. Set to `false` to disable directory indexing. | Mixed | "index.html" |
| `lastModified` | Set the `Last-Modified` header to the last modified date of the file on the OS. | Boolean | `true` |
| `maxAge`      | Set the max-age property of the Cache-Control header in milliseconds or a string in [ms format](https://www.npmjs.org/package/ms). | Number | 0 |
| `redirect`    | Redirect to trailing "/" when the pathname is a directory. | Boolean | `true` |
| `setHeaders`  | Function for setting HTTP headers to serve with the file. <br/><br/>See [setHeaders](#setHeaders) below. | Function |  |

For more information, see [Serving static files in Express](/starter/static-files.html).

<h5 id='dotfiles'> dotfiles</h5>

Possible values for this option are:

- "allow" - No special treatment for dotfiles.
- "deny" - Deny a request for a dotfile, respond with `403`, then call `next()`.
- "ignore" - Act as if the dotfile does not exist, respond with `404`, then call `next()`.

**NOTE**: With the default value, it will not ignore files in a directory that begins with a dot.

<h5 id='fallthrough'>fallthrough</h5>

When this option is `true`, client errors such as a bad request or a request to a non-existent
file will cause this middleware to simply call `next()` to invoke the next middleware in the stack.
When false, these errors (even 404s), will invoke `next(err)`.

Set this option to `true` so you can map multiple physical directories
to the same web address or for routes to fill in non-existent files.

Use `false` if you have mounted this middleware at a path designed
to be strictly a single file system directory, which allows for short-circuiting 404s
for less overhead. This middleware will also reply to all methods.

<h5 id='setHeaders'>setHeaders</h5>

For this option, specify a function to set custom response headers. Alterations to the headers must occur synchronously.

The signature of the function is:

{% highlight js %}
fn(res, path, stat)
{% endhighlight %}

Arguments:

- `res`, the [response object](#res).
- `path`, the file path that is being sent.
- `stat`, the `stat` object of the file that is being sent.
