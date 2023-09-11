var express = require('express')
var router = express.Router()
const pool = require('./dal')
const authMiddleware = require('./authMiddleware')

router.get('/', async function(req, res) {
    router.use(authMiddleware)
    try {
        const [orders] = await pool.query('SELECT * FROM Orders')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', async function(req, res) {
    router.use(authMiddleware)
    const { userId, product, amount } = req.body

    if (!userId || !product || !amount) {
        return res.status(400).json({ error: 'All fields are required.' })
    }
    try {
        const result = await pool.query('INSERT INTO Orders (userId, product, amount) VALUES (?, ?, ?)', [userId, product, amount])
        res.status(201).json({ message: 'Order created successfully.', orderID: result.insertId })
    } catch (error) {
        res.status(500).json({ error: 'Error creating order' })
    }
})

module.exports = router