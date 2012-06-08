
# res

  Response prototype.

# res.status()

  Set status `code`.

# res.send()

  Send a response.
  
  ## Examples
  
      res.send(new Buffer('wahoo'));
      res.send({ some: 'json' });
      res.send('<p>some html</p>');
      res.send(404, 'Sorry, cant find that');
      res.send(404);

# res.json()

  Send JSON response.
  
  ## Examples
  
      res.json(null);
      res.json({ user: 'tj' });
      res.json(500, 'oh noes!');
      res.json(404, 'I dont have that');

# res.sendfile()

  Transfer the file at the given `path`.
  
  Automatically sets the _Content-Type_ response header field.
  The callback `fn(err)` is invoked when the transfer is complete
  or when an error occurs. Be sure to check `res.sentHeader`
  if you wish to attempt responding, as the header and some data
  may have already been transferred.
  
  ## Options
  
    - `maxAge` defaulting to 0
    - `root`   root directory for relative filenames
  
  ## Examples
  
   The following example illustrates how `res.sendfile()` may
   be used as an alternative for the `static()` middleware for
   dynamic situations. The code backing `res.sendfile()` is actually
   the same code, so HTTP cache support etc is identical.
  
      app.get('/user/:uid/photos/:file', function(req, res){
        var uid = req.params.uid
          , file = req.params.file;
      
        req.user.mayViewFilesFrom(uid, function(yes){
          if (yes) {
            res.sendfile('/uploads/' + uid + '/' + file);
          } else {
            res.send(403, 'Sorry! you cant see that.');
          }
        });
      });

# res.download()

  Transfer the file at the given `path` as an attachment.
  
  Optionally providing an alternate attachment `filename`,
  and optional callback `fn(err)`. The callback is invoked
  when the data transfer is complete, or when an error has
  ocurred. Be sure to check `res.headerSent` if you plan to respond.
  
  This method uses `res.sendfile()`.

# res.format()

  Respond to the Acceptable formats using an `obj`
  of mime-type callbacks.
  
  This method uses `req.accepted`, an array of
  acceptable types ordered by their quality values.
  When "Accept" is not present the _first_ callback
  is invoked, otherwise the first match is used. When
  no match is performed the server responds with
  406 "Not Acceptable".
  
  Content-Type is set for you, however if you choose
  you may alter this within the callback using `res.type()`
  or `res.set('Content-Type', ...)`.
  
     res.format({
       'text/plain': function(){
         res.send('hey');
       },
     
       'text/html': function(){
         res.send('<p>hey</p>');
       },
     
       'appliation/json': function(){
         res.send({ message: 'hey' });
       }
     });
  
  In addition to canonicalized MIME types you may
  also use extnames mapped to these types:
  
     res.format({
       text: function(){
         res.send('hey');
       },
     
       html: function(){
         res.send('<p>hey</p>');
       },
     
       json: function(){
         res.send({ message: 'hey' });
       }
     });
  
  By default Express passes an `Error`
  with a `.status` of 406 to `next(err)`
  if a match is not made, however you may
  provide an optional callback `fn` to
  be invoked instead.

# res.attachment()

  Set _Content-Disposition_ header to _attachment_ with optional `filename`.

# res.set

  Set header `field` to `val`, or pass
  an object of header fields.
  
  ## Examples
  
     res.set('Accept', 'application/json');
     res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
  
  Aliased as `res.header()`.

# res.get()

  Get value for header `field`.

# res.clearCookie()

  Clear cookie `name`.

# res.cookie()

  Set cookie `name` to `val`, with the given `options`.
  
  ## Options
  
     - `maxAge`   max-age in milliseconds, converted to `expires`
     - `signed`   sign the cookie
     - `path`     defaults to "/"
  
  ## Examples
  
     // "Remember Me" for 15 minutes
     res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
  
     // save as above
     res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

# res.redirect()

  Redirect to the given `url` with optional response `status`
  defaulting to 302.
  
  The given `url` can also be the name of a mapped url, for
  example by default express supports "back" which redirects
  to the _Referrer_ or _Referer_ headers or "/".
  
  ## Examples
  
     res.redirect('/foo/bar');
     res.redirect('http://example.com');
     res.redirect(301, 'http://example.com');
     res.redirect('../login'); // /blog/post/1 -> /blog/login
  
  ## Mounting
  
    When an application is mounted, and `res.redirect()`
    is given a path that does _not_ lead with "/". For 
    example suppose a "blog" app is mounted at "/blog",
    the following redirect would result in "/blog/login":
  
       res.redirect('login');
  
    While the leading slash would result in a redirect to "/login":
  
       res.redirect('/login');

# res.render()

  Render `view` with the given `options` and optional callback `fn`.
  When a callback function is given a response will _not_ be made
  automatically, otherwise a response of _200_ and _text/html_ is given.
  
  ## Options
   
   - `status`    Response status code (`res.statusCode`)
   - `charset`   Set the charset (`res.charset`)
  
  ## Reserved locals
  
   - `cache`     boolean hinting to the engine it should cache
   - `filename`  filename of the view being rendered

