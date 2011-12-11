
/**
 * Module dependencies.
 */
var format = require('util').format
  , messages = require('express-messages');


module.exports = function(req, res, next){
  // access the app without passing it into
  // this file explicitly
  var app = req.app;

  // while express-messages is still 2.x and 
  // req.flash() is a 2.x thing we roll our own 
  // for now (ported from ye olde req.notify).
  req.flash = function(type, msg){
    var sess = this.session;
    if (null == sess) throw Error('req.notify() requires sessions');
    var msgs = sess.notifications = sess.notifications || {};
  
    switch (arguments.length) {
      // flush all messages
      case 0:
        sess.notifications = {};
        return msgs
      // flush messages for a specific type
      case 1:
        var arr = msgs[type];
        delete msgs[type];
        return arr || [];
      // set notification message
      default:
        var args = Array.prototype.slice.call(arguments,1);
        msg = format.apply({},args);
        return (msgs[type] = msgs[type] || []).push(msg);
    }
  };

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