const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const multer = require('multer');

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        cb(null, false)
        console.log("error in file mimetype")
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
   
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

const Product = require('../models/product');


router.get('/', (req, res, next) => {
    Product.find()
    .then(docs => {
        if(docs.length > 0) {
            const result = {
                count: docs.length,
                Products: docs.map(doc => {
                    return({
                        name: doc.name,
                        price: doc.price,
                        image: doc.image,
                        id: doc._id,
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    })                    
                })
            }
            res.status(200).json(result)
        }
            
        else
            res.status(200).json("No products found")
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(error)
    })
});


router.post('/', upload.single('productImage'), (req, res, next) => {

    console.log(req.file)
    
    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            image: req.file.path
        }
    );

    product.save()
    .then(result => {
        console.log(result);
            res.status(200).json({
            message: "Product added successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                imagePath: result.image,
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id    
            }
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
            res.status(200).json({
                name: doc.name,
                price: doc.price,
                id: doc._id
            });
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

    const updateOps = {};
    for (const key of Object.keys(req.body))     {
      updateOps[key] = (req.body)[key];
    }   
      Product.findByIdAndUpdate({_id: id}, updateOps)
      .then(doc => {
        doc.save();
        res.status(200).json({message: "product updated" });
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