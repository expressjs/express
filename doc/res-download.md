<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='res.download'>res.download(path [, filename] [, fn])</h3>

Transfers the file at `path` as an "attachment". Typically, browsers will prompt the user for download.
By default, the `Content-Disposition` header "filename=" parameter is `path` (this typically appears in the browser dialog).
Override this default with the `filename` parameter.

When an error ocurrs or transfer is complete, the method calls the optional callback function `fn`.
This method uses [res.sendFile()](#res.sendFile) to transfer the file.

{% highlight js %}
res.download('/report-12345.pdf');

res.download('/report-12345.pdf', 'report.pdf');

res.download('/report-12345.pdf', 'report.pdf', function(err){
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {
    // decrement a download credit, etc.
  }
});
{% endhighlight %}
