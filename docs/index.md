## Express

Express is a _high performance_ [Sinatra](http://sinatrarb.com) inspired web framework for [nodejs](http://nodejs.org).

    var app = express.createServer();
    
    app.get('/', function(req, res){
        res.send('Hello World');
    });