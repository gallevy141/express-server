var express = require('express')
var router = express.Router()

// Simulated database
const users = []

router.post('/register', (req, res, next) => {
  const { username, password, email } = req.body;

  const userId = new Date().toISOString() 

  users.push({ userId, username, password, email })

  res.json({ userId, message: 'User registered successfully.' })
})

module.exports = router