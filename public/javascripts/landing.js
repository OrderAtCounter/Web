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