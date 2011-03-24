
    var app = express.createServer();
    
    app.get('/', function(req, res){
        res.send('Hello World');
    });

    app.listen(3000);

## Features

  * Robust routing
  * Redirection helpers
  * Dynamic view helpers
  * Application level view options
  * Content negotiation
  * Application mounting
  * Focus on high performance
  * View rendering and partials support
  * Environment based configuration
  * Session based flash notifications
  * Built on [Connect](http://github.com/senchalabs/connect)
  * [Executable](executable.html) for generating applications quickly
  * High test coverage

## Contributors

The following are the major contributors of Express (in no specific order).

  * TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
  * Ciaran Jessup ([ciaranj](http://github.com/ciaranj))
  * Aaron Heckmann ([aheckmann](http://github.com/aheckmann))
  * Guillermo Rauch ([guille](http://github.com/guille))

## Third-Party Modules

The following modules compliment or extend Express directly:

  * [express-resource](http://github.com/visionmedia/express-resource) provides resourceful routing
  * [express-messages](http://github.com/visionmedia/express-messages) flash message notification rendering
  * [express-configure](http://github.com/visionmedia/express-configuration) async configuration support (load settings from redis etc)
  * [express-namespace](http://github.com/visionmedia/express-namespace) namespaced routing support

## More Information

  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * View the [Connect](http://senchalabs.github.com/connect) documentation
  * View the [Connect Wiki](http://wiki.github.com/senchalabs/connect/) for contrib middleware
  * View the [examples](http://github.com/visionmedia/express/tree/master/examples/)
  * View the [source](http://github.com/visionmedia/express)
  * View the [contrib guide](contrib.html)
