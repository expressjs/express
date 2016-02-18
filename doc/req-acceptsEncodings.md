<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.acceptsEncodings'>req.acceptsEncodings(encoding [, ...])</h3>

Returns the first accepted encoding of the specified encodings,
based on the request's `Accept-Encoding` HTTP header field.
If none of the specified encodings is accepted, returns `false`.

For more information, or if you have issues or concerns, see [accepts](https://github.com/expressjs/accepts).
