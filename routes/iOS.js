var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;
var Contact = mongooseModels.Contact;

/* POST for logging in */
exports.login = function(req, res) {
  var username = req.body['username'];
  var password = req.body['password'];
  User.findOne({'username': username}, function(err, user) {
    if(err) {
      res.send(500, 'There was an error in searching through the User collection for a user.')
    }
    else {
      if(!user) {
        res.send(500, 'There is no user with that username.');
      }
      else if(user.password === password) {
        var session = new Session({'username': username, source: 'iOS'});
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
  var username = req.body['username'];
  var sessionId = req.body['sessionId'];
  Session.findOne({_id: sessionId, username: username}, function(err, session) {
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
  var username = req.body['username'];
  Session.findOne({_id: sessionId, username: username}, function(err, session) {
    if(err) {
      res.send(500, 'Database/Server error finding the session.');
    }
    else if(session) {
      var orderNumber = req.body['orderNumber'];
      var phoneNumber = req.body['phoneNumber'];
      var contact = new Contact({phoneNumber: phoneNumber});
      contact.save(function(err, newContact) {
        if(err) {
          res.send(500, 'Database/Server error saving the contact.');
        }
        else {
          var order = new Order({orderNumber: orderNumber, Contact: newContact._id});
          order.save(function(err, newOrder) {
            if(err) {
              res.send(500, 'Database/Server error while saving new order.');
            }
            else {
              User.findOne({username: username}, function(err, user) {
                if(err) {
                  res.send(500, 'Database/Server error finding the user.');
                }
                else if(user) {
                  user.Orders.push(newOrder._id);
                  user.save(function(err) {
                    if(err) {
                      res.send(500, 'Database/Server error saving the user.');
                    }
                    else {
                      res.send(200);
                    }
                  });
                }
                else {
                  res.send(500, 'User does not exist.');
                }
              });
            }
          });
        }
      });
    }
    else {
      res.send(500, 'Session does not exist. Username may or may not be correct. No guarantees on server end on which was wrong.');
    }
  });
}