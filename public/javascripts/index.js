$('#createOrderButton').click(function() {
  var orderNumber = $('#inputOrderNumber').val();
  var phoneNumber = $('#inputPhoneNumber').val();
  console.log(orderNumber, phoneNumber);
  $.ajax({
    url: '/createOrder',
    method: 'POST',
    data: {
      orderNumber: orderNumber,
      phoneNumber: phoneNumber
    },
    success: function() {
      console.log('Successfully added.');
    }
  })  
});

$('#logoutButton').click(function() {
  window.location = '/logout';
});