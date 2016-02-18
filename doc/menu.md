<!---
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT 
-->

<ul id="menu">

    <li id="express-api"><a href="#express">express()</a>
    <ul id="express-menu">
        <li><em>Methods</em></li>
        <li id="express-static-middleware"><a href="#express.static">express.static()</a></li>
        <li id="express-router"><a href="#express.router">express.Router()</a></li>
    </ul>
    </li>

    <li id="app-api"><a href="#app">Application</a>
        <ul id="app-menu">
            <li><em>Properties</em>
            </li>
            <li><a href="#app.locals">app.locals</a>
            </li>
            <li><a href="#app.mountpath">app.mountpath</a>
            </li>
            <li><em>Events</em>
            </li>
            <li><a href="#app.onmount">mount</a>
            </li>
            <li><em>Methods</em>
            </li>
            <li><a href="#app.all">app.all()</a>
            </li>
            <li><a href="#app.delete.method">app.delete()</a>
            </li>
            <li><a href="#app.disable">app.disable()</a>
            </li>
            <li><a href="#app.disabled">app.disabled()</a>
            </li>
            <li><a href="#app.enable">app.enable()</a>
            </li>
            <li><a href="#app.enabled">app.enabled()</a>
            </li>
            <li><a href="#app.engine">app.engine()</a>
            </li>
            <li><a href="#app.get">app.get()</a>
            </li>
            <li><a href="#app.get.method">app.get()</a>
            </li>
            <li><a href="#app.listen">app.listen()</a>
            </li>
            <li><a href="#app.METHOD">app.METHOD()</a>
            </li>
            <li><a href="#app.param">app.param()</a>
            </li>
            <li><a href="#app.path">app.path()</a>
            </li>
            <li><a href="#app.post.method">app.post()</a>
            </li>
            <li><a href="#app.put.method">app.put()</a>
            </li>
            <li><a href="#app.render">app.render()</a>
            </li>
            <li><a href="#app.route">app.route()</a>
            </li>
            <li><a href="#app.set">app.set()</a>
            </li>
            <li><a href="#app.use">app.use()</a>
            </li>
        </ul>
    </li>
    <li id="req-api"><a href="#req">Request</a>
        <ul id="req-menu">
            <li><em>Properties</em>
            </li>
            <li><a href="#req.app">req.app</a>
            </li>
            <li><a href="#req.baseUrl">req.baseUrl</a>
            </li>
            <li><a href="#req.body">req.body</a>
            </li>
            <li><a href="#req.cookies">req.cookies</a>
            </li>
            <li><a href="#req.fresh">req.fresh</a>
            </li>
            <li><a href="#req.hostname">req.hostname</a>
            </li>
            <li><a href="#req.ip">req.ip</a>
            </li>
            <li><a href="#req.ips">req.ips</a>
            </li>
            <li><a href="#req.method">req.method</a>
            </li>
            <li><a href="#req.originalUrl">req.originalUrl</a>
            </li>
            <li><a href="#req.params">req.params</a>
            </li>
            <li><a href="#req.path">req.path</a>
            </li>
            <li><a href="#req.protocol">req.protocol</a>
            </li>
            <li><a href="#req.query">req.query</a>
            </li>
            <li><a href="#req.route">req.route</a>
            </li>
            <li><a href="#req.secure">req.secure</a>
            </li>
            <li><a href="#req.signedCookies">req.signedCookies</a>
            </li>
            <li><a href="#req.stale">req.stale</a>
            </li>
            <li><a href="#req.subdomains">req.subdomains</a>
            </li>
            <li><a href="#req.xhr">req.xhr</a>
            </li>
            <li><em>Methods</em>
            </li>
            <li><a href="#req.accepts">req.accepts()</a>
            </li>
            <li><a href="#req.acceptsCharsets">req.acceptsCharsets()</a>
            </li>
            <li><a href="#req.acceptsEncodings">req.acceptsEncodings()</a>
            </li>
            <li><a href="#req.acceptsLanguages">req.acceptsLanguages()</a>
            </li>
            <li><a href="#req.get">req.get()</a>
            </li>
            <li><a href="#req.is">req.is()</a>
            </li>
            <li><a href="#req.param">req.param()</a>
            </li>
        </ul>
    </li>
    <li id="res-api"><a href="#res">Response</a>
        <ul id="res-menu">
            <li><em>Properties</em>
            </li>
            <li><a href="#res.app">res.app      </a>
            </li>
            <li><a href="#res.headersSent">res.headersSent</a>
            </li>
            <li><a href="#res.locals">res.locals</a>
            </li>
            <li><em>Methods</em>
            </li>
            <li><a href="#res.append">res.append()</a>
            </li>
            <li><a href="#res.attachment">res.attachment()</a>
            </li>
            <li><a href="#res.cookie">res.cookie()</a>
            </li>
            <li><a href="#res.clearCookie">res.clearCookie()</a>
            </li>
            <li><a href="#res.download">res.download()</a>
            </li>
            <li><a href="#res.end">res.end()</a>
            </li>
            <li><a href="#res.format">res.format()</a>
            </li>
            <li><a href="#res.get">res.get()</a>
            </li>
            <li><a href="#res.json">res.json()</a>
            </li>
            <li><a href="#res.jsonp">res.jsonp()</a>
            </li>
            <li><a href="#res.links">res.links()</a>
            </li>
            <li><a href="#res.location">res.location()</a>
            </li>
            <li><a href="#res.redirect">res.redirect()</a>
            </li>
            <li><a href="#res.render">res.render()</a>
            </li>
            <li><a href="#res.send">res.send()</a>
            </li>
            <li><a href="#res.sendFile">res.sendFile()</a>
            </li>
            <li><a href="#res.sendStatus">res.sendStatus()</a>
            </li>
            <li><a href="#res.set">res.set()</a>
            </li>
            <li><a href="#res.status">res.status()</a>
            </li>
            <li><a href="#res.type">res.type()</a>
            </li>
            <li><a href="#res.vary">res.vary()</a>
            </li>
        </ul>
    </li>
    <li id="router-api"><a href="#router">Router</a>
        <ul id="router-menu">
            <li><em>Methods</em>
            </li>
            <li><a href="#router.all">router.all()</a>
            </li>
            <li><a href="#router.METHOD">router.METHOD()</a>
            </li>
            <li><a href="#router.param">router.param()</a>
            </li>
            <li><a href="#router.route">router.route()</a>
            </li>
            <li><a href="#router.use">router.use()</a>
            </li>
        </ul>
    </li>
</ul>
