var express = require('express')
var router = express.Router()

/* GET orders listing. */
router.get('/', function(req, res, next) {
  res.send('List of all orders')
})

router.get('/', function(req, res) {
    res.json({ orders })
})

router.get('/:id', function(req, res) {
    const order = orders.find(o => o.id === parseInt(req.params.id, 10))
    if (!order) {
        return res.status(404).json({ error: 'Order not found.' })
    }
    res.json({ order })
})

module.exports = router