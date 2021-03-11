const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "it works"
    });
});

router.post('/', (req, res, next) => {
    const order =  new Order ({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
    })
    order.save()
    .then(result => {
        res.status(200).json({
            message: "it works for posts requests",
            orderCreated: {
                id: result._id,
                Product: result.product,
                quantity: result.quantity,
                url: 'http://localhost:3000/orders' + result._id
            }
        })        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Unable create order"
        })
    });
});


router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `return details for ${id} requested`
    });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `order with ${id} updated`
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `order with ${id} deleted`
    });
});
module.exports = router;