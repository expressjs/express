<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.sendFile'>res.sendFile(path [, options] [, fn])</h3>

<div class="doc-box doc-info" markdown="1">
`res.sendFile()` is supported by Express v4.8.0 onwards
</div>

Transfers the file at the given `path`. Sets the `Content-Type` response HTTP header field
based on the filename's extension. Unless the `root` option is set in
the options object, `path` must be an absolute path to the file.

The following table provides details on the `options` parameter.

<div class="table-scroller" markdown="1">

| Property        | Description                                     | Default     | Availability |
|-----------------|-------------------------------------------------|-------------|--------------|
|`maxAge`         | Sets the max-age property of the `Cache-Control` header in milliseconds or a string in [ms format](https://www.npmjs.org/package/ms)| 0 |  |
| `root`          | Root directory for relative filenames.|  |  |
| `lastModified`  | Sets the `Last-Modified` header to the last modified date of the file on the OS. Set `false` to disable it.| Enabled | 4.9.0+ |
| `headers`       | Object containing HTTP headers to serve with the file.|  |  |
| `dotfiles`      | Option for serving dotfiles. Possible values are "allow", "deny", "ignore".| "ignore" | &nbsp; |

</div>

The method invokes the callback function `fn(err)` when the transfer is complete
or when an error occurs. If the callback function is specified and an error occurs,
the callback function must explicitly handle the response process either by
ending the request-response cycle, or by passing control to the next route.

Here is an example of using `res.sendFile` with all its arguments.

~~~js
app.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});
~~~

The following example illustrates using
`res.sendFile` to provide fine-grained support for serving files:

~~~js
app.get('/user/:uid/photos/:file', function(req, res){
  var uid = req.params.uid
    , file = req.params.file;

  req.user.mayViewFilesFrom(uid, function(yes){
    if (yes) {
      res.sendFile('/uploads/' + uid + '/' + file);
    } else {
      res.status(403).send('Sorry! you cant see that.');
    }
  });
});
~~~
For more information, or if you have issues or concerns, see [send](https://github.com/pillarjs/send).
