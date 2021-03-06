var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;

const userSchema =  new mongoose.Schema ({
  title: String,
  content: String,
  author: String
}, {collection: 'users'});

const user = mongoose.model('user', userSchema);

router.get('/', function(req, res, next) {
  res.render('index',{success: req.session.success});
});

router.get('/get-data', function(req, res, next){
  user.find().lean()
  .then(doc => {
    console.log(doc);
    res.render('index', {items: doc});
  });
});


router.post('/insert', function(req, res, next) {

  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  const data = new user(item);
  data.save();
  res.redirect('/');
});



router.post('/update', function(req, res, next) {

  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  user.findByIdAndUpdate({_id: req.body.id}, item)
  .then(doc => {
    doc.save();
    res.redirect('/');
  })
  .catch(error =>{ console.error(error); });
});


router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  user.findByIdAndDelete({_id: id})
  .then(result => {
    console.log('doc deleted :' + result);
    res.redirect('/');
  })
  .catch(error =>{ console.error(error); });
});




// const url = 'mongodb://localhost:27017/';


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index',{success: req.session.success});
// });

// router.get('/get-data', function(req, res, next) {

//   mongo.connect(url, {useUnifiedTopology: true})
//     .then(client => {
//       console.log('connected');

//       client.db('test').collection('users').find().toArray()
//       .then(results => {
//         res.render('index', {items: results});
//         client.close();
//       })
//       .catch(error => console.error(eror))
//     })
//     .catch(error => console.error(error))
//   });

// router.post('/insert', function(req, res, next) {
//   console.log('request : ' + req.header);
//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   };
 
//   mongo.connect(url, {useUnifiedTopology: true})
//   .then(client => {
//     console.log('connected');

//     client.db('test').collection('users').insertOne(item)
//     .then(result => {
//       console.log('item inserted '+ result);
//       console.log('session '+ req.session.success);
//       req.session.success = true
//       res.redirect('/');
//       client.close();
//     })
//     .catch(error => console.error(error))
//   })
//   .catch(error => console.error(error))
// });


// router.post('/update', function(req, res, next) {

//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   };

//   mongo.connect(url, {useUnifiedTopology: true})
//   .then(client => {
//     console.log('connected');

//     client.db('test').collection('users').updateOne(
//       {_id: mongo.ObjectId(req.body.id)}, {$set: item})
//     .then(result => {
//       console.log('item updated'+ result);
//       res.redirect('/');
//       client.close();
//     })
//     .catch(error => console.error(error))
//   })
//   .catch(error => console.error(error))


// });

// router.post('/delete', function(req, res, next) {

//   mongo.connect(url, {useUnifiedTopology: true})
//   .then(client => {
//     console.log('connected');

//     client.db('test').collection('users').deleteOne({_id: mongo.ObjectId(req.body.id)})
//     .then(result => {
//       console.log('item deleted'+ result);
//       res.redirect('/');
//       client.close();
//     })
//     .catch(error => console.error(error))
//   })
//   .catch(error => console.error(error))
// });

module.exports = router;