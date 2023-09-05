const express = require('express')
const router = express.Router()
const pool = require('./dal')

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit
    let query = 'SELECT * FROM Products'
    
    if (limit) {
      query += ' ORDER BY productID DESC LIMIT ?'
    }

    const [products] = await pool.query(query, [parseInt(limit)])
    console.log(products)
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router