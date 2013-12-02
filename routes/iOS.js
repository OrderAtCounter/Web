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
        var session = new Session({lowerEmail: user.email.toLowerCase(), source: 'iOS'});
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
      var newPhoneNumber = '';
      for(var i = 0; i < phoneNumber.length; i++) {
        if(phoneNumber.charCodeAt(i) >= 48 && phoneNumber.charCodeAt(i) <= 57) {
          newPhoneNumber += phoneNumber.charAt(i);
        }
      }
      phoneNumber = newPhoneNumber;
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
  var orderId = req.body['orderId'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
        ensurePlan(user, function(err) {
          if(err) {
            res.send(500, err);
          }
          else {
            var message = user.settings.message;
            if(req.body['message']) {
              bodyMsg = req.body['message'];
            }
            else {
              bodyMsg = message;
            }
            Order.findOne({_id: orderId}, function(err, order) {
              if(err) {
                res.send(500, err);
              }
              else {
                if(order.message) {
                  bodyMsg = order.message;
                }
                bodyMsg += '\nOrder Number: ' + order.orderNumber + '.';
                twilioClient.sms.messages.create({
                to: order.phoneNumber,
                from: twilioNumber,
                body: bodyMsg
              }, function(err, message) {
                if(err) {
                  res.send(500, err);
                }
                else {
                  order.completed = true;
                  order.save(function(err) {
                    if(err) {
                      res.send(500, err);
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
        })
      });
    }
  });
}

exports.getMessage = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500);
    }
    else if(!session){
      res.send(500);
    }
    else {
      User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
        if(err) {
          res.send(500);
        }
        else if(!user) {
          res.send(500);
        }
        else {
          res.json({message: user.settings.message});
        }
      });
    }
  });
}

exports.updateMessage = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  var message = req.body['message'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500);
    }
    else if(!session){
      res.send(500);
    }
    else {
      User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
        if(err) {
          res.send(500);
        }
        else if(!user) {
          res.send(500);
        }
        else {
          user.settings.message = message;
          user.save(function(err) {
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
      Order.find({email: email, completed: false}, function(err, orders) {
        if(err) {
          res.send(500);
        }
        else {
          res.json(convertOrders(orders));
        }
      });
    }
  });
}

exports.getSettings = function(req, res) {
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
      res.json({settings: req.user.settings});
    }
  });
}

exports.getHistory = function(req, res) {
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
      Order.find({email: email, completed: true}, function(err, orders) {
        if(err) {
          res.send(500);
        }
        else {
          res.json(convertOrders(orders));
        }
      });
    }
  });
}

exports.deleteOrder = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  var orderId = req.body['orderId'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      Order.remove({_id: orderId, email: email}, function(err) {
        if(err) {
          res.send(500, err);
        }
        else {
          res.send(200);
        }
      });
    }
  });
}

exports.updateOrder = function(req, res) {
  var sessionId = req.body['sessionId'];
  var email = req.body['email'];
  var orderId = req.body['orderId'];
  var phoneNumber = req.body['phoneNumber'];
  var orderNumber = req.body['orderNumber'];
  var message = req.body['message'];
  ensureSession(email, sessionId, function(err, session) {
    if(err) {
      res.send(500, 'Error ensuring session.');
    }
    else if(!session) {
      res.send(500, 'Session does not exist.');
    }
    else {
      Order.findOne({_id: orderId, email: email}, function(err, order) {
        if(err) {
          res.send(500, err);
        }
        else if(!order) {
          res.send(500, "Order does not exist.");
        }
        else {
          order.phoneNumber = phoneNumber;
          order.orderNumber = orderNumber;
          if(message) {
            order.message = message;
          }
          order.save(function(err) {
            if(err) {
              res.send(500, err);
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

var ensureSession = function(email, sessionId, callback) {
  var ObjectId = mongoose.Types.ObjectId;
  Session.findOne({_id: new ObjectId(sessionId), lowerEmail: email.toLowerCase()}, function(err, session) {
    if(err) {
      callback(err);
    }
    else {
      callback(err, session);
    }
  });
}

var convertOrders = function(orders) {
  var convertedOrders = orders.map(function(order) {
    var timestamp = order._id.getTimestamp();
    var milliseconds = Date.parse(timestamp);
    var date = new Date();
    date.setTime(milliseconds);
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var AM = 'AM';
    if((hour > 12) || ((hour === 12) && (minute >= 0)) || ((hour === 12) && (second >= 0))) {
      hour = hour - 12;
      AM = 'PM';
    }
    if(hour == 0) {
      hour = 12;
      AM = 'AM';
    }
    if(minute < 10) {
      minute = '0' + minute;
    }
    order.timestamp = hour + ':' + minute + ' ' + AM;
    var areaCode = order.phoneNumber.slice(0, 3);
    var firstPhone = order.phoneNumber.slice(3, 6);
    var secondPhone = order.phoneNumber.slice(6, 10);
    order.phoneNumber = areaCode + '-' + firstPhone + '-' + secondPhone;
    return order;
  });
  return convertedOrders;
}

var ensurePlan = function(user, callback) {
  var settings = user.settings;
  var textLimit = user.settings.textLimit;
  var textCount = user.settings.textCount;
  if(settings.plan.status == "active") {
    if(textCount < textLimit) {
      callback(null);
    }
    else {
      callback('Over text limit.');
    }
  }
  else {
    callback(settings.plan.status);
  }
}