var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;

/* POST for creating account */
exports.createAccount = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  var confirmPassword = req.body['confirmPassword'];
  var businessName = req.body['businessName'];
  if(password !== confirmPassword) {
    res.send(500, 'Passwords do not match.');
  }
  else {
    User.findOne({email: email}, function(err, user) {
      if(err) {
        res.send(500, 'There was an error in searching through the User collection for a user.');
      }
      else if(user) {
        res.send(500, 'There is already a user with that username.');
      }
      else {
        var newUser = new User({email: email, password: password, businessName: businessName});
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
                req.login(returnedUser, function(err) {
                  if(err) {
                    res.send(500, 'Error logging in after creating account.');
                  }
                  else {
                    res.redirect('/');
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

/* POST for logging in */
exports.login = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  User.findOne({email: email}, function(err, user) {
    if(err) {
      res.send(500, 'Error while finding user.');
    }
    else if(!user) {
      res.send(500, 'User does not exist with that email.');
    }
    else {
      req.login(user, function(err) {
        if(err) {
          res.send(500, 'Error logging in.');
        }
        else {
          res.redirect('/');
        }
      });
    }
  });
}

/* POST for creating order */
exports.createOrder = function(req, res) {
  var orderNumber = req.body['orderNumber'];
  var phoneNumber = req.body['phoneNumber'];
  phoneNumber = phoneNumber.replace(/\D/g, '');
  var user = req.user;
  var order = new Order({orderNumber: orderNumber, phoneNumber: phoneNumber});
  order.save(function(err, newOrder) {
    if(err) {
      res.send(500, 'Error saving order.');
    }
    else {
      user.Orders.push(newOrder._id);
      user.save(function(err) {
        if(err) {
          res.send('Error updating User with new Order.');
        }
        else {
          res.send(200);
        }
      });
    }
  });
}

/* POST for removing order */
exports.removeOrder = function(req, res) {
  var orderNumber = req.body['orderNumber'];
  var user = req.user;
  Order.findOne({_id: {$in: user.Orders}, orderNumber: orderNumber}, function(err, order) {
    if(err) {
      res.send(500, 'Error finding order to remove.');
    }
    else {
      var index = user.Orders.indexOf(order._id);
      user.Orders.splice(index, 1);
      user.save(function(err) {
        if(err) {
          res.send(500, 'Error saving user.');
        }
        else {
          res.send(200);
        }
      });
    }
  });
}

/* GET for creating acount */
exports.getCreateAccount = function(req, res) {
  res.render('createAccount');
}

/* GET for logging in */
exports.getLogin = function(req, res) {
  res.render('login');
}

/* GET for logging out */
exports.getLogout = function(req, res) {
  req.logout();
  res.redirect('/');
}

/* GET for index */
exports.getIndex = function(req, res) {
  if(req.user) {
    Order.find({_id: {$in: req.user.Orders}}, function(err, orders) {
      if(err) {
        res.send(500, 'Error finding orders.');
      }
      else {
        res.render('index', {user: req.user, orders: orders});
      }
    });
  }
  else {
    res.render('landing');
  }
}