Stripe.setPublishableKey('pk_test_Frgm6hnSEjLMxE5cf7Lkwj2m');

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
    selectedPayment = $(this).parent().parent().children('.priceHeaderDiv').text();
    selectedPayment = selectedPayment.split(' ')[0].trim();
    $(this).text('Selected');
    $(this).parent().css({'background-color': '#FCFCFC'});
    $(this).unbind('mouseenter mouseleave');
  }
});

$('.createPlanButton').click(function() {
  var ccNum = $('#cardNumberInput').val();
  var cvcNum = $('#cvcInput').val();
  var expiration = $('#expirationInput').val();
  expiration = expiration.split('/');
  var expMonth = expiration[0].trim();
  var expYear = expiration[1].trim();

  var error = {};
  var errorCount = 0;
  if(!Stripe.validateCardNumber(ccNum)) {
    error.number = 'Credit card number error.';
    errorCount++;
  }

  if(!Stripe.validateCVC(cvcNum)) {
    error.cvc = 'CVC number error.';
    errorCount++;
  }

  if(!Stripe.validateExpiry(expMonth, expYear)) {
    error.expiration = 'Expiration error.';
    errorCount++;
  }

  if(errorCount == 0) {
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
  }

});

$('#cardNumberInput').payment('formatCardNumber');
$('#cvcInput').payment('formatCardCVC');
$('#expirationInput').payment('formatCardExpiry');

var stripeResponseHandler = function(status, response) {
  if(status == 200) {
    var plan;
    if(selectedPayment == 1000) {
      plan = 1;
    }
    if(selectedPayment == 2500) {
      plan = 2;
    }
    if(selectedPayment == 5000) {
      plan = 3;
    }
    $.ajax({
      url: '/selectPlan',
      method: 'POST',
      data: {plan: plan, token: response.id},
      success: function() {
        window.location = '/';
      }
    });
  }
  else {
    console.log(status);
  }
}