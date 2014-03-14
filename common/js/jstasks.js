$(document).ready(function() {
    
    setTimeout(function() {
        $('.info:not(.stick),.good-news:not(.stick),.loading,.notice-bar').hide('fade');
    }, 5000);
    
    function reLayoutStuff() {
        console.log("New window width: " + $(window).width().toString());
        var newWidth = $(window).width();
        if(newWidth>650) {
            $('#nav').show();
        } else {
            $('#nav').hide();
        }
    }
    /*
    $(window).resize(function() {
        reLayoutStuff();
    });
    
    reLayoutStuff();
    */
    
    // layout window
});
