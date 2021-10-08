'use strict';

module.exports = function(app) {

//----- AdminPanel------------------------------
var adduser = require('../controllers/adminCtrl');
   app.route('/createAdmin')
     .post(adduser.createAdmin);

var adduser = require('../controllers/adminCtrl');
   app.route('/getAdminByID')
     .post(adduser.getAdminByID);

var adduser = require('../controllers/adminCtrl');
   app.route('/deleteAllAdmin')
     .post(adduser.deleteAllAdmin);

var adduser = require('../controllers/adminCtrl');
   app.route('/adminLogin')
     .post(adduser.adminLogin);

var adduser = require('../controllers/adminCtrl');
   app.route('/adminUpdate')
     .post(adduser.adminUpdate);

//----- Users As Organization------------------------------
var adduser = require('../controllers/userCtrl');
   app.route('/registerUser')
     .post(adduser.registerUser);

var adduser = require('../controllers/userCtrl');
   app.route('/registerUserFromApp')
     .post(adduser.registerUserFromApp);

var adduser = require('../controllers/userCtrl');
   app.route('/verifyOtp')
     .post(adduser.verifyOtp);

var adduser = require('../controllers/userCtrl');
   app.route('/socialLogin')
     .post(adduser.socialLogin);

var adduser = require('../controllers/userCtrl');
   app.route('/getAllOrganizations')
     .post(adduser.getAllOrganizations);

var adduser = require('../controllers/userCtrl');
   app.route('/getRecentOrganizations')
     .post(adduser.getRecentOrganizations);

var adduser = require('../controllers/userCtrl');
   app.route('/getOrganizationDetails')
     .post(adduser.getUserdata);

var adduser = require('../controllers/userCtrl');
   app.route('/update_user')
     .post(adduser.update_user);

var adduser = require('../controllers/userCtrl');
   app.route('/update_user_otp')
     .post(adduser.update_user_otp);

var adduser = require('../controllers/userCtrl');
   app.route('/update_orgFromAdmin')
     .post(adduser.update_orgFromAdmin);

var adduser = require('../controllers/userCtrl');
   app.route('/login')
     .post(adduser.login);
     
var adduser = require('../controllers/userCtrl');
   app.route('/upload_image')
     .post(adduser.upload_image);

var adduser = require('../controllers/userCtrl');
   app.route('/deleteuser')
     .post(adduser.deleteuser);

var adduser = require('../controllers/userCtrl');
   app.route('/forgot_password')
     .post(adduser.forgot_password);

var adduser = require('../controllers/userCtrl');
   app.route('/forgotChangePassword')
     .post(adduser.forgotChangePassword);


var adduser = require('../controllers/userCtrl');
   app.route('/verifyOtpForgotPwd')
     .post(adduser.verifyOtpForgotPwd);

var adduser = require('../controllers/userCtrl');
   app.route('/facility_token_save')
     .post(adduser.facility_token_save);


//----- Patients----------------------------------------
var patient = require('../controllers/patientCtrl');
   app.route('/patient_add')
     .post(patient.patient_add);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_get')
     .post(patient.patient_get);

var adduser = require('../controllers/patientCtrl');
   app.route('/getPatientDetails')
     .post(adduser.getPatientDetails);

var adduser = require('../controllers/patientCtrl');
   app.route('/getPatientDataByContact')
     .post(adduser.getPatientDataByContact);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_update')
     .post(patient.patient_update);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_profile_update')
     .post(patient.patient_profile_update);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_update_Admin')
     .post(patient.patient_update_Admin);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_all')
     .post(patient.patient_all);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_all_with_faculty')
     .post(patient.patient_all_with_faculty);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_delete')
     .post(patient.patient_delete);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_login')
     .post(patient.patient_login);
     
var patient = require('../controllers/patientCtrl');
   app.route('/patient_upload_image')
     .post(patient.patient_upload_image);

var patient = require('../controllers/patientCtrl');
   app.route('/patient_token_save')
     .post(patient.patient_token_save);

//----- PATIENT CONTACTS -------------------------------
var contacts = require('../controllers/contactsCtrl');
   app.route('/addContact')
     .post(contacts.addContact);

var adduser = require('../controllers/contactsCtrl');
   app.route('/getContactDetails')
     .post(adduser.getContactDetails);

var contacts = require('../controllers/contactsCtrl');
   app.route('/updateContact')
     .post(contacts.updateContact);

var contacts = require('../controllers/contactsCtrl');
   app.route('/contact_update_Admin')
     .post(contacts.contact_update_Admin);

var contacts = require('../controllers/contactsCtrl');
   app.route('/getContacts')
     .post(contacts.getContacts);

var contacts = require('../controllers/contactsCtrl');
   app.route('/contacts_all')
     .post(contacts.contacts_all);

var contacts = require('../controllers/contactsCtrl');
   app.route('/getContactByID')
     .post(contacts.getContactByID);

var contacts = require('../controllers/contactsCtrl');
   app.route('/deleteContact')
     .post(contacts.deleteContact);

var contacts = require('../controllers/contactsCtrl');
   app.route('/deleteAllContact')
     .post(contacts.deleteAllContact);

var contacts = require('../controllers/contactsCtrl');
   app.route('/findReports')
     .post(contacts.findReports);
     
var contacts = require('../controllers/contactsCtrl');
   app.route('/contact_token_save')
     .post(contacts.contact_token_save);


//----- Profile Page Callings-------------------------------
var profiles = require('../controllers/profilesCtrl');
   app.route('/addProfile')
     .post(profiles.addProfile);

var profiles = require('../controllers/profilesCtrl');
   app.route('/updateProfile')
     .post(profiles.updateProfile);

var profiles = require('../controllers/profilesCtrl');
   app.route('/getProfiles')
     .post(profiles.getProfiles);

var profiles = require('../controllers/profilesCtrl');
   app.route('/getProfileByID')
     .post(profiles.getProfileByID);

var profiles = require('../controllers/profilesCtrl');
   app.route('/deleteProfile')
     .post(profiles.deleteProfile);

//----- CALLS -------------------------------

var calls = require('../controllers/callsCtrl');
   app.route('/addCall')
     .post(calls.addCall);

var calls = require('../controllers/callsCtrl');
   app.route('/addCallRequest')
     .post(calls.addCallRequest);

var calls = require('../controllers/callsCtrl');
   app.route('/getCalls')
     .post(calls.getCalls);
     
var calls = require('../controllers/callsCtrl');
   app.route('/getCallsForContact')
     .post(calls.getCallsForContact);
     
var calls = require('../controllers/callsCtrl');
   app.route('/getCallsForContactRequests')
     .post(calls.getCallsForContactRequests);

var calls = require('../controllers/callsCtrl');
   app.route('/getCallsForPatient')
     .post(calls.getCallsForPatient);

var calls = require('../controllers/callsCtrl');
   app.route('/getProfileCalls')
     .post(calls.getProfileCalls);
     
var calls = require('../controllers/callsCtrl');
   app.route('/getCallsForFacility')
     .post(calls.getCallsForFacility);

var calls = require('../controllers/callsCtrl');
   app.route('/deleteCall')
     .post(calls.deleteCall);

var calls = require('../controllers/callsCtrl');
   app.route('/deleteAllCalls')
     .post(calls.deleteAllCalls);

var calls = require('../controllers/callsCtrl');
   app.route('/updateCall')
     .post(calls.updateCall);

var calls = require('../controllers/callsCtrl');
   app.route('/acceptCallStatus')
     .post(calls.acceptCallStatus);
          
var calls = require('../controllers/callsCtrl');
   app.route('/declineCallStatus')
     .post(calls.declineCallStatus);

//---- CHAT ----------------------------------
     
var chat = require('../controllers/chatCtrl');
   app.route('/list_messages')
     .post(chat.list_messages);
     
var chat = require('../controllers/chatCtrl');
   app.route('/getChat')
     .post(chat.chat_listing);

var chat = require('../controllers/chatCtrl');
   app.route('/saveMessage')
     .post(chat.save_message);

var chat = require('../controllers/chatCtrl');
   app.route('/create_chat')
     .post(chat.create_chat);
var chat = require('../controllers/chatCtrl');
   app.route('/clear_all_chat')
     .post(chat.clear_all_chat);

};