/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Needs JQuery Library
 */

/** Spinner Options **/
    
var opts = {
    lines: 8, // The number of lines to draw
    length: 6, // The length of each line
    width: 3, // The line thickness
    radius: 6, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#ccc', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e12, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};
var target = document.getElementById('progressHolder');
var spinner = new Spinner(opts).spin(target); 
    
$(function() {

    // AJAX Config
    var splashFrame = "<div id=\"progressHolder\"></div>";
    
    $('body').prepend(splashFrame);
    $('#progressHolder').position({
        my: "center",
        at: "center",
        of: $(window)
    });
    
    /** Set spinner target **/
    spinner.stop();
    
    function loadingAction() {
        if(target) {
            spinner.spin(target);
        }
    }

    function loadedAction() {
        spinner.stop();
    }

    $(document).ajaxStart(function(e) {
        loadingAction();
    })
    .ajaxSuccess(function() {
        //alert("Operation compeled successfully!")
    })
    .ajaxError(function(e) {
        console.log("There was a problem completing your request => ");
        console.log(e);
    })
    .ajaxComplete(function() {
        //alert("Done!")
        loadedAction();
    });
});

// add to jQuery Support
jQuery.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();


