var selectedPayment;
// var initColors = ['#4C4A49','#71C2B3', '#EF493A'];
// var afterColors = ['#000000','#68AFA1', '#D33C35'];


$('.choosePlan').hover(function() {
  $(this).parent().css({'background-color': '#FCFCFC'});
}, function() {
  $(this).parent().css({'background-color': '#F7F7F5'});
});

$('.choosePlan').click(function() {
  if($(this).text() === 'Selected') {
    $(this).text('Select plan');
    $(this).parent().css({'background-color': '#F7F7F7'});
    $('.choosePlan').hover(function() {
      $(this).parent().css({'background-color': '#FCFCFC'});
    }, function() {
      $(this).parent().css({'background-color': '#F7F7F5'});
    });
  }
  else {
    $('.choosePlan').text('Select plan');
    $('.choosePlan').parent().css({'background-color': '#F7F7F7'});
    $('.choosePlan').hover(function() {
      $(this).parent().css({'background-color': '#FCFCFC'});
    }, function() {
      $(this).parent().css({'background-color': '#F7F7F5'});
    });
    $(this).text('Selected');
    $(this).parent().css({'background-color': '#FCFCFC'});
    $(this).unbind('mouseenter mouseleave');
  }
});

$('#cardNumberInput').payment('formatCardNumber');
$('#cvcInput').payment('formatCardCVC');
$('#expirationInput').payment('formatCardExpiry');