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