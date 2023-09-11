const express = require('express')
const router = express.Router()
const pool = require('./dal')
const bcrypt = require('bcrypt')
const { encrypt } = require('../cryptoUtil')
const crypto = require('crypto')

router.post('/register', async (req, res, next) => {
    console.log("Received request with body:", req.body)
    const { name, password, email } = req.body

    if (!name || !password || !email) {
        return res.status(400).json({ error: 'All fields are required!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [existingUsers] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
    console.log("Existing users with email:", existingUsers)
    if (existingUsers.length) {
        return res.status(400).json({ error: 'User with this email already exists!' })
    }

    try {
        const result = await pool.query('INSERT INTO User (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword])
        console.log("Insertion result:", result)

        const encryptedData = encrypt(JSON.stringify({ userId: result.insertId, name: name }))
        res.cookie('userData', encryptedData, { httpOnly: true })
        res.json({ userId: result.insertId, name: name, token: 'simulated_token', message: 'User registered successfully.' })

    } catch (error) {
        res.status(500).json({ error: 'Error registering user' })
    }
})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    
    try {
        const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
        const user = users[0];

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.userID
            req.session.username = user.name
            res.cookie('userData', encryptedData, { httpOnly: true })
            res.json({ userId: user.userID, name: user.name, message: 'Login successful.' })
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
            });
        } else {
            res.status(404).json({ message: 'User not found.' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' })
    }
})

router.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body

    const token = crypto.randomBytes(20).toString('hex')

    await pool.query('UPDATE User SET resetToken = ?, resetTokenExp = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?', [token, email])

    // Send email containing the link with the token
    const mailOptions = {
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: 
        http://localhost:3000/reset-password?token=${token}` //replace with actual link once page created
    }

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            res.status(500).json({ error: 'Error sending email' })
        } else {
            res.json({ message: 'Password reset email sent!' })
        }
    })
})

router.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body

    const [users] = await pool.query('SELECT * FROM User WHERE resetToken = ? AND resetTokenExp > NOW()', [token])
    const user = users[0]

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query('UPDATE User SET password = ?, resetToken = NULL, resetTokenExp = NULL WHERE userID = ?', [hashedPassword, user.userID])

    res.json({ message: 'Password reset successfully!' })
})

router.post('/api/counter/increment', (req, res) => {
    if(!req.session.counter) {
        req.session.counter = 0
    }
    req.session.counter++
    res.json({ counter: req.session.counter })
})

router.post('/api/counter/decrement', (req, res) => {
    if(!req.session.counter) {
        req.session.counter = 0
    }
    req.session.counter--
    res.json({ counter: req.session.counter })
})

router.post('/logout', (req, res) => {
    res.cookie('userData', encryptedData, { httpOnly: true })
    const encryptedData = encrypt(JSON.stringify({ userId: user.userID, name: user.name }))
    req.session.destroy(err => {
        if (err) return res.status(500).send('Could not log out.')
        res.clearCookie('connect.sid')
        res.json({ message: 'Logged out.' })
    })
})

module.exports = router