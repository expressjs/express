
module.exports = require('supertest');
module.exports.Test.prototype.unset = function (field) {
  this.request().removeHeader(field);
  return this;
};