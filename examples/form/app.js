
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect'),
    sys = require('sys');

var app = express.createServer(
    // Here we use the bodyDecoder middleware
    // to parse urlencoded request bodies
    // which populates req.body
    connect.bodyDecoder(),
    
    // The methodOverride middleware allows us
    // to set a hidden input of _method to an arbitrary
    // HTTP method to support app.put(), app.del() etc
    connect.methodOverride()
);

app.get('/', function(req, res){
    // get ?name=foo
    var name = req.param('name') || '';
    
    // Switch the button label based if we have a name
    var label = name ? 'Update' : 'Save';

    // If we have a name, we are updating,
    // so add the hidden _method input
    res.send('<form method="post">'
        + (name ? '<input type="hidden" value="put" name="_method" />' : '')
        + 'Name: <input type="text" name="name" value="' + name + '" />'
        + '<input type="submit" value="' + label + '" />'
        + '</form>');
});

app.post('/', function(req, res){
    // Typically here we would create a resource
    sys.puts('saved ' + req.body.name);
    res.redirect('/?name=' + req.body.name);
});

app.put('/', function(req, res){
    // Typically here we would update a resource
    sys.puts('updated ' + req.body.name);
    res.redirect('/?name=' + req.body.name);
});

app.listen(3000);