$('.signupButton').click(function() {
    $('.signupForm').submit();
});

$('#inputEmail').focus();

$('.signupForm').keypress(function(e) {
  if(e.which) {
    if(e.which === 13) {
      $('.signupButton').click();
    }
  }
});

$('#loginSpan').click(function() {
  window.location = '/login';
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