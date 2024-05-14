'use strict';

/**
 * Module dependencies.
 */

var express = require('../..');
var hash = require('pbkdf2-password')();
var path = require('path');
var session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

var app = module.exports = express();

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);
app.use(helmet());

// Session-persisted message middleware

app.use(function(req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

// dummy database

var users = {
    tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash({ password: 'foobar' }, function(err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.tj.salt = salt;
    users.tj.hash = hash;
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(null, null);
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: user.salt }, function(err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user);
        fn(null, null);
    });
}

function generateSecretKey() {
    return speakeasy.generateSecret({ length: 20 }).base32;
}

function generateQRCode(secretKey, username) {
    const otpAuthUrl = speakeasy.otpauthURL({
        secret: secretKey,
        label: username,
        issuer: 'YourAppName',
    });
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(otpAuthUrl, (err, imageUrl) => {
            if (err) {
                reject(err);
            } else {
                resolve(imageUrl);
            }
        });
    });
}

function restrict(req, res, next) {
    if (req.session.user) {
        if (req.session.user.mfaEnabled) {
            // MFA enabled for the user, require MFA verification
            res.render('mfa-authentication');
        } else {
            // MFA not enabled, proceed with regular authentication
            next();
        }
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res) {
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function() {
        res.redirect('/');
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', function(req, res, next) {
    authenticate(req.body.username, req.body.password, function(err, user) {
        if (err) return next(err);
        if (user) {
            if (user.mfaEnabled) {
                // MFA enabled for the user
                // Generate secret key and QR code
                const secretKey = generateSecretKey();
                const qrCodeImageUrl = generateQRCode(secretKey, user.username);
                // Store the secret key in the user's session
                req.session.secretKey = secretKey;
                // Render the MFA setup page
                res.render('mfa-setup', { qrCodeImageUrl });
            } else {
                // MFA not enabled, proceed with regular login
                req.session.regenerate(function() {
                    req.session.user = user;
                    req.session.success = 'Authenticated as ' + user.name +
                        ' click to <a href="/logout">logout</a>. ' +
                        ' You may now access <a href="/restricted">/restricted</a>.';
                    res.redirect('back');
                });
            }
        } else {
            req.session.error = 'Authentication failed, please check your ' +
                ' username and password.' +
                ' (use "tj" and "foobar")';
            res.redirect('/login');
        }
    });
});

app.post('/mfa/authenticate', function(req, res) {
    const mfaCode = req.body.mfaCode;
    const secretKey = users[req.session.user.username].secretKey;
    const isVerified = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token: mfaCode
    });
    if (isVerified) {
        req.session.success = 'Multi-Factor Authentication successful!';
        res.redirect('/restricted');
    } else {
        req.session.error = 'Invalid verification code. Please try again.';
        res.redirect('/login');
    }
});

app.post('/mfa/setup', function(req, res) {
    const mfaCode = req.body.mfaCode;
    const secretKey = req.session.secretKey;
    const isVerified = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token: mfaCode
    });
    if (isVerified) {
        // MFA setup successful, enable MFA for the user
        users[req.session.user.username].mfaEnabled = true;
        req.session.user.mfaEnabled = true;
        req.session.success = 'Multi-Factor Authentication setup successful!';
        res.redirect('/restricted');
    } else {
        req.session.error = 'Invalid verification code. MFA setup failed.';
        res.redirect('/login');
    }
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}
