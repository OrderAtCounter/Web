var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  businessName: String,
  Orders: [{type: String, ref: 'Order'}]
});

var SessionSchema = new Schema({
  email: String,
  source: String
});

var OrderSchema = new Schema({
  orderNumber: Number,
  Contact: {type: String, ref: 'Contact'},
  completed: {type: Boolean, default: false}
});

var ContactSchema = new Schema({
  phoneNumber: String
});

var User = mongoose.model('User', UserSchema);
var Session = mongoose.model('Session', SessionSchema);
var Order = mongoose.model('Order', OrderSchema);
var Contact = mongoose.model('Contact', ContactSchema);

exports.User = User;
exports.Session = Session;
exports.Order = Order;
exports.Contact = Contact;