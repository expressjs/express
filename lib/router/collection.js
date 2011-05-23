
/*!
 * Express - router - Collection
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Expose `Collection`.
 */

module.exports = Collection;

/**
 * Initialize a new route `Collection`
 * with the given `router`.
 * 
 * @param {Router} router
 * @api private
 */

function Collection(router) {
  Array.apply(this, arguments);
  this.router = router;
}

/**
 * Inherit from `Array.prototype`.
 */

Collection.prototype.__proto__ = Array.prototype;

/**
 * Remove the routes in this collection.
 *
 * @return {Collection} of routes removed
 * @api public
 */

Collection.prototype.remove = function(){
  var router = this.router
    , len = this.length
    , ret = new Collection(this.router);

  for (var i = 0; i < len; ++i) {
    if (router.remove(this[i])) {
      ret.push(this[i]);
    }
  }

  return ret;
};

