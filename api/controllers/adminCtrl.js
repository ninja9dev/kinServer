'use strict';

var mongoose = require('mongoose'),
multer = require('multer'),
// stores   = mongoose.model('store'),
// newsfeed = mongoose.model('newsfeed'),
contacts  = mongoose.model('contacts'),
patient   = mongoose.model('patient'),
users     = mongoose.model('users'),
admin     = mongoose.model('admin');

var path = require('path');
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, '../images/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn)
   }
});
var upload = multer({ storage: storage }).single('image');

//**************** create admin ****************************
exports.createAdmin = function(req, res) 
{
  admin.findOne({email: req.body.email}, function(err, user) {
    if(user == null){
      var new_user = new admin({
        firstname:  req.body.firstname,
        lastname:   req.body.lastname,
        email:      req.body.email,
        password:   req.body.password,
        image:      null
      });
  
      new_user.save(function(error, users)
      {
        if (error) {
          res.json({
              msg: 'Something went wrong with sending email.',
              status: 0
          });
        }else{
          res.send({
            data: users,
            status: 1,
            error: 'Admin added successfully!'
          });
        }
      });
    }else{
      res.send({
        status: 0,
        data: null,
        error: 'Email already exist in our system!'
      });
    }
  });
};

// ADMIN LOGIN ******************
exports.adminLogin = function(req, res) 
{
  admin.findOne({email:req.body.email, password:req.body.password}, function(err, user)
  {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid logged in deatils.'
      });
    }
    else
    {
      res.json({
         status: 1,
         data: user,
         error:'Logged In successfully!'
      });
    }
  });
};

exports.getAdminByID = function(req, res) 
{
  admin.findOne({_id:req.body.user_id}, function(err, user)
  {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid logged in deatils.'
      });
    }
    else
    {
      res.json({
         status: 1,
         data: user,
         error:'Admin data fetched!'
      });
    }
  });
};

// ADMIN UPDATE *****************
exports.adminUpdate = function(req, res)
{
  admin.update({_id: req.body._id},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'image':req.body.image, 'password': req.body.password } }, {new: true}, function(err, user) {
    if(user == null){
      res.send({
        error: err,
        status: 0,
        msg:"Try Again"
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data:user,
        msg:"Admin profile updated successfully!"
      });
    }
  });
};

// Delete All Admin Records-----------

exports.deleteAllAdmin = function(req, res) 
{
  admin.remove({}, function(err, doc) {
    res.json({
        msg: 'Admin records deleted',
        status: 1,
        data:doc
    });
  });
};