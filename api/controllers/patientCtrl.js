'use strict';

var mongoose = require('mongoose'),
multer 		 = require('multer'),
contacts   = mongoose.model('contacts'),
users 		 = mongoose.model('users'),
patient    = mongoose.model('patient');

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


//****************  Add Patient ****************************
exports.patient_add = function(req, res) 
{
	// patient.findOne({email: req.body.email, userId:{$eq: req.body.userId}}, function(err, user)
  patient.findOne({email: req.body.email}, function(err, user)
  {
    if(user == null)
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
              var new_patient = new patient({
                userId:    req.body.userId,
                firstname: req.body.firstname,
                lastname:  req.body.lastname,
                email:     req.body.email,
                contact:   req.body.contact,
                password:  req.body.password,
                gender:    req.body.gender,
                room_no:   req.body.room_no,
                otp:       '123456',
                image:     null,
                created_on: new Date()
              });

              new_patient.save(function(err, users)
              {
                var fullname = req.body.firstname+' '+req.body.lastname;

                //--SEND EMAIL-------------------------------
                  var string  = 'Don'+'\''+'t worry, we all forget sometimes';
                  var fs      = require('fs'); // npm install fs
                  var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/patient.html', 'utf8');
                  let dynamic_data = '';
                  
                  readStream.on('data', function(chunk) {
                    dynamic_data += chunk;
                  }).on('end', function() 
                  {
                    var helper    = require('sendgrid').mail;
                    
                    var fromEmail = new helper.Email('25userdemo@gmail.com','KIN');
                    var toEmail   = new helper.Email(req.body.email);
                    var subject   = 'Account Created As Patient';

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

exports.patient_token_save = function(req, res)
{
  patient.update({_id: req.body.userId }, { $set: { token: req.body.token}}, {new: true}, function(err, change) 
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
        msg:'Patient token updated successfully!'
      });
    }
  });
};

//**************** Login Patient ******************
exports.patient_login = function(req, res) 
{
  patient.findOne({email:req.body.email, password:req.body.password}, function(err, user)
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

//***** Get organization patients*********************
exports.patient_get = function(req, res) 
{
  patient.find({userId: req.body.userId}, function(err, user)
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
         error:'Patients fetched successfully'
      });
    }
  });
};

exports.getPatientDetails = function(req, res)
{
  patient.findOne({_id:req.body._id}, function(err, patient)
  {
    if(patient == null)
    {
      res.send({
        status: 0,
        data: null,
        error:'Invalid patient.'
      });
    }else{
      res.json({
         status: 1,
         data: patient,
         error:'Patient fetched successfully!'
      });
    }
  });
};

exports.getPatientDataByContact = function(req, res)
{
  contacts.findOne({_id:req.body.contactId}, function(err, patientget)
  {
    patient.findOne({_id:patientget.patientId}, function(err, patient)
    {
      if(patient == null)
      {
        res.send({
          status: 0,
          data: null,
          error:'Invalid patient.'
        });
      }else{
        res.json({
           status: 1,
           data: patient,
           error:'Patient fetched successfully!'
        });
      }
    });
  });
};

exports.patient_all = function(req, res) 
{
  patient.find({}, function(err, user)
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
         error:'Patients fetched successfully'
      });
    }
  });
};

exports.patient_all_with_faculty = function(req, res) {
  patient.find({}, function(err, mem)
  {
    if(mem == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      var counter = 0,
          dict = {},
          data = [];

      function getPatientsfaculty()
      {
        if(counter < mem.length)
        {
          users.find({'_id': mem[counter].userId}, function(err, doc){
            dict = {
              _id: mem[counter]._id,
              email: mem[counter].email,
              firstname: mem[counter].firstname,
              gender: mem[counter].gender,
              lastname: mem[counter].lastname,
              contact: mem[counter].contact,
              room_no: mem[counter].room_no,
              faculty: doc
            };

            data.push(dict);

            counter = counter + 1;

            getPatientsfaculty();
          });
        }else{
          res.json({
            error: null,
            status: 1,
            data: data
          });
        }
      };

      getPatientsfaculty();
    }
  });
};

//**************** Update Patient ******************
exports.patient_update = function(req, res)
{
  patient.update({_id: req.body.patientId},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'contact':req.body.contact} }, {new: true}, function(err, user) {
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

exports.patient_profile_update = function(req, res)
{
  patient.update({_id: req.body.patientId},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'contact':req.body.contact, 'password':req.body.password} }, {new: true}, function(err, user) 
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
      patient.findOne({_id:req.body.patientId}, function(err, fullData)
      {
        res.json({
          error: null,
          status: 1,
          data:fullData,
          msg:"Patient updated successfully!"
        });
      });
      
    }
  });
};

exports.patient_update_Admin = function(req, res)
{
  patient.update({_id: req.body.patientId},{$set:{ 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email, 'contact':req.body.contact, 'room_no':req.body.room_no} }, {new: true}, function(err, user) {
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

//**************** Delete Patient ******************
exports.patient_delete = function(req, res) {
   patient.remove({_id:req.body.patientId}, function(err, user) {
      if(user == null)
      {
        res.send({
          error: err,
          status: 0,
          msg:"Try Again"
        });
      }else{
        res.json({
          error: null,
          status: 1,
          msg:"Deleted Successfully"
        });
      }
    });
};


exports.patient_upload_image = function(req, res) {
  upload(req,res,function(err)
  {
    res.json(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }   
  });
};