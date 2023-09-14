const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const usersRouter = require('./routes/users')
const ordersRouter = require('./routes/orders')
const authMiddleware = require('./routes/authMiddleware')
const cryptoUtil = require('./cryptoUtil') 
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const cartRoutes = require('./routes/cart')
const app = express()


app.use(express.json())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(session({
  store: new FileStore(),
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 300000 } // 5 min expiration time
}))
app.use(cookieParser(process.env.SECRET_KEY))

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/cart', cartRoutes)
module.exports = app