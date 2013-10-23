$('#newOrderButton').click(function() {
  var orderNumber = $('#orderInput').val();
  var phoneNumber = $('#phoneNumberInput').val();
  $.ajax({
    url: '/createOrder',
    method: 'POST',
    data: {
      orderNumber: orderNumber,
      phoneNumber: phoneNumber
    },
    success: function(order) {
      $('#activeOrdersBox').append(order);
      $('.newOrderInputs').val('');
      $('#orderInput').focus();
    }
  });
});

$('#orderInput').focus();
$('#newOrderBox').keypress(function(e) {
  if(e.which) {
    if(e.which === 13) {
      $('#newOrderButton').click();
    }
  }
});