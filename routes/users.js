const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();
require("../models/User");
const User = mongoose.model("users");



router.get("/login", (req, res) => {
    res.render("users/login");
});
//login form post
router.post("/login", (req, res, next) => {
        passport.authenticate('local',{
            successRedirect :'/ideas',
            failureRedirect : '/users/login',
            failureFlash:true

        })(req,res,next);
    
    
     
});

router.get("/register", (req, res) => {
    res.render("users/register")
});

router.get("/logout" , (req, res) => {
  req.logout();
  req.flash('success',"You are loged out");
  res.redirect("/users/login");
    
});


router.post("/register", (req, res) => {
    let errors = [];

    if (req.body.password2 != req.body.password) {
        errors.push({ text: "Passwords does not match" });
    }
    if (req.body.password.length < 6) {
        errors.push({ text: "Password must be at leas 6 characters" });
    }

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
          if(user){
            req.flash('error_msg', 'Email already registered');
            res.redirect('/users/register');
          } else {
            const newUser = new User({
                username: req.body.username,
              email: req.body.email,
              password: req.body.password
            });
            
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/users/login');
                  })
                  .catch(err => {
                    console.log(err);
                    return;
                  });
              });
            });
          }
        });
    }
       
             

 
});



module.exports = router;