$('.loginButton').click(function() {
    $('.loginForm').submit();
});

$('#inputEmail').focus();

$('.loginForm').keypress(function(e) {
  if(e.which) {
    if(e.which === 13) {
      $('.loginButton').click();
    }
  }
});

$('#signUpSpan').click(function() {
  window.location = '/signup';
});

$('#cancel').click(function() {
  window.location = '/';
});

$('#signupButton').click(function() {
  window.location = '/signup';
});

$('#loginButton').click(function() {
  window.location = '/login';
});