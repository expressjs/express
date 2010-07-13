
### Routing

Express utilizes the HTTP verbs to provide a meaningful, expressive routing API.
For example we may want to render a user's account for the path _/user/12_, this
can be done by defining the route below. The values associated to the named placeholders,
are passed as the _third_ argument, which here we name _params_.

    app.get('/user/:id', function(req, res, params){
		res.send('user ' + params.id);
	});

A route is simple a string which is compiled to a _RegExp_ internally. For example
when _/user/:id_ is compiled, a simplified version of the regexp may look similar to:

    \/user\/([^\/]+)\/?

Literal regular expressions may also be passed for complex uses:

	app.get(/^\/foo(bar)?$/, function(){});

Below are some route examples, and the associated paths that they
may consume:

     "/user/:id"
     /user/12

     "/users/:id?"
     /users/5
     /users

     "/files/*"
     /files/jquery.js
     /files/javascripts/jquery.js

     "/file/*.*"
	 /files/jquery.js
	 /files/javascripts/jquery.js
	
	 "/user/:id/:operation?"
	 /user/1
	 /user/1/edit
	
	 "/products.:format"
	 /products.json
	 /products.xml

	 "/products.:format?"
	 /products.json
	 /products.xml
	 /products

### Passing Route Control

We may pass control to the next _matching_ route, by calling the _fourth_ parameter,
the _next()_ function. When a match cannot be made, control is passed back to Connect.

	app.get('/users/:id?', function(req, res, params){
		if (params.id) {
			// do something
		} else {
			next();
		}
	});
	
	app.get('/users', function(req, res, params){
		// do something else
	});