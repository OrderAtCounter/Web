var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , webRoutes = require('./routes')
  , iOSRoutes = require('./routes/iOS')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models/User');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({secret: 'test'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler());
  var envFile = fs.readFileSync('./.env', 'utf-8');  
  envFile = envFile.split('\n');
  for(var i = 0; i < envFile.length; i++) {
    var variable = envFile[i].split('=');
    process.env[variable[0]] = variable[1];
  }
}

mongoose.connect(process.env.mongooseURL);

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  User.findUserById(id, function(err, user) {
    if(err) {
      callback(err);
    }
    else {
      callback(null, user);
    }
  });
});

passport.use(new LocalStrategy(
  function(email, password, callback) {
    process.nextTick(function() {
      User.findUserByEmail(email, function(err, user) {
        if(err) {
          callback(err);
        }
        else if(!user) {
          callback(null, false);
        }
        else if(user.password !== password) {
          callback(null, false);
        }
        else {
          callback(null, user);
        }
      });
    });
  }
));

/* Web GET routes */
app.get('/', webRoutes.getIndex);
app.get('/createAccount', webRoutes.getCreateAccount);

/* Web POST routes */
app.post('/createAccount', webRoutes.createAccount);

app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
  }
);

/* iOS GET Routes */

/* iOS POST Routes */
app.post('/iOSLogin', iOSRoutes.login);
app.post('/iOSLogout', iOSRoutes.logout);
app.post('/iOSOrder', iOSRoutes.createOrder);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, callback) {
  if(req.isAuthenticated()) {
    callback();
  }
  else {
    res.redirect('/login');
  }
}