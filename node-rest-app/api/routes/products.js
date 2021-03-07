const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "it works"
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(200).json({
        message: "it works for posts requests",
        createProduct: product
    });
});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: `return details for ${id} requested`
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: `product with ${id} updated`
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: `product with ${id} deleted`
    });
});
module.exports = router;