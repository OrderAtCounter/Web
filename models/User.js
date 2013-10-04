var mongoose = require('mongoose');
var mongooseModels = require('./MongooseModels');

var User = mongooseModels.User;

exports.findUserById = function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    if(err) {
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
}

exports.findUserByEmail = function(email, callback) {
  User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
    if(err) {
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
}