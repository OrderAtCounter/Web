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
      }
    })
  });
});

var editState = false;

$('#editAccountButton').click(function() {
  var uneditable = $('.accountSettings').children('p');
  var editable = $('.accountSettings').children('input');
  if(!editState) {
    $(uneditable).each(function(index) {
      var text = $(this).text();
      $(this).siblings('input').val(text);
    });
    $(this).removeClass('btn-primary');
    $(this).addClass('btn-success');
    $(this).text('Save');
    $(uneditable).addClass('hidden');
    $(editable).removeClass('hidden');
    editState = true;
  }
  else {
    $(this).removeClass('btn-success');
    $(this).addClass('btn-primary');
    $(this).text('Edit');
    $(editable).each(function(index) {
      var value = $(this).val();
      $(this).siblings('p').text(value);
    });
    $(uneditable).removeClass('hidden');
    $(editable).addClass('hidden');
    editState = false;
    var email = $('#emailInput').val();
    var businessName = $('#businessNameInput').val();
    var data = {email: email, businessName: businessName};
    $('#alertMessage').children('div').children('div').children('p').remove();
    $.ajax({
      url: '/settings',
      method: 'POST',
      data: data,
      success: function(response) {
        var updatedEmail = response.email;
        var updatedBusinessName = response.businessName;
        $('a.navbar-brand').text(updatedBusinessName);
        var alertDiv = $('#alertMessage').children('div').children('div');
        alertDiv.append('<p>Settings saved successfully!');
        alertDiv.addClass('alert-success');
        $('#alertMessage').addClass('in');
      },
      error: function() {
        var alertDiv = $('#alertMessage').children('div').children('div');
        alertDiv.append('<p>Error saving settings!</p>');
        alertDiv.addClass('alert-danger');
        $('#alertMessage').addClass('in');
      }
    });
  }
});

var editMessageState = false;

$('#editMessageButton').click(function() {
  var uneditable = $('#customMessageP');
  var editable = $('#customMessageTextarea');
  if(!editMessageState) {
    var text = $(uneditable).text();
    $(editable).val(text);
    $(this).removeClass('btn-primary');
    $(this).addClass('btn-success');
    $(this).text('Save');
    $(uneditable).addClass('hidden');
    $(editable).removeClass('hidden');
    editMessageState = true;
  }
  else {
    $(this).removeClass('btn-success');
    $(this).addClass('btn-primary');
    $(this).text('Edit');
    var text = $(editable).val();
    $(uneditable).text(text);
    $(uneditable).removeClass('hidden');
    $(editable).addClass('hidden');
    editMessageState = false;
    var data = {message: text};
    $('#alertMessage2').children('div').children('div').children('p').remove();
    $.ajax({
      url: '/messageSettings',
      method: 'POST',
      data: data,
      success: function() {
        var alertDiv = $('#alertMessage2').children('div').children('div');
        alertDiv.append('<p>Custom Message saved successfully!</p>');
        alertDiv.addClass('alert-success');
        $('#alertMessage2').addClass('in');
      },
      error: function() {
        var alertDiv = $('#alertMessage2').children('div').children('div');
        alertDiv.append('<p>Error saving custom message!</p>');
        alertDiv.addClass('alert-danger');
        $('#alertMessage2').addClass('in');
      }
    });
  }
});