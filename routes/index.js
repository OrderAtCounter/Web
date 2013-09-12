var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String
});

var SessionSchema = new Schema({
  username: String
});

var User = mongoose.model('User', UserSchema);
var Session = mongoose.model('Session', SessionSchema);

exports.createAccount = function(req, res) {
  var username = req.body['username'];
  var password = req.body['password'];
  User.findOne({username: username}, function(err, user) {
    if(err) {
      res.send(500);
    }
    else if(user) {
      res.send(500);
    }
    else {
      var newUser = new User({username: username, password: password});
      newUser.save(function(err, returnedUser) {
        if(err) {
          res.send(500);
        }
        else {
          var session = new Session({'username': username});
          session.save(function(err, returnedSession) {
            if(err) {
              res.send(500);
            }
            else {
              var sessionId = returnedSession._id;
              res.json({'sessionId': sessionId});
            }
          });
        }
      });
    }
  });
}

exports.login = function(req, res) {
  var username = req.body['username'];
  var password = req.body['password'];
  User.findOne({'username': username}, function(err, user) {
    if(!user) {
      res.send(500);
    }
    else if(user.password === password) {
      var session = new Session({'username': username});
      session.save(function(err, returnedSession) {
        if(err) {
          res.send(500);
        }
        else {
          var sessionId = returnedSession._id;
          res.json({'sessionId': sessionId});
        }
      });
    }
    else {
      res.send(500);
    }
  });
}

exports.logout = function(req, res) {
  var username = req.body['username'];
  var sessionId = req.body['sessionId'];
  Session.findOne({sessionId: sessionId, username: username}, function(err, session) {
    if(err) {
      res.send(500);
    }
    else if(session) {
      session.remove(function(err) {
        if(err) {
          res.send(500);
        }
        else {
          res.send(200);
        }
      });
    }
    else {
      res.send(500);
    }
  });
}