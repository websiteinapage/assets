$(function( $ ) {
    
    $.fn.CreditCard = function( options ) {
        
        var settings = $.extend({
            flagFieldBgColor: '#eeb4b4',
            clearFieldBgColor: ''
        }, options);
        
        var me = this;

        // prevent anything other than numbers going in
        me.find('.credit-card-number, .number').each(function() {
            var input = $(this);
            input.bind('keydown', function(e) {
                if(
                        !(e.keyCode >= 48 && e.keyCode <= 57)
                        && !(e.keyCode >= 96 && e.keyCode <= 105)
                        && _.indexOf([ 8, 9, 35, 36, 37, 39, 38, 40, 45, 46 ], e.keyCode) === -1
                  ) {
                    // not a number
                    return false;
                }
            })
            .bind('focusin', function() {
                if(isNaN(input.val())) {
                    console.log("Invalid number found!");
                    input.val("");
                }
            });
        });
        
        me.clearField = function( f ) {
            f.css({
                backgroundColor: settings.clearFieldBgColor
            });
        };
        
        me.flagField = function( f ) {
            f.css({
                backgroundColor: settings.flagFieldBgColor
            });
            f.bind('focusin', function() {
               me.clearField( $(this) ); 
            });
        };
        
        me.Validate = function( cardView ) {
            var ccard = cardView.find('.credit-card-number');
            
            // start validation
            var passed = true;
            
            // validate card number
            var field = ccard;
            console.log("Validating: ");
            if( isNaN(field.val()) || !field.val() ) {
                console.log("Result: failed");
                passed = false;
                me.flagField( field );
            } else {
                me.clearField( field );
            }
            
            // validate cvv
            field = cardView.find('.cvv');
            console.log("Validating: ");
            if( isNaN(field.val()) || !field.val() || field.val()==="") {
                console.log("Result: failed");
                passed = false;
                me.flagField( field );
            } else {
                me.clearField( field );
            }
            
            var notEmpty = [ cardView.find('#CardholderName'), cardView.find('.expire-year'), cardView.find('.expire-month'), cardView.find('#PostalCode') ];
            
            for(var i=0; i<notEmpty.length; i++) {
                field = notEmpty[i];
                console.log("Validating: ");
                console.log(field);
                if( !field.val() ) {
                    console.log("Result: failed");
                    passed = false;
                    me.flagField( field );
                } else {
                    me.clearField( field );
                }
            }
            
             return passed;
        };
        
        me.highlightCardType = function( cardView ) {
            var cardNumberInput = cardView.find('.credit-card-number');
            var infoBox = cardView.find(".card-logo");
            
            if(/^4/.test(cardNumberInput.val())) {
                //infoBox.find(".card-type").css({ opacity: "0.3" });
                var cardtype = infoBox.find(".visa").first();
                infoBox.find(".card-type:not(.visa)").hide();
                if(!cardtype.is(":visible")) {
                    cardtype.show();
                } 
                cardtype.css({ opacity: "1" });
            } 
            else if(/^34/.test(cardNumberInput.val()) || /^37/.test(cardNumberInput.val())) {
                var cardtype = infoBox.find(".amex").first();
                infoBox.find(".card-type:not(.amex)").hide();
                if(!cardtype.is(":visible")) {
                    cardtype.show();
                } 
                cardtype.css({ opacity: "1" });
            }
            else if(/^51/.test(cardNumberInput.val()) || /^55/.test(cardNumberInput.val())) {
                var cardtype = infoBox.find(".mastercard").first();
                infoBox.find(".card-type:not(.mastercard)").hide();
                if(!cardtype.is(":visible")) {
                    cardtype.show();
                } 
                cardtype.css({ opacity: "1" });
            }
            else if(/^6011/.test(cardNumberInput.val())) {
                var cardtype = infoBox.find(".discover").first();
                infoBox.find(".card-type:not(.discover)").hide();
                if(!cardtype.is(":visible")) {
                    cardtype.show();
                } 
                cardtype.css({ opacity: "1" });
            }
            else {
                var cardtype = infoBox.find(".unknown").first();
                infoBox.find(".card-type:not(.unknown)").hide();
                if(!cardtype.is(":visible")) {
                    cardtype.show();
                } 
                cardtype.css({ opacity: "1" });
                // infoBox.find(".card-type").show();
                // infoBox.find(".card-type").css({ opacity: "0.3" });
            }
            
        };
       
       // initialize cards
       this.each(function() {
             console.log("Setting up credit card view id #" + $(this).attr('id'));
             var cardView = $(this);
             var ccard = cardView.find('.credit-card-number');
             // call highlight credit card type on each credit card number
             ccard.each(function() {
                $(this)
                        .bind('keyup', function() {
                            me.highlightCardType( cardView ); 
                         })
                        .bind('focusin', function() {
                            // clear if not a number
                            if( isNaN($(this).val()) ) {
                                $(this).val("");
                            }
                        });
                // run call to check card type
                me.highlightCardType( cardView );
             });
        });
       
       return this;
    };
    
}(jQuery));