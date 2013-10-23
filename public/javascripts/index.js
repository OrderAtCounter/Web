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
      $('.readyButton').click(function() {
        var orderNumber = $(this).parent().siblings('div').children('.orderNumber').text();
        orderNumber = orderNumber.slice(1, orderNumber.length);
        $.ajax({
          url: '/fulfillOrder',
          method: 'POST',
          data: {
            orderNumber: orderNumber
          },
          success: function(data) {

          }
        });
      });
    }
  });
});

$('.readyButton').click(function() {
  var orderNumber = $(this).parent().siblings('div').children('.orderNumber').text();
  orderNumber = orderNumber.slice(1, orderNumber.length);
  $.ajax({
    url: '/fulfillOrder',
    method: 'POST',
    data: {
      orderNumber: orderNumber
    },
    success: function(data) {

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