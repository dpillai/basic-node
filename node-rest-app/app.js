const express =require('express');
const app = express();
const logger = require('morgan');
const bodyParser  = require('body-parser');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
});


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