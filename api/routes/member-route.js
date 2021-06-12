const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/members-model');
const router = express.Router();
const expressValidator = require('express-validator');
const passport = require('passport');
require("../middleware/passport")(passport);
const db = require('../database');
const {body} = require("express-validator/check");
const {check} = require("express-validator/check");
router.use(expressValidator())
/*Routes*/
router.get('/register', async function (req, res) {
    res.render('register');
})
router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username field must be 5 character long').isLength({min: 5});
    req.checkBody('username', 'Username field must contain less than 5 characters').isLength({max: 20});
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Username already exists NROsolmaga@toto.com
    let errors = req.validationErrors();
    if (errors) {
        console.log("form validate errors", errors);
        res.status(500).json({
            error: errors,
            success: false,
        });
    } else {
        User.findOne().or([{username: username}, {email: email}])
            .then((user) => {
                if(user){
                    if (user.username === username) {
                        let errors = [];
                        errors.push({param: "username", msg: 'This username already exists'});
                        console.log("username", errors);
                        res.status(500).json({
                            error: errors,
                            success: false,
                        });
                    } else if (user.email === email) {
                        let errors = [];
                        errors.push({param: "email", msg: 'This email already exists'});
                        console.log("email errors", errors);
                        res.status(500).json({
                            error: errors,
                            success: false,
                        });
                    }
                }else {
                    let newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if (err) {
                                console.log("hash error", err);
                                res.status(500).json({
                                    error: err,
                                    success: false,
                                });
                            }
                            newUser.password = hash;
                            newUser.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(200).json({
                                        message: 'User created',
                                        user: result,
                                        success: true,
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err,
                                        success: false,
                                    });
                                })
                        })
                    })
                }
            })
    }
})

// Login Form
router.get('/login', async (req, res) => {
    res.render('login');
});

// Login Process
router.post('/login', async (req, res, next) => {
    passport.authenticate('local',(err, user, info) => {
       if (err) throw err;
       if (!user) {
           res.status(404).json({
               message: "User not found or not valid fields",
               success: false,
           });
       }else{
           req.logIn(user, err => {
               if (err) throw err;
               res.status(200).json({
                   message: "Successfully Authenticate",
                   success: true,
               });
               console.log(req.user);
           })
       }
    })(req, res, next);
});

// logout
router.get('/logout', async (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;
