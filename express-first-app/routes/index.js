var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/test/:id', function(req, res, next) {
//   res.render('test', {output: req.params.id})
// })

// router.post('/test/submit', function(req, res, next) {
//   var id = req.body.id
//   res.redirect('/test/' + id)
// })

router.get('/', function(req,res,next) {
  res.render('index', {title: 'Form Validation', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
});


router.post('/submit',
  check('email').isEmail().withMessage('invalid email address'),
  check('password').isLength({min: 4}).withMessage('invalid password'),
  function(req, res, next) {
  
  let errors =  validationResult(req).array();
  // console.log(errors.length)
  if(errors.length > 0) {
    // errors.forEach((error) => { console.log('here' +  error.msg)})
    req.session.errors = errors;
    req.session.success = false;  }
  else {
    req.session.success = true;
  }
  res.redirect('/')
})

module.exports = router;
