/* 
**Copyright 2012 WebsiteInAPage
*Developer: Uchenna Chilaka

    WAutoSize is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WAutoSize is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WAutoSize.  If not, see <http://www.gnu.org/licenses/>.
* * 
 * 
 */
(function( $ ){
    var formOptions = {
        fieldPrefix: 'field_',
        fieldClass: 'autoBox',
        ghostElement: "<span id='sizeCalculator' style='display: none'></span>",
        autoSizeClass: 'autosize',
        autoSizeGrowthFactor: 1.2,
        growShortOf: 3,
        replaceTag: true
    }

  var methods = {
    autosize: function() {
        var obj=$(this)
        var shell=obj.parent()
        var elemName = obj.attr('name')
        if(formOptions.replaceTag) {
            var replacementTag = "<textarea name='"+formOptions.fieldPrefix+elemName+"' id='" + obj.attr('id') + "'></textarea>";
            obj.before(replacementTag);
        }
        shell.find("textarea").addClass(formOptions.fieldClass)
        shell.find("textarea").addClass(formOptions.autoSizeClass)
        formOptions.defaultHeight=parseInt(obj.css('height').replace('px',''))
        shell.find("textarea").css({
            width: obj.css('width'),
            height: formOptions.defaultHeight+'px',
            overflow: 'hidden'
        })
        shell.find("textarea").val(obj.val())
        if(formOptions.replaceTag) {
            obj.remove();
        }
        var fontSize=shell.find("textarea").css('font-size').replace('px','')
        
        shell.find('.'+formOptions.autoSizeClass).bind('keydown', function(e) {
            var w=parseInt($(this).css('width').replace('px',''));
            var h=parseInt($(this).css('height').replace('px',''));
            var charnum=(w*h)/(fontSize*fontSize);
            // console.log(e.keyCode);
            // backspace = 8
            if ($(this).val().length>charnum-formOptions.growShortOf || e.keyCode == 13) {
                $(this).css({
                    height: (h+fontSize*formOptions.autoSizeGrowthFactor)+'px'
                });
            } 
        })
    }
      
  }

  methods = $.extend(methods,{
    init : function( options ) { 
        formOptions = $.extend(formOptions,options)
        $(this).wrap("<div class='fieldenvelope' />")
        var mshell=$(this).parent()
        methods['autosize'].apply(this)
        return mshell.find('.'+formOptions.autoSizeClass)
    }
})

  $.fn.autosize = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };

})( jQuery );

