var mongoose = require('mongoose');

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

exports.logout = function(req, res) {
  var username = req.body['username'];
  var sessionId = req.body['sessionId'];
  Session.findOne({sessionId: sessionId, username: username}, function(err, session) {
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