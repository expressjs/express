const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/redis-todo',
  { useNewUrlParser: true, useCreateIndex: true }
)
