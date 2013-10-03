var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;

/* POST for logging in */
exports.login = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  console.log(req.body);
  User.findOne({email: email}, function(err, user) {
    if(err) {
      res.send(500, 'There was an error in searching through the User collection for a user.')
    }
    else {
      if(!user) {
        res.send(500, 'There is no user with that email.');
      }
      else if(user.password === password) {
        var session = new Session({email: email, source: 'iOS'});
        session.save(function(err, returnedSession) {
          if(err) {
            res.send(500, 'There was an error in saving the new session.');
          }
          else {
            var sessionId = returnedSession._id;
            res.json({'sessionId': sessionId});
          }
        });
      }
      else {
        res.send(500, 'Passwords do not match.');
      }
    }
  });
}

/* POST for logging out */
exports.logout = function(req, res) {
  var email = req.body['email'];
  var sessionId = req.body['sessionId'];
  Session.findOne({_id: sessionId, email: email}, function(err, session) {
    if(err) {
      res.send(500, 'Database/Server error finding the session.');
    }
    else if(session) {
      session.remove(function(err) {
        if(err) {
          res.send(500, 'Database/Server error removing the session.');
        }
        else {
          res.send(200);
        }
      });
    }
    else {
      res.send(500, 'Session does not exist.');
    }
  });
}

/* POST for creating order */
exports.createOrder = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring the session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      var orderNumber = req.body['orderNumber'];
      var phoneNumber = req.body['phoneNumber'];
      var order = new Order({orderNumber: orderNumber, phoneNumber: phoneNumber, email: email});
      order.save(function(err, newOrder) {
        if(err) {
          res.send(500, 'Database/Server error saving new order.');
        }
        else {
          res.json({orderNumber: orderNumber});
        }
      });
    }
  });
}

exports.removeOrder = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  var orderNumber = req.body['orderNumber'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      Order.remove({orderNumber: orderNumber, email: email}, function(err) {
        if(err) {
          res.send(500, 'Error removing the order.');
        }
        else {
          res.json({orderNumber: orderNumber});
        }
      });
    }
  });
}

var ensureSession = function(email, sessionId, callback) {
  Session.findOne({_id: sessionId, email: email}, function(err, session) {
    if(err) {
      callback(err);
    }
    else {
      callback(err, session);
    }
  });
}