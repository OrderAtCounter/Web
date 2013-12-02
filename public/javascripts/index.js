var fulfillOrderEvent = function() {
  $('.readyButton').click(function() {
    var orderId = $(this).attr('id');
    $.ajax({
      url: '/fulfillOrder',
      method: 'POST',
      data: {
        orderId: orderId
      },
      success: function(data) {
        $('.readyButton#' + orderId).parent().parent().parent().remove();
      }
    });
  });
}

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
      $('.readyButton').unbind('click');
      $('#emptyTextBox').remove();
      fulfillOrderEvent();
    }
  });
});

fulfillOrderEvent();

$('#orderInput').focus();
$('#newOrderBox').keypress(function(e) {
  if(e.which) {
    if(e.which === 13) {
      $('#newOrderButton').click();
    }
  }
});

$('#emptyTextBox').click(function() {
  $('#orderInput').focus();
});