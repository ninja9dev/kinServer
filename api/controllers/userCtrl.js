'use strict';

var mongoose = require('mongoose'),
multer    = require('multer'),
contacts  = mongoose.model('contacts'),
patient   = mongoose.model('patient'),
users     = mongoose.model('users');

var path = require('path');
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, '../images/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn)
       // var fileName = file.originalname.split('.');
       // cb(null, fileName[0] + '-' + Date.now() + '.jpg')
       // ////console.log('filename', fileName)
   }
});
var upload = multer({ storage: storage }).single('image');

exports.update_admin_password = function(req, res) {
  console.log(req.body);
   users.findOne({email: req.body.email}, function(err, doc) {
    console.log(doc)
    if (doc == null){
          res.send({
            error: err,
            status: 0,
            data: null,
            msg: "Invalid user!"
          });
     }else{
      console.log(doc.password, req.body.oldpassword);
      //if(doc.password == req.body.oldpassword){
        users.update({_id: doc._id }, { $set: { password: req.body.newpassword}}, {new: true}, function(err, change) {
        if (change == null){
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
            msg:'Password updated successfully!'
          });
        }
        });
      // }else{
      // res.json({
      //   error: null,
      //   status: 0,
      //   data: user,
      //   msg:"The old password you have entered is incorrect."
      // });
    }

   })

};

exports.facility_token_save = function(req, res)
{
  users.update({_id: req.body.userId }, { $set: { token: req.body.token}}, {new: true}, function(err, change) 
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
        msg:'Facility token updated successfully!'
      });
    }
  });
};
// const bcrypt = require('bcrypt');

//****************  create_user_function ****************************
exports.registerUser = function(req, res) 
{
  users.findOne({email: req.body.email}, function(err, user)
  {
    if(user == null)
    {
      //----Check Under Patient------------------
      patient.findOne({email: req.body.email}, function(err, checkPat)
      {
        if(checkPat == null)
        {
          contacts.findOne({email: req.body.email}, function(err, checkcont)
          {
            if(checkcont == null)
            {
              var digits = '0123456789'; 
              let OTP = ''; 
              for (let i = 0; i < 6; i++ ) { 
                OTP += digits[Math.floor(Math.random() * 10)]; 
              } 

              var myOTP = OTP;

              var new_user = new users({
                firstname:    req.body.firstname,
                lastname:     req.body.lastname,
                organization_name:   req.body.organization_name,
                email:        req.body.email,
                password:     req.body.password,
                gender:       req.body.gender,
                image:        null,
                otp:          myOTP,
                otpApproved:  1,
                created_on:   new Date()
              });
          
              new_user.save(function(err, users)
              {
                var fullname = req.body.firstname+' '+req.body.lastname;

                //--SEND EMAIL-------------------------------
                  var string  = 'Don'+'\''+'t worry, we all forget sometimes';
                  var fs      = require('fs'); // npm install fs
                  var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/organization.html', 'utf8');
                  let dynamic_data = '';
                  
                  readStream.on('data', function(chunk) {
                    dynamic_data += chunk;
                  }).on('end', function() 
                  {
                    var helper    = require('sendgrid').mail;
                    
                    var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                    var toEmail   = new helper.Email(req.body.email);
                    var subject   = 'Account Created As Facility';

                    dynamic_data = dynamic_data.replace("#NAME#", fullname) ;
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
                          data: users,
                          status: 1,
                          error: 'Patient added successfully!'
                        });
                      }
                    })
                  }) 
                //-------------------------------------------
              });
            }
            else{
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

// Register user from APP----------------------------------
exports.registerUserFromApp = function(req, res) 
{
  users.findOne({email: req.body.email}, function(err, user)
  {
    if(user == null)
    {
      //----Check Under Patient------------------
      patient.findOne({email: req.body.email}, function(err, checkPat)
      {
        if(checkPat == null)
        {
          contacts.findOne({email: req.body.email}, function(err, checkcont)
          {
            if(checkcont == null)
            {
              var digits = '0123456789'; 
              let OTP = ''; 
              for (let i = 0; i < 6; i++)
              { 
                OTP += digits[Math.floor(Math.random() * 10)]; 
              } 

              var myOTP = OTP;

              var new_user = new users({
                firstname:    req.body.firstname,
                lastname:     req.body.lastname,
                organization_name:   req.body.organization_name,
                email:        req.body.email,
                password:     req.body.password,
                gender:       req.body.gender,
                image:        null,
                otp:          myOTP,
                otpApproved:  req.body.otpApproved,
                created_on:   new Date()
              });
          
              new_user.save(function(err, users)
              {
                var fullname = req.body.firstname+' '+req.body.lastname;

                //--SEND EMAIL-------------------------------
                  var string  = 'Don'+'\''+'t worry, we all forget sometimes';
                  var fs      = require('fs'); // npm install fs
                  var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/otp.html', 'utf8');
                  let dynamic_data = '';
                  
                  readStream.on('data', function(chunk) {
                    dynamic_data += chunk;
                  }).on('end', function() 
                  {
                    var helper    = require('sendgrid').mail;
                    
                    var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                    var toEmail   = new helper.Email(req.body.email);
                    var subject   = 'OTP for Facility registration';

                    dynamic_data = dynamic_data.replace("#OTP#", myOTP);

                    var content = new helper.Content('text/html', dynamic_data);
                    var mail    = new helper.Mail(fromEmail, subject, toEmail, content);
                    
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
                          data: users,
                          status: 1,
                          error: 'Patient added successfully!'
                        });
                      }
                    })
                  }) 
                //-------------------------------------------
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
        else{
          res.send({
            status: 0,
            data: null,
            error: 'Email already exist in our system!'
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

// VERIFY OTP-------------------------------------------
exports.verifyOtp = function(req, res) 
{
  users.findOne({_id: req.body.userId}, function(err, user)
  {
    // console.log(user); 
    // console.log(user.otp);
    // return false;
    if(req.body.otp == user.otp)
    {
      users.update({_id: req.body.userId},{$set:{ 'otpApproved':1 } }, {new: true}, function(err, dom)
      {
        
          var fullname = user.firstname+' '+user.lastname;
          console.log(user.email);

          //--SEND EMAIL-------------------------------
              var string  = 'Don'+'\''+'t worry, we all forget sometimes';
              var fs      = require('fs'); // npm install fs
              var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/organization.html', 'utf8');
              let dynamic_data = '';
              
              readStream.on('data', function(chunk) {
                dynamic_data += chunk;
              }).on('end', function() 
              {
                var helper    = require('sendgrid').mail;
                
                var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                var toEmail   = new helper.Email(user.email);
                var subject   = 'Account Created As Facility';

                dynamic_data = dynamic_data.replace("#NAME#", fullname) ;
                dynamic_data = dynamic_data.replace("#EMAIL#", user.email) ;
                dynamic_data = dynamic_data.replace("#PASSWORD#", user.password) ;

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
                      data: user,
                      status: 1,
                      error: 'Patient added successfully!'
                    });
                  }
                })
              }) 
          //-------------------------------------------
        
      });
      
    }
    else{
      res.send({
        status: 0,
        data: null,
        error: 'You have entered wrong OTP'
      });
    }
  });
};

//****************  SOCIAL LOGIN ****************************
exports.socialLogin = function(req, res) 
{
  console.log(req);
};

exports.update_user = function(req, res) 
{
  console.log("Address"+req.body.address);
  users.update({_id: req.body.orgId},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'image':req.body.image, 'password': req.body.password } }, {new: true}, function(err, user) {
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
        msg:"Profile updated successfully!"
      });
    }
  });
};

exports.update_user_otp = function(req, res) 
{
  users.update({_id: req.body.orgId},{$set:{ 'otpApproved':1 } }, {new: true}, function(err, user)
  {
    if(user == null)
    {
      res.send({
        error: err,
        status: 0,
        msg:"Try Again"
      });
    }
    else
    {
      res.json({
        error: null,
        status: 1,
        data:user,
        msg:"Profile updated successfully!"
      });
    }
  });
};

exports.update_orgFromAdmin = function(req, res) 
{
  users.update({_id: req.body.orgId},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'organization_name':req.body.organization_name } }, {new: true}, function(err, user) {
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
        msg:"Facility updated successfully!"
      });
    }
  });
};


exports.login = function(req, res) 
{
  // console.log(req.body.token); return false;

  users.findOne({email:req.body.email, password:req.body.password}, function(err, user)
  {
    if(user == null)
    {
      patient.findOne({email:req.body.email, password:req.body.password}, function(err, patLogin)
      {
        if(patLogin == null)
        {
          contacts.findOne({email:req.body.email, password:req.body.password}, function(err, contLogin)
          {
            if(contLogin == null)
            {
              res.send({
                status: 0,
                data: null,
                error:'Invalid logged in deatils.'
              });
            }
            else
            {
              // Update One Time Login Event----------------
              contacts.update({_id: contLogin._id }, { $set: {isAppUser: 1}}, {new: true}, function(err, userUpdate)
              {
                res.json({
                  status: 1,
                  data: contLogin,
                  type:'contact',
                  error:'Logged In successfully!'
                });
              });
            }
          });
        }
        else
        {
          res.json({
             status: 1,
             data: patLogin,
             type:'patient',
             error:'Logged In successfully!'
          });
        }
      });
    }
    else
    {
      res.json({
         status: 1,
         data: user,
         type:'organization',
         error:'Logged In successfully!'
      });
    }
  });

    
};

//**************** Forgot Password ******************
exports.forgot_password = function(req, res) 
{
  var loginAs = req.body.login_as;

  var digits = '0123456789'; 
  let OTP = ''; 
  for (let i = 0; i < 6; i++ ) { 
    OTP += digits[Math.floor(Math.random() * 10)]; 
  } 

  var myOTP = OTP;

  if(loginAs == 'organization')
  {
    users.findOne({email:req.body.email}, function(err, user)
    {
      if(user == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid logged in deatils.'
        });
      }
      else
      {
        users.update({email: req.body.email},{$set:{ 'otp':myOTP } }, {new: true}, function(err, upduser)
        {
            //--SEND EMAIL-------------------------------
              var string  = 'Don'+'\''+'t worry, we all forget sometimes';
              var fs      = require('fs'); // npm install fs
              var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/otp.html', 'utf8');
              let dynamic_data = '';
              
              readStream.on('data', function(chunk) {
                dynamic_data += chunk;
              }).on('end', function() 
              {
                var helper    = require('sendgrid').mail;
                
                var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                var toEmail   = new helper.Email(req.body.email);
                var subject   = 'OTP for change your password as facility';

                dynamic_data = dynamic_data.replace("#OTP#", myOTP);

                var content = new helper.Content('text/html', dynamic_data);
                var mail    = new helper.Mail(fromEmail, subject, toEmail, content);
                
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
                      data: user,
                      status: 1,
                      type:'facility',
                      error: 'OTP SENT'
                    });
                  }
                })
              }) 
            //-------------------------------------------
        });
        
      }
    });
  }
  else if(loginAs == 'patient')
  {
    patient.findOne({email:req.body.email}, function(err, user)
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
        patient.update({email: req.body.email},{$set:{ 'otp':myOTP } }, {new: true}, function(err, upduser)
        {
          //--SEND EMAIL-------------------------------
            var string  = 'Don'+'\''+'t worry, we all forget sometimes';
            var fs      = require('fs'); // npm install fs
            var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/otp.html', 'utf8');
            let dynamic_data = '';
            
            readStream.on('data', function(chunk) {
              dynamic_data += chunk;
            }).on('end', function() 
            {
              var helper    = require('sendgrid').mail;
              
              var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
              var toEmail   = new helper.Email(req.body.email);
              var subject   = 'OTP for change your password as patient';

              dynamic_data = dynamic_data.replace("#OTP#", myOTP);

              var content = new helper.Content('text/html', dynamic_data);
              var mail    = new helper.Mail(fromEmail, subject, toEmail, content);
              
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
                    data: user,
                    status: 1,
                    type:'patient',
                    error: 'OTP SENT'
                  });
                }
              })
            }) 
          //-------------------------------------------
        });
        
      }
    });
  }
  else if(loginAs == 'contact')
  {
    contacts.findOne({email:req.body.email}, function(err, user)
    {
      if(user == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid logged in deatils.'
        });
      }
      else
      {
        contacts.update({email: req.body.email},{$set:{ 'otp':myOTP } }, {new: true}, function(err, upduser)
        {
          //--SEND EMAIL-------------------------------
            var string  = 'Don'+'\''+'t worry, we all forget sometimes';
            var fs      = require('fs'); // npm install fs
            var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/otp.html', 'utf8');
            let dynamic_data = '';
            
            readStream.on('data', function(chunk) {
              dynamic_data += chunk;
            }).on('end', function() 
            {
              var helper    = require('sendgrid').mail;
              
              var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
              var toEmail   = new helper.Email(req.body.email);
              var subject   = 'OTP for change your password as contact';

              dynamic_data = dynamic_data.replace("#OTP#", myOTP);

              var content = new helper.Content('text/html', dynamic_data);
              var mail    = new helper.Mail(fromEmail, subject, toEmail, content);
              
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
                    data: user,
                    status: 1,
                    type:'contact',
                    error: 'OTP SENT'
                  });
                }
              })
            }) 
          //-------------------------------------------
        });
      }
    });
  }
};

//**************** VERIFY OTP Forgot Password ******************
exports.verifyOtpForgotPwd = function(req, res) 
{
  var loginAs = req.body.userType;

  if(loginAs == 'facility')
  {
    users.findOne({_id:req.body.userId, otp: req.body.otp}, function(err, user)
    {
      if(user == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid OTP.'
        });
      }
      else
      {
        res.send({
          status: 1,
          data: null,
          error:'Valid OTP.'
        });
      }
    });
  }
  else if(loginAs == 'patient')
  {
    patient.findOne({_id:req.body.userId, otp: req.body.otp}, function(err, user)
    {
      if(user == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid OTP.'
        });
      }
      else
      {
        res.send({
          status: 1,
          data: null,
          error:'Valid OTP.'
        });
      }
    });
  }
  else if(loginAs == 'contact')
  {
    contacts.findOne({_id:req.body.userId, otp: req.body.otp}, function(err, user)
    {
      if(user == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid OTP.'
        });
      }
      else
      {
        res.send({
          status: 1,
          data: null,
          error:'Valid OTP.'
        });
      }
    });
  }
};

//**************** CHANGE PWD FROM APP FORGOT ******************

exports.forgotChangePassword = function(req, res)
{
  var loginAs  = req.body.type;
  var loginId  = req.body.id;
  var password = req.body.password;

  if(loginAs == 'facility')
  {
    users.update({_id: loginId},{$set:{ 'password': req.body.password } }, {new: true}, function(err, user) 
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
          msg:"Password updated successfully!"
        });
      }
    });
  }
  else if(loginAs == 'patient')
  {
    patient.update({_id: loginId},{$set:{ 'password': req.body.password } }, {new: true}, function(err, user) 
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
          msg:"Password updated successfully!"
        });
      }
    });
  }else if(loginAs == 'contact')
  {
    contacts.update({_id: loginId},{$set:{ 'password': req.body.password } }, {new: true}, function(err, user) 
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
          msg:"Password updated successfully!"
        });
      }
    });
  }
}


//**************** Get User Function ******************
exports.getUserdata = function(req, res)
{
  users.findOne({_id:req.body._id}, function(err, user)
  {
    if(user == null)
    {
      res.send({
        status: 0,
        data: null,
        error:'Invalid user.'
      });
    }else{
      res.json({
         status: 1,
         data: user,
         error:'User fetched successfully!'
      });
    }
  });
};


//******************** Otp_verification_function ************************
exports.otp_verification = function(req, res) {
  users.findOne({_id:req.body._id, otp: req.body.otp }, function(err, otp) {
    if (otp == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: otp
      });
    }
  });
};

//******************** GET USERS LIST ************************
exports.getAllOrganizations = function(req, res) {
  users.find({otpApproved:1},function(err, users) {
    if(users == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: users
      });
    }
  });
};

// Recent 10 Faculties----------------------------------------
exports.getRecentOrganizations = function(req, res) {
  users.find({otpApproved:1}, null, {limit: 10, sort: {'created_on': -1}}).exec( function(err, users) {

    if(users == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      var counter = 0,
          dict = {},
          data = [];

      function getPatientsCountByOrg(){
        if(counter < users.length){
          patient.find({'userId': users[counter]._id}, function(err, doc){
            dict = {
              _id: users[counter]._id,
              email: users[counter].email,
              firstname: users[counter].firstname,
              gender: users[counter].gender,
              image: users[counter].image,
              lastname: users[counter].lastname,
              organization_name: users[counter].organization_name,
              patientsCount: doc.length
            };

            data.push(dict);

            counter = counter + 1;

            getPatientsCountByOrg();
          });
        }else{
          res.json({
            error: null,
            status: 1,
            data: data
          });
        }
      };

      getPatientsCountByOrg();
    }
  });
};

//******************** Otp_verification_function ************************
exports.deleteuser = function(req, res) {
   users.remove({_id:req.body.userid}, function(err, user) {
      if(user == null)
      {
        res.send({
          error: err,
          status: 0,
          msg:"Try Again"
        });
      }
      else
      {
        res.json({
          error: null,
          status: 1,
          msg:"Deleted Successfully"
        });
      }
    });
};

exports.update_user = function(req, res) {
  users.update({_id: req.body._id},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email,'organization_name':req.body.organization_name, 'contact':req.body.contact, 'image':req.body.image, 'password': req.body.password, 'address': req.body.address } }, {new: true}, function(err, user) {
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
        msg:"Profile updated successfully!"
      });
    }
  });
};

//******************** Update user image function ************************
exports.update_user_image = function(req, res) {
  upload(req,res,function(err){
    var data = JSON.parse(req.body.fields);
    //console.log(data.userId)
    console.log(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    users.update({_id: req.params.id}, { $set: {logo: req.file.filename}}, {new: true}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  });
};

//******************** Upload image function ************************
exports.upload_image = function(req, res) {
  upload(req,res,function(err){
    res.json(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }   
  });
};

//**************** Update_user_profile_function ******************
exports.update_user_profile = function(req, res) {
    users.update({_id:req.params.id},
        { $set: 
          { firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            contact:req.body.contact,
            image:req.body.image,
            gpa:req.body.gpa,
            sat:req.body.sat,
            act:req.body.act,
            athletics:req.body.athletics,
            bench_press:req.body.bench_press,
            pro_agility:req.body.pro_agility,
            school:req.body.school,
            awards:req.body.awards,
            father_phone:req.body.father_phone,
            father_email:req.body.father_email,
            father_occupation:req.body.father_occupation,
            mother_phone:req.body.mother_phone,
            mother_email:req.body.mother_email,
            mother_occupation:req.body.mother_occupation,
            coverimage:req.body.coverimage,
            graduating:req.body.graduating,
          }}, {new: true}, function(err, user) {
            console.log(user, 'user')
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
          msg:"Profile updated successfully!"
        });
      }
    });
};

//**************** View_user_profile_function ******************
exports.viewprofile = function(req, res) {
  users.findOne({_id:req.body._id}, function(err, user) {
    if (user == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: user
      });
    }
  });
};
// //**************** Update_user_password_function ******************
exports.update_user_password = function(req, res) {
  console.log(req.body);
   users.findOne({_id:req.body._id}, function(err, user) {
    console.log(user)
       if (user == null){
      res.send({
        error: err,
        status: 0,
        data: null,
        msg: "Invalid user!"
      });
    }else{
      console.log(user.password, req.body.oldpassword);
      if(user.password == req.body.oldpassword){
          users.update({_id: req.body._id }, { $set: { password: req.body.newpassword}}, {new: true}, function(err, change) {
        if (change == null){
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
            msg:'Password updated successfully!'
          });
        }
        });
      }else{
      res.json({
        error: null,
        status: 0,
        data: user,
        msg:"The old password you have entered is incorrect."
      });
    }
    }

   })

};
//******************** User list for app ************************

exports.user_listing = function(req, res) {
 var data=[];
 var counter = 0,
 dict = {};
 var perPage = 10;
 var page =req.body.page;
 users.find({}, null, {sort: {'created_on': -1}})
       .skip((perPage * page) - perPage)
       .limit(perPage)
       .exec(function(err, user) {
          function list(){
           dict = user[counter];
           console.log(dict._id,"userid");
           users.findOne({_id: dict._id}, function(err, singleuser) {
            if(singleuser!=null){
            // users.find({"followers": { $elemMatch: { "userid": dict._id } } },function(err, userdata){
            // console.log(userdata,"followers",dict._id);
               dict.following = [];
               dict.username = singleuser.firstname+' '+singleuser.lastname ;
                data.push(dict);
                // console.log(data);
               if(counter < (user.length-1)){
                    counter = counter + 1;
                  list();
                }else{
                     res.send({
                     status: 1,
                     data: data,
                     current: page                
                });
               }
            // })
           }
         })
        };
       if(user.length==0){
         res.send({
           error: err,
           status: 0,
           data: []
         });
       }else{
         list();
       }
       })
 
};//******************** follow_user for app ************************

exports.follow = function(req, res) {
  users.findOne({'followers': {$elemMatch: {'userid': req.body.follower_id}}, '_id': req.body.following_id },function(err, check){
  console.log(check,"check");
  if(check == null){
     users.update({_id:req.body.following_id},{$push: {followers: {$each:[{id:req.body.id,userid:req.body.follower_id}]}}},{safe: true, upsert: true},function(err, doc) {
    console.log(doc,"dgdfg");
        if(err){
               res.json({
                   status: 0,
                   msg:'Try Again'
                });
            }else{
                  res.json({
                     status: 1,
                     followed_status:1,
                      msg:'followed successfully!'
                  });
               }
    })
 }else{
        users.update({_id:req.body.following_id},{ $pull: {followers :{userid : req.body.follower_id } } },{ multi: true },function(err, obj) {
        if(obj.nModified==1){
           res.json({
                     status: 1,
                     followed_status:0,
                      msg:'Unfollowed successfully!'
                  });
        }else{
          res.json({
                     status: 0,
                     msg:'Please try again.'
                  });
        }
      })
  }
  })
};

//**************** show users on add groups in app ******************
exports.show_users_addgroup = function(req, res) {
  var counter=0,
  data=[];

  users.findOne({_id:req.body._id}, function(err, user) {
    if (user == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
       users.find({'followers': {$elemMatch: {'userid': req.body._id}}},function(err, result){
          console.log(result,"+++++++++++");
          if(result.length>0){
          function list(){
            users.findOne({_id:result[counter]}, function(err, singleuser) {
              console.log(singleuser, "single");
              if(singleuser!=null){
              data.push(singleuser);
              }
          if(counter < (result.length-1)){
            counter = counter + 1;
            list();
          }else{
              res.json({
                status: 1,
                data: data
              });
          }
          });
          };
          list();
          }else{
             res.json({
              error: null,
              status: 0,
              data: []
            });
          }
        })
     
        
      



      // if(user.followers.length>0){
      //   function list(){
      //   users.findOne({_id:user.followers[counter].userid}, function(err, singleuser) {
      //     console.log(singleuser, "single");
      //     if(singleuser!=null){
      //     data.push(singleuser);
      //     }
      //   if(counter < (user.followers.length-1)){
      //     counter = counter + 1;
      //     list();
      //   }else{
      //       res.json({
      //         status: 1,
      //         data: data
      //       });
      //   }
      //   });
      //   };
      //   list();
      // }else{
      //    res.json({
      //     error: null,
      //     status: 0,
      //     data: []
      //   });
      // }
      
    }
  });
};