var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;
var Contact = mongooseModels.Contact;

/* POST for creating account */
exports.createAccount = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  User.findOne({email: email}, function(err, user) {
    if(err) {
      res.send(500, 'There was an error in searching through the User collection for a user.');
    }
    else if(user) {
      res.send(500, 'There is already a user with that username.');
    }
    else {
      var newUser = new User({email: email, password: password});
      newUser.save(function(err, returnedUser) {
        if(err) {
          res.send(500, 'There was an error in saving the new user.');
        }
        else {
          var session = new Session({email: returnedUser.email});
          session.save(function(err, returnedSession) {
            if(err) {
              res.send(500, 'There was an error in saving the new session.');
            }
            else {
              var sessionId = returnedSession._id;
              res.send(200, {'sessionId': sessionId});
            }
          });
        }
      });
    }
  });
}

/* GET for creating acount */
exports.getCreateAccount = function(req, res) {
  res.render('createAccount');
}

/* GET for index */
exports.getIndex = function(req, res) {
  res.render('index', {user: req.user});
}