<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
-->

<h3 id='req.signedCookies'>req.signedCookies</h3>

When using [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware, this property
contains signed cookies sent by the request, unsigned and ready for use. Signed cookies reside
in a different object to show developer intent; otherwise, a malicious attack could be placed on
`req.cookie` values (which are easy to spoof). Note that signing a cookie does not make it "hidden"
or encrypted; but simply prevents tampering (because the secret used to sign is private).

If no signed cookies are sent, the property defaults to `{}`.

{% highlight js %}
// Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
req.signedCookies.user
// => "tobi"
{% endhighlight %}

For more information, issues, or concerns, see [cookie-parser](https://github.com/expressjs/cookie-parser).
