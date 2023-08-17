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

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ userId: user.userId, token: 'simulated_token', message: 'Login successful.' });
  } else {
    res.status(400).json({ message: 'Invalid credentials.' });
  }
});

router.get('/:userId', (req, res, next) => {
  const user = users.find(u => u.userId === req.params.userId)
  if (user) {
    res.json({ 
      userId: user.userId, 
      username: user.username, 
      email: user.email, 
      password: user.password,
    })
  } else {
    res.status(404).json({ message: 'User not found.' })
  }
})

module.exports = router