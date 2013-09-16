Counter = {};

var Dashboard = function() {
  this.orderList = {};
  this.addOrder = function(orderNumber, phoneNumber, orderTime, isComplete) {
    if(!orderList[orderNumber]) {
      orderList[orderNumber] = new Order(orderNumber, phoneNumber, orderTime, isComplete);
    }
  }
  this.removeOrder = function(orderNumber) {
    orderList[orderNumber] = null;
  }
}

var Order = function(orderNumber, phoneNumber, orderTime, isComplete) {
  this.orderNumber = orderNumber;
  this.phoneNumber = phoneNumber;
  this.orderTime = orderTime;
  this.isComplete = isComplete;
}

Counter.dashboard = new Dashboard();