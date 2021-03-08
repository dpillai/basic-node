const express =require('express');
const app = express();
const logger = require('morgan');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
});

mongoose.connect('mongodb+srv://dpillai:' + process.env.MONGO_ATLAS_PW + '@cluster0.24rgb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message   
        }
    });
});
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'it works'
//     });
// });

module.exports = app; 



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dpillai:<password>@cluster0.24rgb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
