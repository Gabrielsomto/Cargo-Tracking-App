const express = require('express');
const { findOne } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');  
// User model
const User = require('../models/User');
const { route } = require('.');  

//  Login page
router.get('/login', (req, res) => res.render('login'));

//  Register page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required feilds
    if(!name || !password || !password2) {
        errors.push({ msg: 'Please fill in all feilds' });
    }

    // Check passwords match 
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check for pass lenght 
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0) {
       res.render('register', {
           errors,
           name,
           email,
           password,
           password2
       });
    } else {
           //  Validation passed
           User.findOne({ email: email })
            .then(user => {
                if(user) {
                  // User exists
                  errors.push({ msg: 'Email is already rgistered' });
                  res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });   
                }  else {
                   const newUser = User({
                       name,
                       email,
                       password
                   });

                   // Hash Password
                   bcrypt.genSalt(10, (err, salt) => 
                      bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //  set password to hashed
                        newUser.password = hash;
                        // save user
                        newUser.save()
                           .then(user => {
                               req.flash('success_msg', 'you are registed and can log in');
                               res.redirect('/users/login');
                           })
                           .catch(err => console.log(err));


                   }))
                }
            });

    }
});


// Login Handle
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
       successRedirect: '/dashboard',
       failureRedirect: '/users/login',
       failureFlash: true
   }) (req, res, next);
}); 


//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;