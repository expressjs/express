
# req

  Request prototype.

# req.get

  Return request header.
  
  The `Referrer` header field is special-cased,
  both `Referrer` and `Referer` are interchangeable.
  
  ## Examples
  
      req.get('Content-Type');
      // => "text/plain"
      
      req.get('content-type');
      // => "text/plain"
      
      req.get('Something');
      // => undefined
  
  Aliased as `req.header()`.

# req.accepts()

  Check if the given `type(s)` is acceptable, returning
  the best match when true, otherwise `undefined`, in which
  case you should respond with 406 "Not Acceptable".
  
  The `type` value may be a single mime type string
  such as "application/json", the extension name
  such as "json", a comma-delimted list such as "json, html, text/plain",
  or an array `["json", "html", "text/plain"]`. When a list
  or array is given the _best_ match, if any is returned.
  
  ## Examples
  
      // Accept: text/html
      req.accepts('html');
      // => "html"
  
      // Accept: text/*, application/json
      req.accepts('html');
      // => "html"
      req.accepts('text/html');
      // => "text/html"
      req.accepts('json, text');
      // => "json"
      req.accepts('application/json');
      // => "application/json"
  
      // Accept: text/*, application/json
      req.accepts('image/png');
      req.accepts('png');
      // => undefined
  
      // Accept: text/*;q=.5, application/json
      req.accepts(['html', 'json']);
      req.accepts('html, json');
      // => "json"

# req.acceptsCharset()

  Check if the given `charset` is acceptable,
  otherwise you should respond with 406 "Not Acceptable".

# req.acceptsLanguage()

  Check if the given `lang` is acceptable,
  otherwise you should respond with 406 "Not Acceptable".

# req.param()

  Return the value of param `name` when present or `defaultValue`.
  
   - Checks route placeholders, ex: _/user/:id_
   - Checks body params, ex: id=12, {"id":12}
   - Checks query string params, ex: ?id=12
  
  To utilize request bodies, `req.body`
  should be an object. This can be done by using
  the `connect.bodyParser()` middleware.

# req.is()

  Check if the incoming request contains the "Content-Type" 
  header field, and it contains the give mime `type`.
  
  ## Examples
  
       // With Content-Type: text/html; charset=utf-8
       req.is('html');
       req.is('text/html');
       req.is('text/*');
       // => true
      
       // When Content-Type is application/json
       req.is('json');
       req.is('application/json');
       req.is('application/*');
       // => true
      
       req.is('html');
       // => false

