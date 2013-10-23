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
      
    }
  })  
});

$('#orderInput').focus();