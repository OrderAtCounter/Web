var mongoose = require('mongoose');
var mongooseModels = require('../models/MongooseModels');

var User = mongooseModels.User;
var Session = mongooseModels.Session;
var Order = mongooseModels.Order;
var api_key = process.env.STRIPE_TEST_KEY;
var stripe = require('stripe')(api_key);

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
    User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
      if(err) {
        res.send(500, 'There was an error in searching through the User collection for a user.');
      }
      else if(user) {
        res.send(500, 'There is already a user with that username.');
      }
      else {
        var newUser = new User({email: email, lowerEmail: email.toLowerCase(), password: password, businessName: businessName});
        newUser.save(function(err, returnedUser) {
          if(err) {
            res.send(500, 'There was an error in saving the new user.');
          }
          else {
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
}

/* POST for logging in */
exports.login = function(req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  User.findOne({lowerEmail: email.toLowerCase()}, function(err, user) {
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
  Order.findOne({orderNumber: orderNumber, email: user.email}, function(err, orderExists) {
    if(err) {
      res.send(500, 'Error finding if order exists.');
    }
    else if(orderExists){
      res.send(500, 'Order exists.');
    }
    else {
      var order = new Order({orderNumber: orderNumber, phoneNumber: phoneNumber, email: user.email});
      order.save(function(err, newOrder) {
        if(err) {
          res.send(500, 'Error saving order.');
        }
        else {
          res.send(200, newOrder);
        }
      });
    }
  });
}

/* POST for removing order */
exports.removeOrder = function(req, res) {
  var orderNumber = req.body['orderNumber'];
  var user = req.user;
  Order.remove({orderNumber: orderNumber, email: user.email}, function(err) {
    if(err) {
      res.send(500, 'Error removing order.');
    }
    else {
      res.send(200);
    }
  });
}

/* POST for updating account settings */
exports.updateAccountSettings = function(req, res) {
  var user = req.user;
  var email = req.body['email'];
  var businessName = req.body['businessName'];
  user.email = email;
  user.businessName = businessName;
  user.save(function(err) {
    if(err) {
      res.send(500, 'Error updating account.');
    }
    else {
      var data = {businessName: businessName, email: email};
      res.json(data);
    }
  });
}

/* POST for updating message settings */
exports.updateMessageSettings = function(req, res) {
  var user = req.user;
  var message = req.body['message'];
  user.settings.message = message;
  user.save(function(err) {
    if(err) {
      res.send(500, 'Error updating message settings.');
    }
    else {
      var data = {message: message};
      res.json(data);
    }
  });
}

exports.addSubscription = function(req, res) {
  var id = req.body['id'];
  stripe.customers.create({
    email: req.user.email
  }, function(err, customer) {
    stripe.customers.update_subscription(customer.id, {
      plan: 1,
      card: id
    }, function(err) {
      if(err) {
        console.log(err);
        res.send(500)
      }
      else {
        res.send(200);
      }
    });
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
    Order.find({email: req.user.email}, function(err, orders) {
      if(err) {
        res.send(500, 'Error finding orders.');
      }
      else {
        orders = orders.map(function(order) {
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
          order.timestamp = hour + ':' + minute + ' ' + AM;

          var areaCode = order.phoneNumber.slice(0, 3);
          var firstPhone = order.phoneNumber.slice(3, 6);
          var secondPhone = order.phoneNumber.slice(6, 10);
          order.phoneNumber = areaCode + '-' + firstPhone + '-' + secondPhone;
          return order;
        });
        res.render('index', {user: req.user, orders: orders});
      }
    });
  }
  else {
    res.render('landing');
  }
}

/* GET for settings */
exports.getSettings = function(req, res) {
  if(req.user) {
    res.render('settings', {user: req.user});
  }
  else {
    res.send(403);
  }
}