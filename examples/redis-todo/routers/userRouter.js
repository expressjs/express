const Router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../db/models/userModel')
const Todo = require('../db/models/todoModel')
const auth = require('../middleware/auth')

/* @public
 * @func: create new user
 * @input: username,name,email and password
 * @return: created user
 */
Router.post('/create', async (req, res) => {
  try {
    const userData = req.body
    const user = new User(userData)
    // hash passowrd
    user.password = await User.hashPassword(user.password)
    // gen auth token
    const token = await user.genAuthToken()

    await user.save()
    res.status(201).json({ token })
  } catch (err) {
    res.status(501).send('Server Error: ' + err)
  }
})

/* @public
 * @func: login user
 * @input: user/email, password
 * @return: auth token
 */
Router.post('/login', async ({ body }, res) => {
  try {
    console.log(body)
    const user = await User.findOne({ $or: [{ email: body.email }, { username: body.username }] })
    if (!user) return res.status(404).send({ msg: 'Invlid Crendtial' })

    console.log(user)
    const isPassword = await bcrypt.compare(body.password, user.password)
    if (!isPassword) return res.status(404).send({ msg: 'Invlaid Credential' })

    const token = user.genAuthToken()
    res.status(201).json({ token })
  } catch (err) {
    console.log(err)
    res.status(501).send('Server Error: ' + err)
  }
})

/* @private
 * @func: edit user
 * @input: name, password
 * @return: edited user
 */
Router.post('/update', auth, async ({ userId, body }, res) => {
  try {
    // if password then hast it
    body.password && (body.password = await User.hashPassword(body.password))

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { ...body },
      { new: true })

    res.status(200).json({ user: updatedUser })
  } catch (err) {
    res.status(500).send('Server Error', err)
  }
})

/* @private
 * @func: delete user
 */
Router.delete('/delete', auth, async ({ userId }, res) => {
  try {
    await User.findByIdAndRemove({ _id: userId })
    await Todo.deleteMany({ userId })
    res.status(200).send({ msg: 'User deleted' })
  } catch (err) {
    res.status(501).send('Server Error: ' + err)
  }
})

module.exports = Router
