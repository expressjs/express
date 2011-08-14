
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
  * [express-expose](http://github.com/visionmedia/express-expose) expose objects, functions, modules and more to client-side js
  * [express-params](https://github.com/visionmedia/express-params) app.param() extensions
  * [express-mongoose](https://github.com/LearnBoost/express-mongoose) plugin for easy rendering of Mongoose async Query results 

## More Information

  * \#express on freenode
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Visit the [Wiki](http://github.com/visionmedia/express/wiki)
  * [日本語ドキュメンテーション](http://hideyukisaito.com/doc/expressjs/) by [hideyukisaito](https://github.com/hideyukisaito)
  * [Русскоязычная документация](http://express-js.ru/)
