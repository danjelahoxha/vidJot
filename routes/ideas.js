const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
require("../models/Idea");
const Idea = mongoose.model("ideas");
const {ensureAuthenticated}= require('../helpers/auth')

router.get("/",ensureAuthenticated, (req, res) => {
    Idea.find({})
        .sort({ date: "desc" })
        .then(ideas => {
            res.render("ideas/index", {
                ideas: ideas
            });
        })

});
router.post("/", (req, res) => {
    const newIdea = {
        title: req.body.title,
        details: req.body.details
    };
    new Idea(newIdea)
        .save()
        .then(idea => {
            req.flash("success_msg", "Added succesfully");
            res.redirect("/ideas");
        })
        .catch(err => {
            res.redirect("/ideas", err);
        });
});

router.get("/add", ensureAuthenticated,(req, res) => {
    res.render("ideas/add");
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});
 

// Edit Form process
router.put('/:id', (req, res) => {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      // new values
      idea.title = req.body.title;
      idea.details = req.body.details;
  
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video idea updated');
          res.redirect('/ideas');
        })
    });
  });
  
// Delete Idea
router.delete('/delete/:id', (req, res) => {
        Idea.deleteOne({ _id: req.params.id })
            .then(() => {
                req.flash("success_msg", "Deleted succesfully");
                res.redirect('/ideas');
            });
    });


    module.exports = router;