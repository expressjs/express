
/**
 * Module dependencies.
 */

var messages = require('express-messages');

module.exports = function(req, res, next){
  // access the app without passing it into
  // this file explicitly
  var app = req.app;

  // express-messages returns a function which
  // when called will flush the session-based
  // notification messages as HTML. Because of
  // this "flushing" action it must be a function
  // otherwise any view render would remove the
  // notifications regardless of their delay.
  res.locals.messages = messages(req, res);

  // expose the app's mount-point
  // so that urls can adjust. For example
  // if you run this example /post/add works
  // however if you run the mounting example
  // it adjusts to /blog/post/add
  res.locals.base = '/' == app.route ? '' : app.route;

  // all we wanted to do was assign some view locals
  // so pass control to the next middleware
  next();
};