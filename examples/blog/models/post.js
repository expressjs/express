
// Fake data store

var ids = 0
  , db = {};

var Post = exports = module.exports = function Post(title, body) {
  this.id = ++ids;
  this.title = title;
  this.body = body;
};

Post.prototype.update =
Post.prototype.save = function(fn){
  exports.update(this, fn);
};

Post.prototype.destroy = function(fn){
  exports.destroy(this.id, fn);
};

exports.count = function(fn){
  fn(null, Object.keys(db).length);
}

exports.get = function(id, fn){
  fn(null, db[id]);
};

exports.update = function(post, fn){
  fn(null, db[post.id] = db);
};

exports.destroy = function(id, fn) {
  if (db[id]) {
    delete db[id];
    fn();
  } else {
    fn(new Error('post ' + id + ' does not exist'));
  }
};