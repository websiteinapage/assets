$(function( $ ) {
    
    $.fn.AccountAddress = function( options ) {
        var settings = $.extend({
            flagFieldBgColor: '#eeb4b4',
            clearFieldBgColor: ''
        }, options);

        var me = this;

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

        me.Validate = function() {
            var passed = true;
            var cardView = me;
            var notEmpty = [ cardView.find('#AddressName'), cardView.find('#StreetAddress'), cardView.find('#Locality'), cardView.find('#Region'), cardView.find('#AddressPostalCode'), cardView.find('#Country') ];
            for(var i=0; i<notEmpty.length; i++) {
                var field = notEmpty[i];
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

        return this;
    };
    
}(jQuery));