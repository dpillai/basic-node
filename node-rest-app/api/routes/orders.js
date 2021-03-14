const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .then(docs => {
        if(docs.length > 0) {
            const result = {
                count: docs.length,
                Products: docs.map(doc => {
                    return({
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    })                    
                })
            }
            res.status(200).json(result)
        }            
        else
            res.status(200).json("No orders found")
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error)
    })
});


router.post('/', (req, res, next) => {
    
    Product.findById({_id: req.body.product})
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order =  new Order ({
            _id: new mongoose.Types.ObjectId(),
            product: product,
            quantity: req.body.quantity
        })
        return order.save()
    })
    .then(result => {
        res.status(200).json({
            message: "it works for posts requests",
            orderCreated: {
                id: result._id,
                Product: result.product,
                quantity: result.quantity,
                url: 'http://localhost:3000/orders/' + result._id
            }
        })        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Unable to create order"
        })
    });
});


router.get('/:orderId', (req, res, next) => {

    Order.findById(req.params.orderId)
    .populate('product', 'name')
    .then(doc => {
        console.log(doc);
        if(doc) {
            res.status(200).json({
                id: doc._id,
                product: doc.product,
                quantity: doc.quantity                
            });
        }
        else {
            res.status(404).json({message: `Order with ${req.params.orderId} not found`});
        }        
    })
    .catch(error => {
        console.log(error);
        res.status(501).json({
            reason: "invalid input",
            error: error});
    })
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `order with ${id} updated`
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.findByIdAndDelete({_id: id})
    .then(result => {
        if(!result){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        console.log('doc deleted :' + result);
        res.status(200).json("order cancelled");
    })
    .catch(error =>{ console.error(error); });
});

module.exports = router;