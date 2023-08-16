var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

router.get('/details', function(req, res, next) {
  res.send('User details endpoint')
})

router.get('/', function(req, res) {
  const { age } = req.query
  if (age) {
      const filteredUsers = users.filter(user => user.age === parseInt(age, 10))
      return res.json({ users: filteredUsers })
  }
  res.json({ users })
})

router.get('/:id', function(req, res) {
  const user = users.find(u => u.id === parseInt(req.params.id, 10))
  if (!user) {
      return res.status(404).json({ error: 'User not found.' })
  }
  res.json({ user })
})

router.post('/', function(req, res) {
  const { name, age, email } = req.body
  if (!name || !age || !email) {
      return res.status(400).json({ error: 'All fields are required.' })
  }
  const newUser = {
      id: users.length + 1,
      name,
      age,
      email
  }
  users.push(newUser);
  res.status(201).json({ message: 'User created successfully.', user: newUser })
})

module.exports = router
