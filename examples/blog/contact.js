
// in ./app.js we did "module.exports", allowing
// us to grab the app from the parent module (the one 
// which required it)
var app = module.parent.exports;

app.get('/contact', function(req, res){
    res.send('<p>Wahoo contact page</p>');
});
