const express = require('express')
const productsRouter = require('./routes/products')

const app = express()
const PORT = 5000

app.use('/api/products', productsRouter)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})