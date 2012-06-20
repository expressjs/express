var express = require('express');
var app = express.createServer();

app.configure(function(){
    var cwd = process.cwd();

    //app.use(express.logger());
    app.use(express.static(cwd + '/public', {maxAge: 86400000}));
    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
    app.set('view engine', 'ejs');
    app.set('views', cwd + '/views/');
    app.set('view options', {complexNames: true});
    app.set('jsDirectory', '/js/');
    app.set('cssDirectory', '/css/');
    app.set('applicationDirectory', '/app/');
    app.set('moduleDirectory', '/modules/');
    app.set('controllerDirectory', '/controllers/');
    app.set('modelDirectory', '/models/');
    app.set('viewDirectory', '/views/');
    app.set('defaultModule', 'index');
    app.set('defaultController', 'index');
    app.set('defaultAction', 'index');
    app.use(express.bodyParser());
    app.use(express.cookieParser('secret'));
    app.use(express.session({secret: 'secret'}));
    app.use(express.methodOverride());
    app.enable('jsonp callback');
    app.enable('view cache');
    app.use(app.router);
});

require('mvc').init(app);

app.all('*', function(req, res) {
    res.send('errror 404', 404);
})

app.listen(8124);