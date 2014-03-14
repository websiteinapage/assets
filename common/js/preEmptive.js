/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function( $ ) {

    $.fn.preEmptive = function( options ) {
        
        var settings = $.extend({
            recursive: true
        }, options );
        
        
        var iden = "";
        // perform recursively
        if(settings.recursive === true) {
            iden = " * ";
        }
        
        // declare object to hold all elements that will be operated on
        var operateonlist = null;
        
        if( this.length > 1) {
            operateonlist = this.find(iden + ".integer, " + iden + ".alpha");
        } else {
            operateonlist = this;
        }
        
        return operateonlist.each(function() {
            var elem = $(this);
            
            if( elem.hasClass(".integer") ) {
                // integer validation
                elem.bind('keyup', function() {
                    
                });
            }
            
        });
        
    }

})