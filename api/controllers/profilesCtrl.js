'use strict';

var mongoose = require('mongoose'),
multer    = require('multer'),
users     = mongoose.model('users'),
profiles  = mongoose.model('profiles');
var path  = require('path');
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

exports.addProfile = function(req, res)
{
  profiles.findOne({ $and: [ {'userId': req.body.userId, $or:[{'name': req.body.name},{'room': req.body.room }] }] }, function(err, user) {
    if(user == null)
    {
      var new_profile = new profiles({
        name: req.body.name,
        image: req.body.image,
        room: req.body.room,
        dob: req.body.dob,
        userId: req.body.userId,
        created_on: new Date()
      });

      new_profile.save(function(err, profile) {
        res.send({
          data: profile,
          status: 1,
          error: 'Profile added successfully!'
        });
      });
    }
    else
    {
      res.send({
        status: 0,
        data: null,
        error: user.name == req.body.name ? 'Profile name already exist.' : 'Room number already exist.'
      });
    }
  });
};

exports.updateProfile = function(req, res)
{
  profiles.findOne({name: req.body.name}, function(err, user) {
    if(user == null)
    {
      profiles.update({_id: req.body._id }, { $set: {name: req.body.name, room: req.body.room, dob: req.body.dob}}, {new: true}, function(err, save)
      {
        res.json({
           status: 1,
           data: null,
           error:'Profile updated successfully'
        });
      });
    }
    else
    {
      res.send({
        status: 0,
        data: null,
        error: 'Profile name already exist in your profiles list'
      });
    }
  });
};

exports.getProfiles = function(req, res)
{
    profiles.find({userId: req.body.userId }, function(err, docs)
    {
      res.json({
         status: 1,
         data: docs,
         error:null
      });
    });
};

exports.getProfileByID = function(req, res)
{
    profiles.find({_id: req.body.profileId }, function(err, docs)
    {
      res.json({
         status: 1,
         data: docs,
         error:null
      });
    });
};

exports.deleteProfile = function(req, res)
{
    profiles.remove({_id: req.body._id }, function(err, docs)
    {
      res.json({
         status: 1,
         data: null,
         error:"Profile deleted successfully"
      });
    });
};