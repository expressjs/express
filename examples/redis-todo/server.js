const http = require('http')
const express = require('express')

// DB
require('./db')
require('./services/cache')

const app = express()
app.use(express.json())

// morgan test
app.use(require('morgan')('dev'))

// ROUTERS
app.use('/user', require('./routers/userRouter'))
app.use('/todo', require('./routers/todoRouter'))

// Server setup
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server up at PORT:${PORT}`)
})
