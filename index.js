
module.exports = process.env.EXPRESS_COV
  ? require('./lib-cov/express')
  : require('./lib/express');