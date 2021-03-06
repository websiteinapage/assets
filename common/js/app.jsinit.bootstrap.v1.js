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
var loadingAction, loadedAction;
// Failsafe for IE
if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } };
// fixes for timezone offset
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
loadingAction = function() {
	if(target) {
		spinner.spin(target);
	}
};
loadedAction = function() {
	spinner.stop();
};
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
$(document).ready(function() {
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
    
    loadingAction = function() {
        if(target) {
            spinner.spin(target);
        }
    };

    loadedAction = function() {
        spinner.stop();
    };

});

// add to jQuery Support
jQuery.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();

WiapJSBootstrap = function() {
    if($('body').find('#DialogFrame').length<1) {
        var dlg = "<div id='DialogFrame' class='modal fade' tagindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" + 
            "<div class='modal-dialog'>" + 
                "<div class='modal-content'>" + 
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                        "<h4 class='modal-title' id='DialogTitle'></h4>" +
                    "</div>" +
            "<div id='DialogContent' class='modal-body'></div>" + 
            "<div class='modal-footer button-bar' id='DialogBtnBar'></div>" + 
        "</div></div></div>";
        $('body').append(dlg);
    }
    var options = {
        verbose: true, // option for outputting runtime activity - true = show feedback in console log
        namespace: "WIAP_JSINIT", // app namespace - will prefix console outputs
        spreadClass: "spread", // class for spread styling - height of element will be set to height of window
        counterClass: "char-counter", // class for input fields with a maxlength to include a counter
        counterDisplayClass: "counter-badge",
        dialogWidth: Math.min(500, $(window).width()*0.9),
        toastCSS: {
            maxWidth: $(window).width()*0.9
        },
        emailRegExp: "^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$",
        emailListRegExp: "^((([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[,;]?)+$",
        urlRegExp: "^(http|https|ftp)\:\/\/([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
    };
    if(arguments[0]) {
        options = $.extend(options, arguments[0]);
    }  
    
    var engine = {
        closeDialogCallback: function() {},
        initCheckbox: function() {
            $('.checkbox').each(function() {
                var elem = $(this);
                if(!elem.hasClass('bs-cb')) {
                    var cb_id = engine.getDOMId("checkbox");
                    var checkboxHTML = "<span id=\"" + cb_id + "\" class=\"cb bs-cb " + elem.attr('wrapperClass') + " " + ((elem.hasClass('disabled')||elem.attr("disabled"))?" disabled":"") + "\" >"+
                        "<i class=\"glyphicon glyphicon-unchecked\"></i>"+
                        "<i class=\"glyphicon glyphicon-check\"></i>" +
                        "<input type=\"hidden\" name=\"" + elem.attr("name") + "\" class=\"cb-input " + elem.attr('class') + "\" />" + "</span>";
                    elem.after(checkboxHTML);
                    var checkbox = $('#'+cb_id);
                    var input = checkbox.find('.cb-input');
                    $.each(elem.data, function(index, value) {
                        input.data(index, value);
                    });
                    elem.remove();
                    if(checkbox.prop('checked')) {
                        checkbox.find(".glyphicon-check").show();
                        checkbox.find(".glyphicon-unchecked").hide();
                        input.val(0);
                    }
                    else {
                        checkbox.find(".glyphicon-check").hide();
                        checkbox.find(".glyphicon-unchecked").show();
                        input.val(0);
                    }
                    checkbox.on('click', function() {
                        var checkbox = $(this);
                        if(!checkbox.hasClass('disabled')) {
                            var input = checkbox.find('.cb-input');
                            if(checkbox.prop('checked')) {
                                checkbox.prop('checked', false);
                                checkbox.removeAttr('checked');
                                checkbox.removeClass('checked');
                                checkbox.find(".glyphicon-check").hide();
                                checkbox.find(".glyphicon-unchecked").show();
                                input.val(0);
                            }
                            else {
                                checkbox.prop('checked', true);
                                checkbox.attr('checked','checked');
                                checkbox.addClass('checked');
                                checkbox.find(".glyphicon-check").show();
                                checkbox.find(".glyphicon-unchecked").hide();
                                input.val(1);
                            }
                            engine.log(checkbox.prop('checked'), "Checked?");
                            engine.log(checkbox);
                        } 
                    });
                }
            });

        },
        initDialog: function() {
            var frame = $('body').find('#DialogFrame');
            // console.log(frame);
            /*
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
            */
            frame.modal({
                keyboard: false,
                show: false
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
                else {
                    numid= Math.floor(Math.random()*1000000);
                    id = numid;
                }
            } while($('#'+id).length>0);
            return id;
        },
        getGMTOffset: function() {
            var now = new Date();
            /*
            var h = now.getHours();
            var utc_h = now.getUTCHours();
            return h - utc_h;
            */
            return -1*(now.getTimezoneOffset()/60);
        },
        validateURL: function(textval) {
            var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
            //var re = new RegExp(options.urlRegExp);
            return re.test(textval);
        },
        validateEmail: function(email) { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //var re = new RegExp(options.emailRegExp);
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
		convertTime: function(dateString) {
			var now = new Date();
			var offset=now.getTimezoneOffset()*60*1000;
			console.log("Time offset (ms)->" + offset);
			return (new Date(dateString)).getTime()-offset;
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
        suspendBtn: function() {
            var btn = arguments[0];
            var workingHTML = "working...";
            if(arguments.length>1) {
                workingHTML = arguments[1];
            }
            btn.data("lastHTML", btn.html()); 
            btn.html(workingHTML);
            btn.addClass("disabled");
        },
        restoreBtn: function() {
            var btn = arguments[0];
            if(btn.data("lastHTML")) {
                btn.html(btn.data("lastHTML"));
            } else if(arguments.length>1) {
                btn.html(arguments[1]);
            } else {
                btn.html("Enter");
            }
            btn.removeClass("disabled");
        },
        isNumericKeyCode: function(keyCode, elem) {
            // engine.log(elem);
            if((keyCode >= 48 && keyCode <= 57)
                    || (keyCode >= 96 && keyCode <= 105)
                    || [107, 108, 110, 8, 9, 45, 46, 16, 37, 38, 39, 40].indexOf(keyCode)!==-1
                    || (190===keyCode && elem.val().split(".").length<2)) {
                return true;
            } else {
                // console.log(keyCode);
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
            $('#DialogFrame').modal('show');
            if(title)
                $('#DialogTitle').html(title);
            else
                $('#DialogTitle').html("&nbsp;");
                
            $('#DialogContent').html(html);
            $('#DialogBtnBar').html("");
            if(buttons) {
                _.each(buttons, function(button, index) {
                    if(!button.important)
                        button.important = false;
                    if(!button.class)
                        button.class = "btn btn-default";
                    /*
                    try {
                        if(!button.important)
                            button.important = false;
                    } catch(ex) {
                        button.important = false;
                    }
                    try {
                        if(!button.class)
                            button.class = "btn btn-default";
                    } catch(ex) {
                        button.class = "btn btn-default";
                    }
                    */
                    button = $.extend({
                        important: true,
                        class: "btn btn-primary"
                    }, button);
                    
                    if(_.indexOf(["Ok", "Cancel", "Done", "Exit"], button.text)===-1 || button.important) {
                        var btn_id = engine.getDOMId("btn-");
                        var btn_html = "<button id='" + btn_id + "' class='" + button.class + "'>" + button.text + "</button>";
                        $('#DialogBtnBar').append(btn_html);
                        $('#'+btn_id).on('click', function() {
                            button.click();
                        });
                    }
                });
            }
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
            //$('#DialogFrame').dialog("close");
            $('#DialogFrame').modal('hide');
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
            // cancel removal of toast
            clearTimeout(engine.killToast);
            var html = arguments[0];
            var opts = {
                css: options.toastCSS,
                recycle: true,
                position: null,
                draggable: false,
                callback: null,
                trivial: false
            };
            if(arguments[1]) {
                opts = $.extend(opts, arguments[1]);
            }
            if(opts.recycle) {
                $('.toast').remove();
            }
            engine.log(html, "Show toast message:");
            var toastFrame = document.createElement('div');
            toastFrame.id = engine.getDOMId("toastframe-");
            toastFrame = $(toastFrame);
            toastFrame.addClass('toast-frame');
            var toast = document.createElement('div');
            toast.id = engine.getDOMId("toast-");
            toast = $(toast);
            toast.addClass("toast");
            if(opts.has_error) {
                toast.addClass("error");
            }
            toast.append("<a href='#' class='close-toast'><b class='glyphicon glyphicon-remove'></b></a>");
            toast.append(html);
            toastFrame.append(toast);
            $('body').append(toastFrame);
            engine.log(toast);
            toast.find('.close-toast').bind('click', function(e) {
                e.preventDefault();
                // var toast = $(this);
                toast.fadeOut(250, function() {
                    toastFrame.remove();
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
            if(opts.trivial) {
                engine.killToast = setTimeout(function() {
                    engine.clearToast();
                }, 3600);
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
				var pct = 1/opts.totalsize;
				var dialogHTML = html + "<br /><div class='progress'><div id='" 
				+ id + "' class='progress-bar progress progress-bar-success progress-striped active' aria-valuenow='1' aria-valuemax='" 
				+ opts.totalzie +  "' aria-valuemin='0' style='width: " + pct + "%'></div></div>";
				
                engine.showDialog(dialogHTML, btns);
                var bar = $('#'+id);
                // bar.progressbar(opts.progressbar_options);
                // do interval checking of progress bar options
                return bar;
            } else {
                engine.log(null, "Invalid options passed: {files} options required with a {filesize} attribute for each file");
            }
        },
        closeToast: function(toast) {
            toast.fadeOut(250, function() {
                toast.remove();
                toast.parents('.toast-frame').remove();
            });
        },
        clearToast: function() {
            $('.toast').fadeOut(250, function() {
                $('.toast-frame').remove();
            });
        },
        copyToClipboard: function(s) {
            // ie
            if (window.clipboardData && clipboardData.setData) {
                clipboardData.setData('text', s);
            }
            // others
            else {
                var flashcopier = 'flashcopier';
                if(!document.getElementById(flashcopier)) {
                    var divholder = document.createElement('div');
                    divholder.id = flashcopier;
                    document.body.appendChild(divholder);
                }
                document.getElementById(flashcopier).innerHTML = '';
                var divinfo = '<embed src="_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(s)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
                document.getElementById(flashcopier).innerHTML = divinfo;
            }
        },
        alert: function() {
            var html = arguments[0];
            var alertClass=  "alert-info";
            var alertTarget = null;
            if(arguments.length>1) {
                alertClass = arguments[1];
            }
            if(arguments.length>2) {
                alertTarget = arguments[2]; 
            }
            var alertHtml = "<div class='alert " + alertClass + " fade in'>" 
                    + "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
                    + html
                    + "</div>";
            if(alertTarget) {
                alertTarget.html(alertHtml);
            } else return alertHtml;
        },
        option: function(key) {
            if(options[key]) {
                return options[key];
            }
        },
        setOptions: function(opts) {
            if(opts) {
                options = $.extend(options, opts);
            }
        },
        showErrors: function(data) {
            try {
                // clear prior reported errors
                $(".form-error,.error").remove();
                if(data.errors.length>0) {
                    $.each(data.errors, function(i, err) {
                        var elem = $("[name='" + err.field + "']");
                        var parent = elem.parents('.form-group');
                        parent.addClass('has-error');
                        parent.append(err.message);
                        elem.on('focusin keyup change', function() {
                            var parent = elem.parents('.form-group');
                            if(parent.hasClass('has-error')) {
                                parent.removeClass('has-error');
                                parent.find('.form-error').remove();
                            }
                        });
                    });
                }
            }
            catch(ex) {
                engine.log(ex, "No valid error feedback found");
            }
            if(data.errors) {
                
            }
        },
        serialize: function(obj) {
            return $.param(obj);
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
            input.after("<div class=\"counter-frame\"><span id='" + elem_id + "' class='" + options.counterDisplayClass + "'>" + input.val().length + "</span></div>");
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
    $(document).on("nodesAdded", function() {
        engine.initCheckbox();
        engine.log("Event: nodesAdded");
    });
    return engine;
};
