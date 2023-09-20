var express = require('express')
var router = express.Router()
const pool = require('../dal')
const authMiddleware = require('./authMiddleware')
router.use(authMiddleware)

router.get('/', async function(req, res) {
    try {
        const [orders] = await pool.query('SELECT * FROM Orders')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', async function(req, res) {
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

router.get('/recent', async function(req, res) {
    try {
        const userId = req.user.userId
        
        const [order] = await pool.query('SELECT * FROM Orders WHERE userId = ? ORDER BY orderID DESC LIMIT 1', [userId])
        
        if (order && order.length) {
            res.json(order[0])
        } else {
            res.status(404).json({ error: 'No recent orders found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/user/:userId', async function(req, res) {
    const userId = req.params.userId

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' })
    }

    try {
        const [orders] = await pool.query('SELECT * FROM Orders WHERE userId = ?', [userId])
        if (orders.length) {
            res.json(orders)
        } else {
            res.status(404).json({ message: 'No orders found for this user.' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders for the user' })
    }
})

module.exports = router