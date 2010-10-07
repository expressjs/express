
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express'),
    crypto = require('crypto');

var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session());

// Message helper, ideally we would use req.flash()
// however this is more light-weight for an example

app.dynamicHelpers({
    message: function(req){
        var err = req.session.error,
            msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        if (err) return '<p class="msg error">' + err + '</p>';
        if (msg) return '<p class="msg success">' + msg + '</p>';
    }
});

// Generate a salt for the user to prevent rainbow table attacks

var users = {
    tj: {
        name: 'tj',
        salt: 'randomly-generated-salt',
        pass: md5('foobar' + 'randomly-generated-salt')
    }
};

// Used to generate a hash of the plain-text password + salt

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the md5 against the pass / salt, if there is a match we
    // found the user
    if (user.pass == md5(pass + user.salt)) return fn(null, user);
    // Otherwise password is invalid
    fn(new Error('invalid password'));
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

function accessLogger(req, res, next) {
    console.log('/restricted accessed by %s', req.session.user.name);
    next();
}

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/restricted', restrict, accessLogger, function(req, res){
    res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('home');
    });
});

app.get('/login', function(req, res){
    if (req.session.user) {
        req.session.success = 'Authenticated as ' + req.session.user.name
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/restricted">/restricted</a>.';
    }
    res.render('login');
});

app.post('/login', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation 
            req.session.regenerate(function(){
                // Store the user's primary key 
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "tj" and "foobar")';
            res.redirect('back');
        }
    });
});

app.listen(3000);
console.log('Express started on port 3000');