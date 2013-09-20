$('#createOrderButton').click(function() {
  var orderNumber = $('#inputOrderNumber').val();
  var phoneNumber = $('#inputPhoneNumber').val();
  $.ajax({
    url: '/createOrder',
    method: 'POST',
    data: {
      orderNumber: orderNumber,
      phoneNumber: phoneNumber
    },
    success: function(order) {
      $('#orderDashboardColumn').append('<div class="row"><div class="col-md-3"><p>' + order.orderNumber + '</p></div><div class="col-md-3"><p>' + order.phoneNumber + '</p></div><div class="col-md-3"><button class="btn btn-primary">Text</button></div></div>')
    }
  })  
});

$('#inputOrderNumber').focus();

$('#createOrderColumn').keypress(function(e) {
  if(e.which === 13) {
    $('#createOrderButton').click();
  }
});