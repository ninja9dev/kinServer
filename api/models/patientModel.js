'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = new Schema({
   
    userId : {
      type: String
    },
    firstname : {
      type: String
    },
    lastname : {
      type: String
    },
    email: {
      type: String,
    },
    password: {
      type : String
    },
    contact: {
      type : String
    },
    created_on: {
      type: Date
    },
    gender: {
      type: String
    },
    room_no: {
      type: String
    },
    token: {
      type: String
    },
    otp: {
      type: String
    },
    provider: {
      type: String
    },
    image: {
      type: String
    }
});

module.exports = mongoose.model('patient', patientSchema);