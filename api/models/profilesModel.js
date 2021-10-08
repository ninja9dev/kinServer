'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profilesSchema = new Schema({
    name : {
      type: String
    },
    image : {
      type: String
    },
    room : {
      type: String
    },
    dob: {
      type: Date,
    },
    userId: {
      type : String
    },
    created_on: {
      type: Date
    }
});

module.exports = mongoose.model('profiles', profilesSchema);