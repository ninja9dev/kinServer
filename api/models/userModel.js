'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   
    firstname : {
      type: String
    },
    lastname : {
      type: String
    },
    email: {
      type: String,
    },
    organization_name: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type : String
    },
    created_on: {
      type: Date
    },
    gender: {
      type: String
    },
    provider: {
      type: String
    },
    token: {
      type: String
    },
    otp: {
      type: String
    },
    otpApproved: {
      type:  Number
    },
    image: {
      type: String
    }
});

module.exports = mongoose.model('users', userSchema);