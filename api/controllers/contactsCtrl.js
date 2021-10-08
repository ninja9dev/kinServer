'use strict';

var mongoose = require('mongoose'),
multer    = require('multer'),
users     = mongoose.model('users'),
profiles  = mongoose.model('profiles'),
patient    = mongoose.model('patient'),
calls     = mongoose.model('calls'),
contacts  = mongoose.model('contacts');
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

exports.addContact = function(req, res)
{
  contacts.findOne({phone: req.body.phone}, function(err, user)
  {
    if(user == null)
    {
      contacts.findOne({email: req.body.email}, function(err, doct)
      {
        if(doct == null)
        {
          //---Check in facilities-----
          users.findOne({email: req.body.email},function(err,checkfac)
          {
            if(checkfac == null)
            {
              contacts.findOne({email: req.body.email}, function(err, checkcont)
              {
                if(checkcont == null)
                {
                  var new_contact = new contacts({
                    name:       req.body.name,
                    phone:      req.body.phone,
                    email:      req.body.email,
                    password:   req.body.password,
                    patientId:  req.body.patientId,
                    otp:       '123456',
                    isAppUser:  0,
                    created_on: new Date()
                  });
                 
                  new_contact.save(function(err, contact)
                  {
                    //--SEND EMAIL-------------------------------
                      var string  = 'Don'+'\''+'t worry, we all forget sometimes';
                      var fs      = require('fs'); // npm install fs
                      var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/contact.html', 'utf8');
                      let dynamic_data = '';
                      
                      readStream.on('data', function(chunk) {
                        dynamic_data += chunk;
                      }).on('end', function() 
                      {
                        var helper    = require('sendgrid').mail;
                        
                        var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                        var toEmail   = new helper.Email(req.body.email);
                        var subject   = "Account Created As Patient's Contact";

                        dynamic_data = dynamic_data.replace("#NAME#", req.body.name) ;
                        dynamic_data = dynamic_data.replace("#EMAIL#", req.body.email) ;
                        dynamic_data = dynamic_data.replace("#PASSWORD#", req.body.password) ;

                        var content = new helper.Content('text/html', dynamic_data);

                        var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                        
                        var sg = require('sendgrid')('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');
                        
                        var request = sg.emptyRequest({
                          method: 'POST',
                          path: '/v3/mail/send',
                          body: mail.toJSON()
                        });
                        sg.API(request, function (error, response) 
                        {
                          if (error) {
                            // console.log(error);
                            res.json({
                                msg: 'Something went wrong with sending email.',
                                status: 0
                            });
                          }else{
                            res.send({
                              data: contact,
                              status: 1,
                              error: 'New contact added successfully!' 
                            });
                          }
                        })
                      }) 
                    //-------------------------------------------
                  });
                }
                else
                {
                  res.send({
                    status: 0,
                    data: null,
                    error: 'Email already exist in our system!'
                  }); 
                }
              });
            }
            else{
              res.send({
                status: 0,
                data: null,
                error: 'Email already exist in our system!'
              }); 
            }
          })
          
        }
        else
        {
          res.send({
            status: 0, 
            data: null, 
            error: 'Contact with this email is already exist'
          });
        }
      });
      
    }
    else
    {
      res.send({
        status: 0, 
        data: null, 
        error: 'Contact with this phone number is already exist'
      });
    }
  });
};

exports.contact_token_save = function(req, res)
{
  contacts.update({_id: req.body.userId }, { $set: { token: req.body.token}}, {new: true}, function(err, change) 
  {
    if (change == null)
    {
      res.send({
        error: err,
        status: 0,
        data: null,
        msg:'Try again !!'
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: change,
        msg:'Contact token updated successfully!'
      });
    }
  });
};

exports.updateContact = function(req, res)
{
  contacts.update({_id: req.body.contactId }, { $set: {name: req.body.name, email: req.body.email, phone: req.body.phone,password: req.body.password, patientId: req.body.patientId}}, {new: true}, function(err, user)
  {
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
        msg:"Patient updated successfully!"
      });
    }
  });
};

exports.contact_update_Admin = function(req, res)
{
  contacts.update({_id: req.body.contactId }, { $set: {name: req.body.name, email: req.body.email, phone: req.body.phone}}, {new: true}, function(err, user)
  {
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
        msg:"Contact updated successfully!"
      });
    }
  });
};

exports.getContacts = function(req, res)
{
    contacts.find({patientId: req.body.patientId }, function(err, contacts)
    {
      if(contacts == null)
      {
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
           data: contacts,
           error:null
        });
      }
    });
};

exports.findReports = function(req, res)
{
  if(req.body.option == 'faculty')
  {
      users.find({ 'created_on' : { '$gte' : req.body.start_date , '$lte' : req.body.end_date }}).exec(function(err, doc)
      {
        var counter = 0,
          dict = {},
          data = [];

        function loopOfRecords()
        {
          if(counter < doc.length)
          {
            patient.find({'userId': doc[counter]._id}, function(err, docPat){
              dict = {
                name:     doc[counter].firstname+' '+doc[counter].lastname,
                facName:  doc[counter].organization_name,
                email:    doc[counter].email,
                contact:  '',
                patientName: docPat.length,
              };

              data.push(dict);
              counter = counter + 1;
              loopOfRecords();
            });
          }
          else
          {
            res.json({
              error: null,
              status: 1,
              data: data
            });
          }
        };

        loopOfRecords();
      });
  }
  else if(req.body.option == 'patient')
  {
      patient.find({ 'created_on' : { '$gte' : req.body.start_date , '$lte' : req.body.end_date }}).exec(function(err, mem)
      {
        var counter = 0,
          dict = {},
          data = [];

        function loopOfRecords()
        {
          if(counter < mem.length)
          {
            users.findOne({'_id': mem[counter].userId}, function(err, docz){
              // console.log("DDDDDDDDDDDDDDDDDDDDDDD");
              // console.log(docz);
              // console.log(docz.organization_name);
              // return false;
              dict = {
                name:     mem[counter].firstname+' '+mem[counter].lastname,
                email:    mem[counter].email,
                patID:    mem[counter]._id,
                contact:  mem[counter].contact,
                facName:  docz != null ? docz.organization_name : "-NA-",
                patientName: '',
              };

              data.push(dict);
              counter = counter + 1;
              loopOfRecords();
            });
          }else{
            res.json({
              error: null,
              status: 1,
              data: data
            });
          }
        };

        loopOfRecords();
      });
  }
  else if(req.body.option == 'contact')
  {
      contacts.find({ 'created_on' : { '$gte' : req.body.start_date , '$lte' : req.body.end_date }}).exec(function(err, mem)
      {
        var counter = 0,
          dict = {},
          data = [];

        function loopOfRecords()
        {
          if(counter < mem.length)
          {
            patient.find({'_id': mem[counter].patientId}, function(err, doc)
            {
              users.findOne({'_id':doc[0].userId},function(err,user1){
                console.log(user1)
                dict = {
                  name: mem[counter].name,
                  email: mem[counter].email,
                  contact: mem[counter].phone,
                  facName:user1.organization_name,
                  patientName: doc[0].firstname+' '+doc[0].lastname
                };

                data.push(dict);

                counter = counter + 1;

                loopOfRecords();
              })
            });
          }else{
            res.json({
              error: null,
              status: 1,
              data: data
            });
          }
        };

        loopOfRecords();
      });
  }
  else if(req.body.option == 'calls')
  {
      calls.find({ 'created_on' : { '$gte' : req.body.start_date , '$lte' : req.body.end_date }}).exec(function(err, all_calls)
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
              if(doc)
              {
                patient.findOne({_id: all_calls[counter].patientId}, function(err, docPat)
                {
                  if(docPat)
                  {
                    dict = {
                      contactId:    all_calls[counter].contactId,
                      contactName:  doc.name,
                      callDate:     all_calls[counter].callDate,
                      callTime:     all_calls[counter].callTime,
                      patientId:    all_calls[counter].patientId,
                      patientName:  docPat.firstname+' '+docPat.lastname,
                      created_on:   all_calls[counter].created_on
                    };
                    data.push(dict);
                    counter = counter + 1;
                    getUserDetails();
                  }
                });
                
              }
              
              
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




exports.getContactDetails = function(req, res)
{
  contacts.findOne({_id:req.body._id}, function(err, contact)
  {
    if(contact == null)
    {
      res.send({
        status: 0,
        data: null,
        error:'Invalid patient.'
      });
    }else{
      res.json({
         status: 1,
         data: contact,
         error:'Contact fetched successfully!'
      });
    }
  });
};

exports.contacts_all = function(req, res)
{
    contacts.find({ }, function(err, contacts)
    {
      if(contacts == null)
      {
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
           data: contacts,
           error:null
        });
      }
    });
};

exports.getContactByID = function(req, res)
{
    contacts.find({_id: req.body.contactId }, function(err, contacts)
    {
      res.json({
         status: 1,
         data: contacts,
         error:null
      });
    });
};

exports.deleteContact = function(req, res)
{
    contacts.remove({_id: req.body._id }, function(err, docs)
    {
      res.json({
         status: 1,
         data: null,
         error:"Contact deleted successfully"
      });
    });
};

exports.deleteAllContact = function(req, res)
{
    contacts.remove({}, function(err, docs)
    {
      res.json({
         status: 1,
         data: null,
         error:"Contact deleted successfully"
      });
    });
};