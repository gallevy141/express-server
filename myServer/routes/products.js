const express = require('express')
const router = express.Router()
const pool = require('./dal')

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit
    let query = 'SELECT * FROM Products'
    
    if (limit) {
      query += ' ORDER BY productID DESC LIMIT ?'
    } else {
      query += ' ORDER BY productID DESC'
    }

    const values = limit ? [parseInt(limit)] : [];
    const [products] = await pool.query(query, values)
    console.log(products)
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:productId', async (req, res) => {
  try {
      const { productId } = req.params;
      const [product] = await pool.query('SELECT * FROM Products WHERE id = ?', [productId])
      if (product.length) {
          res.json(product[0])
      } else {
          res.status(404).json({ error: 'Product not found' })
      }
  } catch (error) {
      res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router