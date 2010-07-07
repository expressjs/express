
<p id="tagline">
   High performance, high class web development for
  <a href="http://nodejs.org">Node.js</a>
</p>

    var app = express.createServer();
    
    app.get('/', function(req, res){
        res.send('Hello World');
    });