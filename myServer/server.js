const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const usersRouter = require('./routes/users')
//const ordersRouter = require('./routes/orders')

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors())
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
//app.use('/api/orders', ordersRouter)

const cookieParser = require('cookie-parser')
app.use(cookieParser())

module.exports = app