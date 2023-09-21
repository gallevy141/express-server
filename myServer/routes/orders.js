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
    const { userId, cartItems, deliveryAddress } = req.body

    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'userId and cartItems fields are required.' })
    }
    
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            'INSERT INTO Orders (userId, totalPrice, deliveryAddress, date) VALUES (?, ?, ?, NOW())',
            [userId, totalPrice, deliveryAddress]
        )
        
        const orderId = orderResult.insertId

        for (let item of cartItems) {
            await connection.query(
                'INSERT INTO OrderDetails (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.productID, item.quantity, item.price]
            )
        }

        await connection.commit()

        res.status(201).json({ success: true, message: 'Order created successfully.', orderID: orderId })
    } catch (error) {
        await connection.rollback()
        res.status(500).json({ error: 'Error creating order' })
    } finally {
        connection.release()
    }
})

router.get('/recent', async function(req, res) {
    try {
        const userId = req.user.userId
        const [orders] = await pool.query('SELECT * FROM Orders WHERE userID = ? ORDER BY orderID DESC LIMIT 1', [userId])
        
        if (orders && orders.length) {
            const recentOrder = orders[0]

            const [orderDetails] = await pool.query(`
                SELECT od.productID, od.quantity, od.price, p.name 
                FROM OrderDetails od
                JOIN Products p ON od.productID = p.productID
                WHERE od.orderID = ?
            `, [recentOrder.orderID])

            recentOrder.products = orderDetails

            res.json(recentOrder)
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