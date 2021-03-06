/**The MIT License (MIT)

Copyright (c) 2014 Uchenna Chilaka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

WiapJSUI = function() {
    if($('body').find('#DialogFrame').length<1) {
        $('body').append("<div id='DialogFrame'><div id='DialogContent'></div></div>");
    }
    var options = {
        verbose: true, // option for outputting runtime activity - true = show feedback in console log
        namespace: "WIAP_JSINIT", // app namespace - will prefix console outputs
        spreadClass: "spread", // class for spread styling - height of element will be set to height of window
        counterClass: "char-counter", // class for input fields with a maxlength to include a counter
        dialogWidth: Math.min(500, $(window).width()*0.9)
    };
    if(arguments[0]) {
        options = $.extend(options, arguments[0]);
    }  

    var engine = {
        closeDialogCallback: function() {},
        initDialog: function() {
            var frame = $('body').find('#DialogFrame');
            // console.log(frame);
            frame.dialog({
                autoOpen: false,
                show: "fade",
                hide: "fade",
                modal: true,
                width: options.dialogWidth,
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
            var id, numid;
            do {
                if(prefix) {
                    numid = Math.floor(Math.random()*100000);
                    id = prefix+numid;
                }
                else 
                    numid= Math.floor(Math.random()*1000000);
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
        showDialog: function() {
            // html, buttons, title, options
            var html = arguments[0];
            var buttons, title = null;
            var opts = {};
            if(arguments[1]) {
                buttons = arguments[1];
            }
            if(arguments[2]) {
                title = arguments[2];
            }
            if(arguments[3]) {
                opts = $.extend(opts, arguments[3]);
            }
            if(opts.dialogWidth) {
                $('#DialogFrame').dialog("option", "width", opts.dialogWidth);
            }
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
        isFxn: function(obj) {
            return obj && typeof obj === "function";
        },
        closeDialog: function() {
            $('#DialogFrame').dialog("close");
            if(engine.isFxn(engine.closeDialogCallback)) {
                engine.closeDialogCallback();
            }
            // clear callback
            engine.closeDialogCallback = null;
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
        },
        showToast: function() {
            var html = arguments[0];
            var opts = {
                css: {
                    maxWidth: $(window).width()*0.9
                },
                recycle: true,
                position: null,
                draggable: false,
                callback: null
            };
            if(arguments[1]) {
                opts = $.extend(opts, arguments[1]);
            }
            if(opts.recycle) {
                $('.toast').remove();
            }
            engine.log(html, "Show toast message:");
            var toast = document.createElement('div');
            toast.id = engine.getDOMId("toast-");
            toast = $(toast);
            toast.addClass("toast");
            toast.append("<a href='#' class='close-toast'><i class='fa fa-times-circle'></i></a>");
            toast.append(html);
            $('body').append(toast);
            engine.log(toast);
            toast.find('.close-toast').bind('click', function(e) {
                e.preventDefault();
                // var toast = $(this);
                toast.fadeOut(250, function() {
                    toast.remove();
                });
            });
            if(opts.position) {
                try {
                    toast.position(opts.position);
                } catch(ex) {
                    engine.log(null, "Invalid position option for toast.");
                }
            }
            if(opts.callback) {
                try {
                    if(engine.isFxn(opts.callback)) opts.callback();
                } catch(ex) {
                    engine.log(null, "Failed to run callback of toast.");
                }
            }
            if(opts.css) {
                toast.css(opts.css);
            }
            if(opts.draggable) {
                toast.draggable();
            }
        },
        showFileProgress: function() {
            var html = arguments[0];
            var opts = {
                progressbar_options: {}
            };
            opts = $.extend(opts, arguments[1]);
            var btns = arguments[2];
            
            if(opts.totalsize) {
                engine.log(opts.totalsize, "Total Data size (B)");
                var id = engine.getDOMId('progress-');
                engine.showDialog(html + "<br /><div id='" + id + "' class='progress-bar'></div>", btns);
                var bar = $('#'+id);
                bar.progressbar(opts.progressbar_options);
                // do interval checking of progress bar options
                return bar;
            } else {
                engine.log(null, "Invalid options passed: {files} options required with a {filesize} attribute for each file");
            }
        },
        closeToast: function(toast) {
            toast.fadeOut(250, function() {
                toast.remove();
            });
        },
        clearToast: function() {
            $('.toast').fadeOut(250, function() {
                $('.toast').remove();
            });
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

    engine.initDialog();

    return engine;
};
