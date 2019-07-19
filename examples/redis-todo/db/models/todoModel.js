const mongoose = require('mongoose')
const { Schema, model } = mongoose

const todoSchema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Types.ObjectId, required: true }
}, { timestamps: true, versionKey: false })

module.exports = model('Todo', todoSchema)
