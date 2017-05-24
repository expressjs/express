<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.ips'>req.ips</h3>

When the [`trust proxy` setting](/4x/api.html#trust.proxy.options.table) does not evaluate to `false`,
this property contains an array of IP addresses
specified in the `X-Forwarded-For` request header. Otherwise, it contains an
empty array. This header can be set by the client or by the proxy.

For example, if `X-Forwarded-For` is `client, proxy1, proxy2`, `req.ips` would be
`["client", "proxy1", "proxy2"]`, where `proxy2` is the furthest downstream.
