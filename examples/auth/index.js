'use strict';

const express = require('express');
const session = require('express-session');
const path = require('path');
const pbkdf2 = require('pbkdf2-password');
const app = express();

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware
app.use((req, res, next) => {
  res.locals.message = '';
  if (req.session.error) {
    res.locals.message = `<p class="msg error">${req.session.error}</p>`;
    delete req.session.error;
  } else if (req.session.success) {
    res.locals.message = `<p class="msg success">${req.session.success}</p>`;
    delete req.session.success;
  }
  next();
});

// Dummy database
const users = {
  tj: {
    name: 'tj'
  }
};

// Password hashing utility
const hasher = pbkdf2();

// Hash and store the initial password 'foobar'
hasher({ password: 'foobar' }, (err, pass, salt, hash) => {
  if (err) throw err;
  users.tj.salt = salt;
  users.tj.hash = hash;
});

// Authentication function
function authenticate(username, password, callback) {
  const user = users[username];
  if (!user) return callback(null, null);

  hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) return callback(err);
    if (hash === user.hash) {
      return callback(null, user);
    } else {
      return callback(null, null);
    }
  });
}

// Restrict middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/restricted', restrict, (req, res) => {
  res.send(`Wahoo! restricted area, click to <a href="/logout">logout</a>`);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      req.session.error = 'Internal server error during authentication.';
      return res.redirect('/login');
    }

    if (user) {
      req.session.regenerate(() => {
        req.session.user = user;
        req.session.success = `Authenticated as ${user.name}. Click to <a href="/logout">logout</a>. You may now access <a href="/restricted">/restricted</a>.`;
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed. Please check your username and password.';
      res.redirect('/login');
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
