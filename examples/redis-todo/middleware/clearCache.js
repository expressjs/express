const { clearCache } = require('../services/cache')

module.exports = async (req, res, next) => {
  await next() // call endpoint
  console.log(req.userId)
  clearCache(req.userId)
}
