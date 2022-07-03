var isEmptyString = function (str) {
  return str === undefined || str === null || str.trim() === "";
};
var throwIfEmpty = function (str, field) {
  if (isEmptyString(str))
    throw new Error("field '" + field + "' should not be empty");
};

function Note(title, content, createdAt, updatedAt, id) {
  throwIfEmpty(title, "title");

  this.id = id;
  this.title = title;
  this.content = content;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
}

Note.prototype.setId = function (id) {
  this.id = id;
};

Note.prototype.setTitle = function (title) {
  throwIfEmpty(title, "title");
  this.title = title;
};

Note.prototype.setContent = function (content) {
  this.content = content;
};

Note.prototype.setCreatedAt = function (createdAt) {
  this.createdAt = createdAt;
};

Note.prototype.setUpdatedAt = function (updatedAt) {
  this.updatedAt = updatedAt;
};

module.exports = Note;
