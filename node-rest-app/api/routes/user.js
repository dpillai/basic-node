const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

    User.find({email: req.body.email})
    .then(email => {
        if(email.length >= 1) {
            return res.status(409).json({error: "User already exists"});
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({error: err})
                }
                else {
                    const user = new User(
                        {
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        }
                    );
        
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User signed in successfully",
                            newUser: { email: result.email }
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(501).json({
                            message: "Error trying to add user",
                            error: error
                        });
                    });
                }
            }) 
        }
    })
})


router.post('/login', (req, res, next) => {

    User.find({email: req.body.email})
    .then(user => {
        if(user.length < 1 ){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({message: "Unauthorized"})
            }
            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    id: user[0]._id
                },
                process.env.JWT_KEY,
                {
                   expiresIn: "1h"
                },
                (err, token) => {
                    if(token) {
                        return res.status(200).json({
                            message: "Successful",
                            token: token
                        })
                    }
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Unaathorized:catch"
        })
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
 
    User.findByIdAndDelete({_id: id})
    .then(result => {
      console.log('user deleted :' + result);
      res.status(200).json("user deleted");
    })
    .catch(error =>{ console.error(error); });
});


module.exports = router;