$('#signupButton').click(function() {
  $.ajax({
    url: 'setSignupCookie',
    method: 'POST',
    data: {plan: '0'},
    success: function() {
      window.location = '/signup';
    }
  })
});

$('#loginButton').click(function() {
  window.location = '/login';
});

$('.choosePlan').click(function() {
  var selectedPayment = $(this).parent().parent().children('.priceHeaderDiv').text();
  var texts = selectedPayment.split(' ')[0];
  if(texts == 1000) {
    var plan = 1;
  }
  else if(texts == 2500) {
    var plan = 2;
  }
  else {
    var plan = 3;
  }
  $.ajax({
    url: '/setSignupCookie',
    method: 'POST',
    data: {plan: plan},
    success: function() {
      window.location = '/signup';
    }
  });
});