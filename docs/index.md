
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

## More Information

  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * Annotated source [documentation](api.html)
  * View the [Connect](http://github.com/senchalabs/connect) repo for middleware usage
  * View the [Connect Wiki](http://wiki.github.com/senchalabs/connect/) for contrib middleware
  * View the [examples](http://github.com/visionmedia/express/tree/master/examples/)
  * View the [source](http://github.com/visionmedia/express)

## Apps Using Express

  * [wtfjs](http://wtfjs.com/) - JavaScript WTFs :)
  * [Node Knockout](http://nodeknockout.com/) - node knockout competition site
  * [Node News](http://nodejs.se/) - node news aggregator
  * [Code Shelver](http://codeshelver.com/) - GitHub watch list app
  * [Clickdummy](http://clickdummy.net/) - Fast prototyping for designers
  * [E-Resistible](http://e-resistible.co.uk) - Online takeaway ordering app 
  * [Storify](http://storify.com) - The future of publishing
  * [Ogre](http://ogre.adc4gis.com/) - Translates spatial files into GeoJSON
