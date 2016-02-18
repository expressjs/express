<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.acceptsLanguages'>req.acceptsLanguages(lang [, ...])</h3>

Returns the first accepted language of the specified languages,
based on the request's `Accept-Language` HTTP header field.
If none of the specified languages is accepted, returns `false`.

For more information, or if you have issues or concerns, see [accepts](https://github.com/expressjs/accepts).
