<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.acceptsCharsets'>req.acceptsCharsets(charset [, ...])</h3>

Returns the first accepted charset of the specified character sets,
based on the request's `Accept-Charset` HTTP header field.
If none of the specified charsets is accepted, returns `false`.

For more information, or if you have issues or concerns, see [accepts](https://github.com/expressjs/accepts).
