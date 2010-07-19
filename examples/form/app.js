
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect'),
    sys = require('sys');

var app = express.createServer();

// Here we use the bodyDecoder middleware
// to parse urlencoded request bodies
// which populates req.body
app.use(connect.bodyDecoder());
    
// The methodOverride middleware allows us
// to set a hidden input of _method to an arbitrary
// HTTP method to support app.put(), app.del() etc
app.use(connect.methodOverride());

// Required by session
app.use(connect.cookieDecoder());

// Required by req.flash() for persistent
// notifications
app.use(connect.session());

app.get('/', function(req, res){
    // get ?name=foo
    var name = req.param('name') || '';
    
    // Switch the button label based if we have a name
    var label = name ? 'Update' : 'Save';

    // Buffer all flash messages.
    // Typically this would all be done in a template
    // however for illustration purposes we iterate
    // here.
    
    // The messages in req.flash() persist until called,
    // at which time they are flushed from the session
    var msgs = '<ul>',
        flash = req.flash();
    Object.keys(flash).forEach(function(type){
        flash[type].forEach(function(msg){
            msgs += '<li class="' + type + '">' + msg + '</li>';
        });
    });
    msgs += '</ul>';

    // If we have a name, we are updating,
    // so add the hidden _method input
    res.send(msgs
        + '<form method="post">'
        + (name ? '<input type="hidden" value="put" name="_method" />' : '')
        + 'Name: <input type="text" name="name" value="' + name + '" />'
        + '<input type="submit" value="' + label + '" />'
        + '</form>');
});

app.post('/', function(req, res){
    if (req.body.name) {
        // Typically here we would create a resource
        req.flash('info', 'Saved ' + req.body.name);
        res.redirect('/?name=' + req.body.name);
    } else {
        req.flash('error', 'Error: name required');
        res.redirect('/');
    }
});

app.put('/', function(req, res){
    // Typically here we would update a resource
    req.flash('info', 'Updated ' + req.body.name);
    res.redirect('/?name=' + req.body.name);
});

app.listen(3000);