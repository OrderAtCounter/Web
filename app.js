var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , webRoutes = require('./routes')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models/User')
  , RedisStore = require('connect-redis')(express);

var app = express();

var redisOptions = {};

if(process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler());
  var envFile = fs.readFileSync('./.env', 'utf-8');  
  envFile = envFile.split('\n');
  for(var i = 0; i < envFile.length; i++) {
    var variable = envFile[i].split('=');
    process.env[variable[0]] = variable[1];
  }
}

else if(process.env.NODE_ENV === 'production') { 
  redisOptions.pass = process.env.redisPass;
}

else {
  console.log('You need to set your process variable to either production or development to load in your environment variables.');
}

var iOSRoutes = require('./routes/iOS');

var redisOptions = {};

redisOptions.host = process.env.redisHost;
redisOptions.port = process.env.redisPort;
var iOSRoutes = require('./routes/iOS');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.methodOverride());
app.use(express.session({secret: 'test', store: new RedisStore(redisOptions)}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.mongooseURL);

passport.serializeUser(function(user, callback) {
  callback(null, user._id);
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
app.get('/signup', webRoutes.getCreateAccount);
app.get('/login', webRoutes.getLogin);
app.get('/logout', webRoutes.getLogout);
app.get('/settings', ensureAuthenticated, webRoutes.getSettings);

/* Web POST routes */
app.post('/signup', webRoutes.createAccount);
app.post('/loginUser', webRoutes.login);
app.post('/createOrder', ensureAuthenticated, webRoutes.createOrder);
app.post('/settings', ensureAuthenticated, webRoutes.updateAccountSettings);
app.post('/messageSettings', ensureAuthenticated, webRoutes.updateMessageSettings);
app.post('/addSubscription', ensureAuthenticated, webRoutes.addSubscription);
app.post('/fulfillOrder', ensureAuthenticated, webRoutes.fulfillOrder);

/* iOS GET Routes */
app.get('/iOSSettings', iOSRoutes.getSettings);
app.get('/iOSOrders', iOSRoutes.getOrders);

/* iOS POST Routes */
app.post('/iOSLogin', iOSRoutes.login);
app.post('/iOSLogout', iOSRoutes.logout);
app.post('/iOSOrder', iOSRoutes.createOrder);
app.post('/iOSFulfillOrder', iOSRoutes.fulfillOrder);

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