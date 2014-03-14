(function($) {
    
    $.fn.WiapJSUI = function() {
        if($('body').find('#DialogFrame').length<1) {
            $('body').append("<div id='DialogFrame'><div id='DialogContent'></div></div>");
        }
        var options = {
            verbose: true, // option for outputting runtime activity - true = show feedback in console log
            namespace: "WIAP_JSINIT", // app namespace - will prefix console outputs
            spreadClass: null, // class for spread styling - height of element will be set to height of window
            counterClass: "char-counter" // class for input fields with a maxlength to include a counter
        };
        if(arguments[0]) {
            options = $.extend(options, arguments[0]);
        }  

        var engine = {
            initDialog: function() {
                var frame = $('body').find('#DialogFrame');
                // console.log(frame);
                frame.dialog({
                    autoOpen: false,
                    show: "fade",
                    hide: "fade",
                    modal: true,
                    width: Math.min(500, $(window).width()*0.9),
                    open: function() {
                        $(window).on('scroll', function() {
                            $('#DialogFrame').dialog("option", "position", {
                                my: "center",
                                at: "center",
                                of: $(window)
                            });
                        });
                    },
                    close: function() {
                        // reset dialog
                        $('#DialogFrame').dialog("option", "width", Math.min(500, $(window).width()*0.9));
                    }
                });
            },
            hexToRgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
            },
            getDOMId: function(prefix) {
                var id;
                do {
                    if(prefix)
                        id= prefix+"-"+Math.floor(Math.random()*100000)+prefix;
                    else 
                        id= Math.floor(Math.random()*1000000);
                } while($('#'+id).length>0);
                return id;
            },
            getGMTOffset: function() {
                var now = new Date();
                return -1*(now.getTimezoneOffset()/60);
            },
            validateURL: function(textval) {
                var urlregex = new RegExp(
                "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
                return urlregex.test(textval);
            },
            validateEmail: function(email) { 
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(email);
            }, 
            getTimeZeroFill: function(pos, val) {
                if(pos>0) {
                    var filler;
                    try {
                        filler = Math.pow(10,pos);
                        //console.log("filler => " + filler);
                    } catch (pe) {
                        console.log("Whoops! failed =>");
                        //console.log(pe);
                    }
                    return (filler+val).toString().replace("1","");
                }
            },
            getTimeString: function( date ) {
                if ( typeof date === "object" ) {
                    //console.log("May be a date object!")
                    var timeStr = "";
                    try {
                        h = date.getHours();
                        m = date.getMinutes();
                        s = date.getSeconds();

                        timeStr = getTimeZeroFill(2,date.getHours()) + ":" 
                            + getTimeZeroFill(2,date.getMinutes()) + ":"
                            + getTimeZeroFill(2,date.getSeconds());
                    } catch(te) {
                        console.log("Whoops! failed =>");
                        //console.log(te);
                    }
                    //console.log(timeStr);
                    return timeStr;
                }
            },
            getTimeDiff: function(date1, date2) {
                return date1.getTime() - date2.getTime();
            },
            preview: function(text, previewMax) {
                var showtext = text.substring(0,previewMax);
                if(text.length>previewMax) {
                    showtext = showtext + "...";
                }
                return showtext;
            },
            isNumericKeyCode: function(keyCode) {
                if(keyCode >= 48 && keyCode <= 57 
                        || keyCode >= 96 && keyCode <= 105
                        || [107, 108, 110, 8, 9, 45, 46, 16, 37, 38, 39, 40].indexOf(keyCode)!==-1) {
                    return true;
                } else {
                    console.log(keyCode);
                    return false;
                }
            },
            showDialog: function(html, buttons, title) {
                $('#DialogFrame').dialog("open");
                $('#DialogContent').html(html);
                if(buttons)
                    $('#DialogFrame').dialog("option", "buttons", buttons);
                if(title)
                    $('#DialogFrame').dialog("option", "title", title);
            },
            getDialogDOM: function() {
                return $('#DialogFrame');
            }, 
            log: function(obj, msg) {
                if(options.verbose) {
                    if(msg) console.log(options.namespace +"::" + msg);
                    if(obj) console.log(obj);
                }
            },
            closeDialog: function() {
                $('#DialogFrame').dialog("close");
            },
            capturePosition: function(position) {
                engine.log(position);
                engine.locationCallback(position);
                engine.locationEndExec();
            },
            locationCallback: function(position) {},
            locationBeforeExec: function() {},
            locationEndExec: function() {},
            locationInterruptExec: function() {},
            getLocation: function() {
                var me = this;
                me.fetchingLocation = setTimeout(function() {
                    if (navigator.geolocation) {
                        me.locationBeforeExec();
                        navigator.geolocation.getCurrentPosition(me.capturePosition, me.handleLocationError);
                    } else {
                        me.log("Geolocation is not supported by this browser.");
                    }
                }, 500);
            },
            handleLocationError: function(error) {
                switch(error.code) 
                  {
                  case error.PERMISSION_DENIED:
                    engine.log("User denied the request for Geolocation.");
                    break;
                  case error.POSITION_UNAVAILABLE:
                    engine.log("Location information is unavailable.");
                    break;
                  case error.TIMEOUT:
                    engine.log("The request to get user location timed out.");
                    break;
                  case error.UNKNOWN_ERROR:
                    engine.log("An unknown error occurred.");
                    break;
                  }
                  engine.locationInterruptExec();
            }
        };

        if(options.verbose) {
            engine.log(null, "verbose mode:ON");
        }

        // size spread
        if(options.spreadClass) {
            $("."+options.spreadClass).css({
                minHeight: $(window).height()
            });
            $(window).bind('resize', function() {
                $("."+options.spreadClass).css({
                    minHeight: $(window).height()
                });
            });
        }

        $('.'+options.counterClass).each(function() {
            var input = $(this);
            var elem_id = engine.getDOMId();
            input.attr('counter-id', elem_id);
            try {
                input.after("<span id='" + elem_id + "'>" + input.val().length + "</span>");
                input.bind('keyup', function() {
                    var counter = $('#'+$(this).attr('counter-id'));
                    if($(this).attr('maxlength')) {
                        if($(this).attr('maxlength')-$(this).val().length<10) {
                            counter.css({
                                color: "#ff3300"
                            });
                        } else {
                            counter.css({
                                color: "inherit"
                            });
                        }
                    }
                    counter.html($(this).val().length);
                });
            } catch(ex) {}
        });
        return engine;
    };

}(jQuery));

