const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  try {
    const authToken = req.header('x-auth')
    if (!authToken) return res.status(404).send({ msg: 'AuthToken not found' })

    const decodedValue = jwt.verify(authToken, 'token')
    if (!decodedValue) return res.status(401).send({ msg: 'Invalid Authentication' })

    req.userId = decodedValue.userId
    next()
  } catch (err) {
    res.status(401).send({ msg: 'Invalid Authenication', err })
  }
}
