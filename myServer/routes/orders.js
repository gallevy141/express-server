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


router.post('/', function(req, res) {
    const { userId, product, amount } = req.body
    if (!userId || !product || !amount) {
        return res.status(400).json({ error: 'All fields are required.' })
    }
    const newOrder = {
        id: orders.length + 1,
        userId,
        product,
        amount
    }
    orders.push(newOrder);
    res.status(201).json({ message: 'Order created successfully.', order: newOrder })
})
module.exports = router