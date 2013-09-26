Stripe.setPublishableKey('pk_test_Frgm6hnSEjLMxE5cf7Lkwj2m');

$('button#submitPay').click(function() {
  var form = $('#payment-form');
  Stripe.card.createToken(form, function(status, response) {
    console.log('Status: ',status);
    console.log('Response: ',response);
    var id = response.id;
    $.ajax({
      url: '/addSubscription',
      method: 'POST',
      data: {id: id},
      complete: function() {
        console.log('Sent');
      }
    })
  });
});