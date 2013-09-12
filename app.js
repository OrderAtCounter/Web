var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , webRoutes = require('./routes')
  , iOSRoutes = require('./routes/iOS');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
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

/* Web GET routes */
app.get('/createAccount', webRoutes.getCreateAccount);

/* Web POST routes */
app.post('/createAccount', webRoutes.createAccount);


/* iOS GET Routes */

/* iOS POST Routes */
app.post('/iOSLogin', iOSRoutes.login);
app.post('/iOSLogout', iOSRoutes.logout);
app.post('/iOSOrder', iOSRoutes.createOrder);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
