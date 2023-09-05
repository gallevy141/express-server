const express = require('express')
const router = express.Router();
const pool = require('./dal');
const bcrypt = require('bcrypt')

router.post('/register', async (req, res, next) => {
    const { name, password, email } = req.body

    if (!name || !password || !email) {
        return res.status(400).json({ error: 'All fields are required!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [existingUsers] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
    if (existingUsers.length) {
        return res.status(400).json({ error: 'User with this email already exists!' })
    }

    try {
        await pool.query('INSERT INTO User (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword])
        res.json({ message: 'User registered successfully.' })
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' })
    }
})

router.post('/login', async (req, res, next) => {
    const { name, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM User WHERE name = ?', [name])
        const user = users[0];

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ userId: user.userID, token: 'simulated_token', message: 'Login successful.' })
        } else {
            res.status(400).json({ message: 'Invalid credentials.' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT * FROM User WHERE userID = ?', [req.params.userId])
        const user = users[0]

        if (user) {
            res.json({ 
                userId: user.userID, 
                username: user.name, 
                email: user.email
                // Exclude password for security reasons
            })
        } else {
            res.status(404).json({ message: 'User not found.' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' })
    }
})

module.exports = router