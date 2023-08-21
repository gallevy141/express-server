const express = require('express')
const router = express.Router()
const pool = require('../dal')

router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM Products')
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router