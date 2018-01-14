/* global $, Stripe */
$(document).on('turbolinks:load',function(){
  var btnSubmit = $('#form-submit-btn');
  var theForm = $('#pro_form');
  //Set Stripe public key.
  Stripe.setPublishableKey($('meta[name = "stripe-key"]').attr('content'));
  //When user clicks form submit btn,
  btnSubmit.click(function(event){
    //prevent default submission behavior.
    event.preventDefault();
    btnSubmit.val("Processing...").prop('disabled',true);
    //Collect the credit card fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    var error = false;
    
    if(!Stripe.card.validateCardNumber(ccNum)){
      error = true;
      alert('Invalid card number');
    }
    
    if(!Stripe.card.validateCVC(cvcNum)){
      error = true;
      alert('Invalid cvc number');
    }
    
    if(!Stripe.card.validateExpiry(expMonth, expYear)){
      error = true;
      alert('Invalid expiration date');
    }
        
    if (error){
      btnSubmit.val("Sign up").prop('disabled', false);
    } else {
      //Send the card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    
    return false;
  });
  
  //Stripe will return a card token.
  function stripeResponseHandler(status,response){
    //Get the token from the response.
    var token = response.id;
    //Inject the card token in a hidden field.
    $('#theForm').append($('<input_type="hidden" name="user[stripe_card_token]">').val(token));
    //Submit form to our Rails app.
    $('#theForm').get(0).submit();
  }
    
    
  //Stripe will return a card token.
  //Inject card token as hidden field into form.
  //Submit form to our Rails app.
});