'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
   
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
    created_on: {
      type: Date
    },
    image: {
      type: String
    }
});

module.exports = mongoose.model('admin', adminSchema);