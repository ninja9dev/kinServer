'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactsSchema = new Schema({
    patientId:{
      type: String
    },
    name : {
      type: String
    },
    phone : {
      type: String
    },
    email : {
      type: String
    },
    password: {
      type : String
    },
    userId: {
      type : String
    },
    token: {
      type: String
    },
    otp: {
      type: String
    },
    isAppUser: {
      type : Number
    },
    created_on: {
      type: Date
    }
});

module.exports = mongoose.model('contacts', contactsSchema);