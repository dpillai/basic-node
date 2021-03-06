var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

const url = 'mongodb://localhost:27017/';
//const client = new MongoClient(url);


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(' in / request : ' + req.rawHeaders);
  console.log('session in / '+ req.session.success);
  res.render('index',{success: req.session.success});
});

router.get('/get-data', function(req, res, next) {

  mongo.connect(url, {useUnifiedTopology: true})
    .then(client => {
      console.log('connected');

      client.db('test').collection('users').find().toArray()
      .then(results => {
        res.render('index', {items: results});
        client.close();
      })
      .catch(error => console.error(eror))
    })
    .catch(error => console.error(error))
  });

router.post('/insert', function(req, res, next) {
  console.log('request : ' + req.rawHeaders);
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
 
  mongo.connect(url, {useUnifiedTopology: true})
  .then(client => {
    console.log('connected');

    client.db('test').collection('users').insertOne(item)
    .then(result => {
      console.log('item inserted '+ result);
      console.log('session '+ req.session.success);
      req.session.success = true
      res.redirect('/');
      client.close();
    })
    .catch(error => console.error(error))
  })
  .catch(error => console.error(error))
});


router.post('/update', function(req, res, next) {

  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, {useUnifiedTopology: true})
  .then(client => {
    console.log('connected');

    client.db('test').collection('users').updateOne(
      {_id: mongo.ObjectId(req.body.id)}, {$set: item})
    .then(result => {
      console.log('item updated'+ result);
      res.redirect('/');
      client.close();
    })
    .catch(error => console.error(error))
  })
  .catch(error => console.error(error))


});

router.post('/delete', function(req, res, next) {

  mongo.connect(url, {useUnifiedTopology: true})
  .then(client => {
    console.log('connected');

    client.db('test').collection('users').deleteOne({_id: mongo.ObjectId(req.body.id)})
    .then(result => {
      console.log('item deleted'+ result);
      res.redirect('/');
      client.close();
    })
    .catch(error => console.error(error))
  })
  .catch(error => console.error(error))
});

module.exports = router;