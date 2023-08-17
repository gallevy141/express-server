var express = require('express')
var router = express.Router()

// Simulated database for products
const products = []

router.get('/', (req, res, next) => {
  res.json({ products })
})