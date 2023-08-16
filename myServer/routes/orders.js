var express = require('express')
var router = express.Router()

/* GET orders listing. */
router.get('/', function(req, res, next) {
  res.send('List of all orders')
})

router.get('/', function(req, res) {
    res.json({ orders })
})

module.exports = router