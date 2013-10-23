var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');
var twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioNumber = process.env.TWILIO_NUMBER;

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;

/* POST for logging in */
exports.login = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
    if(err) {
      res.send(500, 'There was an error in searching through the User collection for a user.')
    }
    else {
      if(!user) {
        res.send(500, 'There is no user with that email.');
      }
      else if(user.password === password) {
        var session = new Session({email: user.email, source: 'iOS'});
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
  Session.findOne({_id: sessionId, lowerEmail: email.toLowerCase()}, function(err, session) {
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

exports.fulfillOrder = function(req, res) {
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
      var user = req.user;
      var message = user.settings.message;
      twilioClient.sms.messages.create({
        to: '7703554412',
        from: twilioNumber,
        body: message
      }, function(err, message) {
        if(err) {
          res.send(500);
        }
        else {
          Order.remove({email: user.email, orderNumber: orderNumber}, function(err) {
            if(err) {
              res.send(500);
            }
            else {
              res.send(200);
            }
          });
        }
      });
    }
  });
}

exports.getOrders = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      Order.find({email: email}, function(err, orders) {
        if(err) {
          res.send(500);
        }
        else {
          res.send(200, orders);
        }
      });
    }
  });
}

var ensureSession = function(email, sessionId, callback) {
  Session.findOne({_id: sessionId, lowerEmail: email.toLowerCase()}, function(err, session) {
    if(err) {
      callback(err);
    }
    else {
      callback(err, session);
    }
  });
}