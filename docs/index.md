
<p id="tagline">
   High performance, high class web development for
  <a href="http://nodejs.org">Node.js</a>
</p>

    var app = module.exports = express.createServer();
    
    app.get('/', function(req, res){
        res.send('Hello World');
    });

## Features

  * Robust routing
  * Focus on high performance
  * View rendering and partials support
  * Environment based configuration
  * Build on [Connect](http://extjs.github.com/Connect)

## Contributors

The following are the major contributors of Express (in no specific order).

  * TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
  * Ciaran Jessup ([ciaranj](http://github.com/ciaranj))
  * Aaron Heckmann ([aheckmann](http://github.com/aheckmann))