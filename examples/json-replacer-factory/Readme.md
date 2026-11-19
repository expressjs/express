# Response-specific JSON replacer factory

This proposed setting centralizes application-defined response serialization.
It is an alternative API to the request-context proposal in
https://github.com/expressjs/express/pull/3981 and was implemented independently.

Run `node examples/json-replacer-factory` from the repository root. Visit
`http://localhost:3000/?language=fr` to receive `{"message":"Bonjour"}`, or
`http://localhost:3000/` to receive `{"message":"Hello"}`. The JSONP example is
`http://localhost:3000/jsonp?language=fr&callback=cb`.

## What the formatter does

The flow is: a request arrives, `factory(req, res)` creates that response's
replacer, native JSON serialization calls the replacer for the root and its
properties, and Express sends the formatted bytes through its existing response
pipeline. The factory runs once; the returned replacer runs as often as native
JSON serialization needs it.

The `/rag` route uses an illustrative object with a large integer document ID and
a `Map` of source scores. One shared formatter converts the ID to a string
without losing precision and turns the map into a JSON object. Requesting
`/rag?sources=omit` omits sources for that response. The next request still gets
its sources. This demonstrates reusable response serialization; the route does
not repeat conversion code.

The formatter does not validate an LLM's output schema, repair malformed model output, fetch
documents, or standardize application-specific shapes automatically. Those
decisions belong to the application. Middleware and explicit normalization
functions can already implement response-specific policies; the proposed core
setting centralizes configuration and shares the normal JSON/JSONP send paths.

## Proposed setting

`app.set('json replacer factory', factory)` calls `factory(req, res)` once for each
`res.json()`, `res.jsonp()`, or `res.send(object)` serialization. Return a regular
JSON replacer function, an array of property names, `null`, or `undefined`.
The returned function retains native `JSON.stringify` behavior: `this` is the
holder object, and `toJSON` runs before the replacer. Close over `req` or `res`
when the replacer needs response-specific context.

A configured factory takes precedence over `json replacer`. Returning `null` or
`undefined` chooses native serialization without a replacer. Leaving the factory
unset, or setting it to `null` or `undefined`, uses the existing `json replacer`
setting. Mounted apps inherit the factory and can override or disable it locally.
The factory runs synchronously. Invalid factory settings or return values throw
a `TypeError`; factory and replacer errors reach ordinary Express error middleware
before the response is sent. Successful serialization still follows the existing
JSON escaping, indentation, JSONP, headers, ETag and HEAD response paths.

Application settings and payload objects are not modified by the resolver.
Existing code without this setting keeps its previous behavior. The proposal
reserves the new setting name; it is not a released or approved Express API.

## Local validation

Run `npm test -- --reporter dot` and `npm run lint`. Focused tests are in
`test/res.jsonReplacerFactory.js`. The unmodified base fails the new behavior
checks, while retaining the legacy controls.
