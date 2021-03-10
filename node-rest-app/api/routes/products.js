const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .then(docs => {
        if(docs.length > 0)
            res.status(200).json(docs)
        else
            res.status(200).json("No products found")
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error)
    })
});


router.post('/', (req, res, next) => {

    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        }
    );

    product.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "it works for posts requests",
            createProduct: product
        });
    })
    .catch(error => {
        console.log(error);
        res.status(501).json({
            message: "Error trying to add product",
            error: error
        });
    })
});


router.get('/:productId', (req, res, next) => {

    Product.findById(req.params.productId)
    .then(doc => {
        console.log(doc);
        if(doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({message: `product with ${req.params.productId} not found`});
        }        
    })
    .catch(error => {
        console.log(error);
        res.status(501).json({
            reason: "invalid input",
            error: error});
    })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    var product = {
        name: req.body.name,
        price: req.body.price
      };
    
      Product.findByIdAndUpdate({_id: id}, product)
      .then(doc => {
        doc.save();
        res.status(200).json({
            message: "product updated",
            Product: product
        });
      })
      .catch(error =>{ console.error(error); });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
 
    Product.findByIdAndDelete({_id: id})
    .then(result => {
      console.log('doc deleted :' + result);
      res.status(200).json("product deleted");
    })
    .catch(error =>{ console.error(error); });
});
  

module.exports = router;