const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "it works"
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: "it works for posts requests",
        orderCreated: order
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