var local = function(obj){
  for (var key in obj) this.locals[key] = obj[key]
  return this;
};

var use = function(fn){
  if (3 == fn.length) {
    this.__callbacks.push(fn);
  } else {
    this.__callbacks.push(function(req, res, done){
      fn(req, res);
      done();
    });
  }
  return this;
};

exports.init = function(){
  var self = this;
  this.__callbacks = [];
  this.locals = local.bind(this);
  this.locals.use = use.bind(this);
  this.locals.__defineSetter__('callbacks', function(callbacks){
    self.__callbacks = callbacks;
    return self;
  });
  this.locals.__defineGetter__('callbacks', function(){
    return self.__callbacks;
  });
};
