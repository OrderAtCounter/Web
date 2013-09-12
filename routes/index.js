var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String
});

var SessionSchema = new Schema({
  username: String,
  source: String
});

var OrderSchema = new Schema({
  number: Number,
  User: 
});

var User = mongoose.model('User', UserSchema);
var Session = mongoose.model('Session', SessionSchema);

exports.createAccount = function(req, res) {
  var username = req.body['username'];
  var password = req.body['password'];
  User.findOne({username: username}, function(err, user) {
    if(err) {
      res.send(500, 'There was an error in searching through the User collection for a user.');
    }
    else if(user) {
      res.send(500, 'There is already a user with that username.');
    }
    else {
      var newUser = new User({username: username, password: password});
      newUser.save(function(err, returnedUser) {
        if(err) {
          res.send(500, 'There was an error in saving the new user.');
        }
        else {
          var session = new Session({'username': username});
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
      });
    }
  });
}