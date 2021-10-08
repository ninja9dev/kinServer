'use strict';

var mongoose = require('mongoose'),
multer    = require('multer'),
users     = mongoose.model('users'),
profiles  = mongoose.model('profiles'),
calls     = mongoose.model('calls'),
contacts  = mongoose.model('contacts');
var path  = require('path');
var patient    = mongoose.model('patient');
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

exports.addCall = function(req, res)
{
  var new_call = new calls({
    contactId:  req.body.contactId,
    callDate:   req.body.date,
    callTime:   req.body.time,
    // userId:     req.body.userId,
    patientId:  req.body.patientId,
    status:     0,
    added_by:   'patient',
    created_on: new Date()
  });
 
  new_call.save(function(err, call)
  {
    res.send({
      data: call,
      status: 1,
      error: 'New call scheduled successfully!' 
    });
    // SEND PUSH NOTIFICATION TO CONTACT--------------------------------------
      /*contacts.findOne({_id:req.body.contactId}, function(err, contact)
      {
        console.log("contactToken = "+contact.token);
      
        var FCM = require('fcm-node');
        var serverKey ='AAAADQwcac0:APA91bGJSpLcH__1rlYHeJMxMiBo4lXO-TOX71nFEZULH9v_dNll5gQ5i7KAETQhAiCHQFm6dkQHVqMFEqgANrn6p7D8JODfRS1cB96G8F9Lz8EojclIhyZT3iuKS7J366VoK9V9ozSF';
        var fcm = new FCM(serverKey);

        var message = {
          "to": contact.token,
          "notification": {
            "title": 'Call Scheduled',
            "body": 'New Call Has Been Scheduled on' + req.body.date+' '+req.body.time,
          },
          "data": {
            "title": 'Call Scheduled',
            "body": 'New Call Has Been Scheduled on' + req.body.date+' '+req.body.time,
          }
        };

        fcm.send(message, function (err, response)
        {
          if(err)
          {
            console.log("Something has gone wrong!");
            console.log(err)
          }
          else
          {
            console.log("Successfully sent with response: ", response);
            res.send({
              data: call,
              status: 1,
              error: 'New call scheduled successfully!' 
            });
          }
        });
      });*/
    //-----------------------------------------------------------
    
  });
};

exports.addCallRequest = function(req, res)
{
  var new_call = new calls({
    contactId:  req.body.contactId,
    callDate:   req.body.date,
    callTime:   req.body.time,
    // userId:     req.body.userId,
    patientId:  req.body.patientId,
    status:     0,
    added_by:   'contact',
    created_on: new Date()
  });
 
  new_call.save(function(err, call)
  {
    res.send({
      data: call,
      status: 1,
      error: 'New call scheduled successfully!' 
    });
    // SEND PUSH NOTIFICATION TO CONTACT--------------------------------------
      /*contacts.findOne({_id:req.body.contactId}, function(err, contact)
      {
        console.log("contactToken = "+contact.token);
      
        var FCM = require('fcm-node');
        var serverKey ='AAAADQwcac0:APA91bGJSpLcH__1rlYHeJMxMiBo4lXO-TOX71nFEZULH9v_dNll5gQ5i7KAETQhAiCHQFm6dkQHVqMFEqgANrn6p7D8JODfRS1cB96G8F9Lz8EojclIhyZT3iuKS7J366VoK9V9ozSF';
        var fcm = new FCM(serverKey);

        var message = {
          "to": contact.token,
          "notification": {
            "title": 'Call Scheduled',
            "body": 'New Call Has Been Scheduled on' + req.body.date+' '+req.body.time,
          },
          "data": {
            "title": 'Call Scheduled',
            "body": 'New Call Has Been Scheduled on' + req.body.date+' '+req.body.time,
          }
        };

        fcm.send(message, function (err, response)
        {
          if(err)
          {
            console.log("Something has gone wrong!");
            console.log(err)
          }
          else
          {
            console.log("Successfully sent with response: ", response);
            res.send({
              data: call,
              status: 1,
              error: 'New call scheduled successfully!' 
            });
          }
        });
      });*/
    //-----------------------------------------------------------
    
  });
};

exports.updateCall = function(req, res)
{
  calls.update({_id: req.body.id},{$set:{ 'callDate': req.body.date, 'callTime': req.body.time } }, {new: true}, function(err, callData) 
    {
      if(callData)
      {
        calls.find({_id: req.body.id }, function(err, all_calls)
        {
          var counter = 0,
              data = [],
              dict = {};

          function getUserDetails(){
            if(counter < all_calls.length)
            {
              contacts.findOne({_id: all_calls[counter].contactId}, function(err, doc)
              {
                if(doc){
                  dict = {
                    id: all_calls[counter]._id,
                    contactId: all_calls[counter].contactId,
                    contactName: doc.name,
                    contactEmail: doc.email,
                    contactUserId: doc._id,
                    isAppUser: doc.isAppUser,
                    callDate: all_calls[counter].callDate,
                    callTime: all_calls[counter].callTime,
                    // userId: all_calls[counter].userId,
                    patientId: all_calls[counter].patientId,
                    created_on: all_calls[counter].created_on
                  };
                  data.push(dict);
                }
                
                counter = counter + 1;
                getUserDetails();
              });
            }else{
              res.json({
                 status: 1,
                 data: data,
                 error:null
              });
            }
          };
          getUserDetails();
        });
      }
      else{
        res.send({
          data: null,
          status: 0,
          error: 'Something went wrong' 
        });
      }
    });
};

exports.acceptCallStatus = function(req, res)
{
  calls.update({_id: req.body.callID},{$set:{ 'status': 1 } }, {new: true}, function(err, callData) 
    {
      if(callData)
      {
        res.json({
          status: 1,
          data: callData,
          error:null
        });
      }
      else{
        res.send({
          data: null,
          status: 0,
          error: 'Something went wrong' 
        });
      }
    });
};

exports.declineCallStatus = function(req, res)
{
  calls.update({_id: req.body.callID},{$set:{ 'status': 2 } }, {new: true}, function(err, callData) 
    {
      if(callData)
      {
        res.json({
          status: 1,
          data: callData,
          error:null
        });
      }
      else{
        res.send({
          data: null,
          status: 0,
          error: 'Something went wrong' 
        });
      }
    });
};


exports.getCalls = function(req, res)
{
    calls.find({patientId: req.body.patientId }, function(err, all_calls)
    {
      var counter = 0,
          data = [],
          dict = {};

      function getUserDetails(){
        if(counter < all_calls.length)
        {
          contacts.findOne({_id: all_calls[counter].contactId}, function(err, doc)
          {
            if(doc){
              dict = {
                id: all_calls[counter]._id,
                contactId: all_calls[counter].contactId,
                contactName: doc.name,
                contactEmail: doc.email,
                contactUserId: doc._id,
                isAppUser: doc.isAppUser,
                callDate: all_calls[counter].callDate,
                callTime: all_calls[counter].callTime,
                // userId: all_calls[counter].userId,
                patientId: all_calls[counter].patientId,
                call_status: all_calls[counter].status,
                created_on: all_calls[counter].created_on
              };
              data.push(dict);
            }
            
            counter = counter + 1;
            getUserDetails();
          });
        }else{
          res.json({
             status: 1,
             data: data,
             error:null
          });
        }
      };
      getUserDetails();
    });
};

exports.getCallsForPatient = function(req, res)
{
    calls.find({patientId: req.body.patientId, added_by:'contact' }, function(err, all_calls)
    {
      var counter = 0,
          data = [],
          dict = {};

      function getUserDetails(){
        if(counter < all_calls.length)
        {
          contacts.findOne({_id: all_calls[counter].contactId}, function(err, doc)
          {
            if(doc){
              dict = {
                id: all_calls[counter]._id,
                contactId: all_calls[counter].contactId,
                contactName: doc.name,
                contactEmail: doc.email,
                contactUserId: doc._id,
                isAppUser: doc.isAppUser,
                callDate: all_calls[counter].callDate,
                callTime: all_calls[counter].callTime,
                // userId: all_calls[counter].userId,
                patientId: all_calls[counter].patientId,
                call_status: all_calls[counter].status,
                created_on: all_calls[counter].created_on
              };
              data.push(dict);
            }
            
            counter = counter + 1;
            getUserDetails();
          });
        }else{
          res.json({
             status: 1,
             data: data,
             error:null
          });
        }
      };
      getUserDetails();
    });
};

exports.getCallsForContact = function(req, res)
{
  contacts.findOne({'_id': req.body.patientId}, function(err, contact){
    patient.findOne({'_id': contact.patientId}, function(err, patientData){
      // console.log(req.body.data._id);return false;
      calls.find({'patientId': contact.patientId, 'contactId': contact._id }, function(err, all_calls)
      {
        var counter = 0,
            data = [],
            dict = {};

        function getUserDetails(){
          if(counter < all_calls.length)
          {
            dict = {
              id: all_calls[counter]._id,
              contactId: all_calls[counter].contactId,
              contactName: contact.name,
              callDate: all_calls[counter].callDate,
              callTime: all_calls[counter].callTime,
              // userId: all_calls[counter].userId,
              patientId: all_calls[counter].patientId,
              patientData: patientData,
              call_status: all_calls[counter].status,
              created_on: all_calls[counter].created_on
            };
            data.push(dict);
              
            counter = counter + 1;
            getUserDetails();
          }else{
            res.json({
               status: 1,
               data: data,
               error:null
            });
          }
        };
        getUserDetails();
      });
    })
  })
};

exports.getCallsForContactRequests = function(req, res)
{
  contacts.findOne({'_id': req.body.patientId}, function(err, contact){
    patient.findOne({'_id': contact.patientId}, function(err, patientData){
      // console.log(req.body.data._id);return false;
      calls.find({'patientId': contact.patientId, 'contactId': contact._id, 'added_by': 'patient' }, function(err, all_calls)
      {
        var counter = 0,
            data = [],
            dict = {};

        function getUserDetails(){
          if(counter < all_calls.length)
          {
            dict = {
              id: all_calls[counter]._id,
              contactId: all_calls[counter].contactId,
              contactName: contact.name,
              callDate: all_calls[counter].callDate,
              callTime: all_calls[counter].callTime,
              // userId: all_calls[counter].userId,
              patientId: all_calls[counter].patientId,
              patientData: patientData,
              call_status: all_calls[counter].status,
              created_on: all_calls[counter].created_on
            };
            data.push(dict);
              
            counter = counter + 1;
            getUserDetails();
          }else{
            res.json({
               status: 1,
               data: data,
               error:null
            });
          }
        };
        getUserDetails();
      });
    })
  })
};

/*exports.getCallsForFacility = function(req, res)
{
  calls.find({}, function(err, all_calls)
  {
    var counter = 0,
        data = [],
        dict = {};

    function getUserDetails(){
      if(counter < all_calls.length)
      {
        patient.findOne({'_id': all_calls[counter].patientId}, function(err, patData)
        {
          contacts.findOne({'_id': all_calls[counter].contactId}, function(err, contData)
          {
            dict = {
              id: all_calls[counter]._id,
              contactId: all_calls[counter].contactId,
              contactName: contData,
              callDate: all_calls[counter].callDate,
              callTime: all_calls[counter].callTime,
              patientId: all_calls[counter].patientId,
              patientData: patData,
              call_status: all_calls[counter].status,
              created_on: all_calls[counter].created_on
            };
            data.push(dict);
              
            counter = counter + 1;
            getUserDetails();
          });

          
        });
        
      }else{
        res.json({
           status: 1,
           data: data,
           error:null
        });
      }
    };
    getUserDetails();
  });
};*/

exports.getCallsForFacility = function(req, res)
{
  patient.find({userId: req.body.patientId}, function(err, pat)
  {
    console.log(pat);
    if(pat.length == 0)
    {
      res.send({
        status: 0,
        data: null,
        error:'Invalid logged in deatils.'
      });
    }
    else
    {
      var counter = 0,
          data = [],
          dict = {};

      function getPatientsDetails()
      {
        if(counter < pat.length)
        {
            dict = {
              id: pat[counter]._id
            };
            data.push(pat[counter]._id);// mainu ikali id chaidia  array ch 
            counter = counter + 1;
            getPatientsDetails();
        }
        else
        {
          calls.find({'patientId': {$in : data} }, function(err, all_calls)
          {
            var counter = 0,
                data = [],
                dict = {};

            function getUserDetails(){
              if(counter < all_calls.length)
              {
                patient.findOne({'_id': all_calls[counter].patientId}, function(err, patData)
                {
                  contacts.findOne({'_id': all_calls[counter].contactId}, function(err, contData)
                  {
                    dict = {
                      id: all_calls[counter]._id,
                      contactId: all_calls[counter].contactId,
                      contactName: contData,
                      callDate: all_calls[counter].callDate,
                      callTime: all_calls[counter].callTime,
                      patientId: all_calls[counter].patientId,
                      patientData: patData,
                      call_status: all_calls[counter].status,
                      created_on: all_calls[counter].created_on
                    };
                    data.push(dict);
                      
                    counter = counter + 1;
                    getUserDetails();
                  });

                  
                });
                
              }else{
                res.json({
                   status: 1,
                   data: data,
                   error:null
                });
              }
            };
            getUserDetails();
          });
        }
      };
      getPatientsDetails();
    }
  });
};

exports.getProfileCalls = function(req, res)
{
    calls.find({userId: req.body.userId, profileId: req.body.profileId }, function(err, all_calls)
    {
      if(all_calls)
      {
        var counter = 0,
          data = [],
          dict = {};

        function getUserDetails()
        {
          if(counter < all_calls.length)
          {
            contacts.findOne({_id: all_calls[counter].contactId}, function(err, doc)
            {
              dict = {
                id: all_calls[counter]._id,
                contactId: all_calls[counter].contactId,
                contactName: doc.name,
                callDate: all_calls[counter].callDate,
                callTime: all_calls[counter].callTime,
                userId: all_calls[counter].userId,
                profileId: all_calls[counter].profileId,
                call_status: all_calls[counter].status,
                created_on: all_calls[counter].created_on
              };
              data.push(dict);
              counter = counter + 1;
              getUserDetails();
            });
          }else{
            res.json({
               status: 1,
               data: data,
               error:null
            });
          }
        };
        getUserDetails();
      }
      else{
        res.json({
               status: 1,
               data: data,
               error:null
            });
      }
    });
};

exports.deleteCall = function(req, res)
{
    calls.remove({_id: req.body._id }, function(err, docs)
    {
      res.json({
         status: 1,
         data: null,
         error:"Call deleted successfully"
      });
    });
};

exports.deleteAllCalls = function(req, res)
{
    calls.remove({}, function(err, docs)
    {
      res.json({
         status: 1,
         data: null,
         error:"All Calls deleted successfully"
      });
    });
};