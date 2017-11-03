const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');

//Stories index
router.get('/',(req,res)=>{
  Story.find({status:'public'})
  .populate('user')
  .then(stories=>{
    res.render('stories/index',{
      stories:stories
    });
  })
  
});

//Stories Add Form
router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('stories/add');
});

//Stories Edit
router.get('/',ensureAuthenticated,(req,res)=>{
  res.render('stories/index');
});

//Show single story
router.get('/show/:id',()=>{
  Story.findOne({
    _id:req.params.id
  }).then(story=>{
    res.render('stories/show,',{
      story:story
    });
  })
});

//Process Add Story
router.post('/',(req,res)=>{
  let allowComments;
  
  if(req.body.allowComments){
    allowComments = true;
  }
  else{
    allowComments = false;
  }

  const newStroy = {
    title: req.body.title,
    body:req.body.body,
    status:req.body.status,
    allowComments:allowComments,
    user:req.user.id
  }

  new Story(newStroy)
  .save()
  .then(story=>{
    res.redirect(`/stories/show/${story.id}`);
  })
})

module.exports = router;