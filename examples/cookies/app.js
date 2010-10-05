
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer(
    // Place default Connect favicon above logger so it is not in
    // the logging output
    express.favicon(),

    // Custom logger format
    express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time' }),

    // Provides req.cookies
    express.cookieDecoder(),

    // Parses x-www-form-urlencoded request bodies (and json)
    express.bodyDecoder()
);

app.get('/', function(req, res){
    if (req.cookies.remember) {
        res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
    } else {
        res.send('<form method="post"><p>Check to <label>'
            + '<input type="checkbox" name="remember"/> remember me</label> '
            + '<input type="submit" value="Submit"/>.</p></form>');
    }
});

app.get('/forget', function(req, res){
    res.clearCookie('remember');
    res.redirect('back');
});

app.post('/', function(req, res){
    if (req.body.remember) {
        res.cookie('remember', '1', { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
    }
    res.redirect('back');
});

app.listen(3000);
console.log('Express started on port 3000');