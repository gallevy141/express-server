const express = require('express')
const router = express.Router()
const pool = require('../dal')


router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const [items] = await pool.query('SELECT * FROM Cart WHERE userID = ?', [userId])
        res.json(items)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})


router.post('/:userId/add', async (req, res) => {
    const { userId } = req.params
    const { productId, quantity } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM Cart WHERE userID = ? AND productID = ?', [userId, productId])
        if (existing.length) {
            await pool.query('UPDATE Cart SET quantity = quantity + ? WHERE userID = ? AND productID = ?', [quantity, userId, productId])
        } else {
            await pool.query('INSERT INTO Cart (userID, productID, quantity) VALUES (?, ?, ?)', [userId, productId, quantity])
        }
        res.status(200).json({ message: 'Product added/updated in cart' })
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

router.delete('/:userId/remove/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await pool.query('DELETE FROM Cart WHERE userID = ? AND productID = ?', [userId, productId])
        res.status(200).json({ message: 'Product removed from cart' })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router