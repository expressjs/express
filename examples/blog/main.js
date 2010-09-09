
// in ./app.js we did "module.exports", allowing
// us to grab the app from the parent module (the one 
// which required it)
var app = module.parent.exports;

app.get('/', function(req, res){
    res.send('<p>Visit <a href="/blog">/blog</a>'
        + ' or <a href="/contact">/contact</a></p>');
});
