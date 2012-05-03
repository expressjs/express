
var express = require('../..')
  , User = require('./user')
  , app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

// filter ferrets only

function ferrets(user) {
  return user.species == 'ferret';
}

// naive nesting approach,
// delegating errors to next(err)
// in order to expose the "count"
// and "users" locals

app.get('/', function(req, res, next){
  User.count(function(err, count){
    if (err) return next(err);
    User.all(function(err, users){
      if (err) return next(err);
      res.render('user', {
        title: 'Users',
        count: count,
        users: users.filter(ferrets)
      });
    })
  })
});




// this approach is cleaner,
// less nesting and we have
// the variables available
// on the request object

function count(req, res, next) {
  User.count(function(err, count){
    if (err) return next(err);
    req.count = count;
    next();
  })
}

function users(req, res, next) {
  User.all(function(err, users){
    if (err) return next(err);
    req.users = users;
    next();
  })
}

app.get('/middleware', count, users, function(req, res, next){
  res.render('user', {
    title: 'Users',
    count: req.count,
    users: req.users.filter(ferrets)
  });
});




// this approach is much like the last
// however we're explicitly exposing
// the locals within each middleware
// 
// note that this may not always work
// well, for example here we filter
// the users in the middleware, which
// may not be ideal for our application.
// so in that sense the previous example
// is more flexible with `req.users`.

function count2(req, res, next) {
  User.count(function(err, count){
    if (err) return next(err);
    res.locals.count = count;
    next();
  })
}

function users2(req, res, next) {
  User.all(function(err, users){
    if (err) return next(err);
    // this would not be ideal for *this*
    res.locals.users = users.filter(ferrets);
    next();
  })
}

app.get('/middleware-locals', count2, users2, function(req, res, next){
  // you can see now how we have much less
  // to pass to res.render(). If we have
  // several routes related to users this
  // can be a great productivity booster
  res.render('user', { title: 'Users' });
});


// let's assume we wanted to load the users
// and count for every res.render() call, we
// could use app.locals.use() for this. These
// are callbacks which run in parallel ONLY
// when res.render() is invoked. If no views
// are rendered, there is no overhead.

// This may be ideal if you want to load auxiliary
// user information, but only for templates. Note
// that (req, res) are available to you, so you may
// access req.session.user etc.

// Keep in mind these execute in *parallel*, so these
// callbacks should not depend on each other, this
// also makes them slightly more efficient than
// using middleware which execute sequentially

app.locals.use(count2);
app.locals.use(users2);

app.get('/locals', function(req, res){
  res.render('user', { title: 'Users' });
});

app.listen(3000);
console.log('Application listening on port 3000');