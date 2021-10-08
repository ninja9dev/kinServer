'use strict';

var mongoose = require('mongoose'),
multer    = require('multer'),
patient    = mongoose.model('patient'),
users     	= mongoose.model('users'),
contacts  = mongoose.model('contacts'),
chatlisting = mongoose.model('chatlisting'),
notification = mongoose.model('notification'),
chats  		= mongoose.model('chat');

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

exports.chat_listing = function(req, res) {
    chatlisting.find({$or: [{'senderId': req.body.userId}, {'receiverId': req.body.userId} ] }, function(err, doc){
      var data = [],
        counter = 0,
        dict = {};
      function getUserDetails(){
        if(counter < doc.length){
          if(doc[counter].senderType == 'patient'){
            patient.findOne({'_id': doc[counter].senderId}, function(err, sender){
              contacts.findOne({'_id': doc[counter].receiverId}, function(err, receiver)
              {
                if(receiver == null){
                  dict = {};

                  data.push(dict);
                  counter = counter + 1;
                  getUserDetails();
                }
                else{
                  chats.find({'chatId': doc[counter]._id}, function(err, chat){
                    dict = {
                      senderId: doc[counter].senderId,
                      receiverId: doc[counter].receiverId,
                      _id: doc[counter]._id,
                      sender: sender,
                      receiver: receiver,
                      chat: chat
                    };

                    data.push(dict);
                    counter = counter + 1;
                    getUserDetails();
                  });  
                }
                
              });
            });
          }else if(doc[counter].senderType == 'contact'){
            contacts.findOne({'_id': doc[counter].senderId}, function(err, sender){
              patient.findOne({'_id': doc[counter].receiverId}, function(err, receiver)
              {
                if(receiver == null){
                  dict = {};

                    data.push(dict);
                    counter = counter + 1;
                    getUserDetails();
                }
                else{
                  chats.find({'chatId': doc[counter]._id}, function(err, chat){
                    dict = {
                      senderId: doc[counter].senderId,
                      receiverId: doc[counter].receiverId,
                      _id: doc[counter]._id,
                      sender: sender,
                      receiver: receiver,
                      chat: chat
                    };

                    data.push(dict);
                    counter = counter + 1;
                    getUserDetails();
                  });  
                }
                
              });
            });
          }
        }else{
          res.send({
                data: data,
                status: 1,
                error: null
            });
        }
      };
      getUserDetails();

    });
};

exports.create_chat = function(req, res)
{
  chatlisting.find({$or: [{'senderId': req.body.userId, 'receiverId': req.body.receiverId}, {'senderId': req.body.receiverId, 'receiverId': req.body.userId} ] }, function(err, doc){
      if(doc.length > 0){
          res.send({
            status: 1,
            data: doc[0],
            error:'Invalid logged in deatils.'
          });
      }else{
          var new_user = new chatlisting({
            senderId: req.body.userId,
            receiverId: req.body.receiverId,
            created_on: new Date(),
            senderType: req.body.senderType,
            receiverType: req.body.receiverType
        });

        new_user.save(function(err, doc1) {
            res.send({
              data: doc1,
              status: 1,
              error: 'User registered successfully!'
            });
        });
    }
    });
};

exports.save_message = function(req, res)
{
  var new_user = new chats({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    seen: 0,
    receiverStatus: 0,
    senderStatus: 0,
    created_on: new Date(),
    isMedia: req.body.isMedia,
    media: req.body.media,
    text: req.body.text,
    chatId: req.body.chatId
  });

  new_user.save(function(err, users)
  {
    res.send({
      data: users,
      status: 1,
      error: 'User registered successfully!'
    });
  });
};

exports.list_messages = function(req, res)
{
  chats.find({'chatId': req.body.chatId}, function(err, doc)
  {
    if(doc.length != 0)
    {
      patient.findOne({'_id': doc[0].senderId}, function(err, sender)
      {
        if(sender == null)
        {
          contacts.findOne({'_id': doc[0].senderId}, function(err, sender){
            contacts.findOne({'_id': doc[0].receiverId}, function(err, receiver){
              if(receiver == null){
                patient.findOne({'_id': doc[0].receiverId}, function(err, receiver){
                  res.send({
                    data: {'chat': doc, 'sender': sender, 'receiver': receiver},
                    status: 1,
                    error: null
                  });
                });
              }
            });
          });
        }else{
          contacts.findOne({'_id': doc[0].senderId}, function(err, sender){
            // if(sender == null){
              patient.findOne({'_id': doc[0].receiverId}, function(err, receiver){
                res.send({
                  data: {'chat': doc, 'sender': sender, 'receiver': receiver},
                  status: 1,
                  error: null
                });
              });

          });
        }
      });
    }
    else{
      res.send({
        data: null,
        status: 0,
        error: "No any message found"
      });
    }
  });
};


exports.save_notification = function(req, res){
  var new_user = new notification({
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        read: 0,
        created_on: new Date(),
        noti_type: req.body.type,
        itemId: req.body.id
    });

    new_user.save(function(err, users) {
        res.send({
          data: users,
          status: 1,
          error: 'User registered successfully!'
        });
    });
};

exports.list_notification = function(req, res){
  notification.find({'receiverId': req.body.userId}, function(err, doc){
    var counter = 0,
      data = [],
      dict = {};
    function getUserDetails(){
      if(counter < doc.length){
        users.findOne({'_id': doc[counter].senderId}, function(err, sender){
          dict = {
            senderId: doc[counter].senderId,
            receiverId: doc[counter].receiverId,
            noti_type: doc[counter].noti_type,
            created_on: doc[counter].created_on,
            sender_name: sender.name,
            sender_image: sender.image,
            read: doc[counter].read,
            itemId: doc[counter].itemId,
            _id: doc[counter]._id
          };
          data.push(dict);
          counter += 1;
          getUserDetails();
        });
      }else{
        res.send({
                data: data,
                status: 1,
                error: null
            });
      }
    };

    getUserDetails();

  });
};

exports.read_notification = function(req, res)
{
  notification.update({'_id': req.body.id}, {'$set': { 'read' : 1 } } , {'$new': true}, function(err, doc){
    res.send({
          data: doc,
            status: 1,
            error: null
        });
  });
};

exports.clear_all_chat = function(req, res)
{
  chatlisting.remove({}, function(err, doc){
      res.send({
          data: doc,
          status: 1,
          error: null
      });
  });
};