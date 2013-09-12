var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  Orders: [Schema.Types.ObjectId]
});

var SessionSchema = new Schema({
  username: String,
  source: String
});

var OrderSchema = new Schema({
  orderNumber: Number,
  phoneNumber: String,
  completed: Boolean
});

var User = mongoose.model('User', UserSchema);
var Session = mongoose.model('Session', SessionSchema);
var Order = mongoose.model('Order', OrderSchema);

exports.User = User;
exports.Session = Session;
exports.Order = Order;