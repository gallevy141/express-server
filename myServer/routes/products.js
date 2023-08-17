var express = require('express')
var router = express.Router()

// Simulated database for products
const products = []

router.get('/', (req, res, next) => {
  res.json({ products })
})

router.get('/:productid', (req, res, next) => {
    const product = products.find(p => p.productId === req.params.productid)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Product not found.' })
    }
  })