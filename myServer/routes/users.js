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

module.exports = router
