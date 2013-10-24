var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  lowerEmail: String,
  password: String,
  businessName: String,
  settings: {
    message: {type: String, default: 'Your order is ready!'},
    plan: String
  }
});

var SessionSchema = new Schema({
  lowerEmail: String,
  source: String
});

var OrderSchema = new Schema({
  orderNumber: Number,
  phoneNumber: String,
  completed: {type: Boolean, default: false},
  email: String,
  timestamp: String
});

var User = mongoose.model('User', UserSchema);
var Session = mongoose.model('Session', SessionSchema);
var Order = mongoose.model('Order', OrderSchema);

exports.User = User;
exports.Session = Session;
exports.Order = Order;