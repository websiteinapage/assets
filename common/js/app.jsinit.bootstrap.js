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

// @TODO updated 2014-08-12 05:13 AM
WiapJSBootstrap = function() {
    /*
    var dialogHTML = "<div id='DialogFrame' class='modal fade' tagindex='-1' role='dialog' aria-labelledby='myModalLabel'>" + 
            "<div class='modal-dialog'>" + 
                "<div class='modal-content'>" + 
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                        "<h4 class='modal-title' id='DialogTitle'></h4>" +
                    "</div>" +
            "<div id='DialogContent' class='modal-body'></div>" + 
            "<div class='modal-footer button-bar' id='DialogBtnBar'></div>" + 
        "</div></div></div>";
    */
    var dialogHTML = "<div class='modal-content'>" + 
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                        "<h4 class='modal-title' id='DialogTitle'></h4>" +
                    "</div>" +
            "<div id='DialogContent' class='modal-body'></div>" + 
            "<div class='modal-footer button-bar' id='DialogBtnBar'></div>" + 
        "</div>";
    /*
    if($('body').find('#DialogFrame').length<1) {
        $('body').append(dialogHTML);
    }
    */
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
        dialogHTML: dialogHTML,
        closeDialogCallback: function() {},
        ajaxSubmit: function() {
            var opts = $.extend({
                url: null,
                type: "GET",
                dataType: "jsonp",
                cache: false,
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                data: {},
                success: false,
                error: false,
                complete: false,
                beforeSend: function() {
                    engine.log(opts.data, "Sending " + opts.type + " request to " + opts.url + "->");
                }
            }, arguments[0]);
            // expand complete function
            var thenComplete = opts.complete;
            var thenSuccess = opts.success;
            var thenErr = opts.error;
            opts.success = function(data, status, xhr) {
                var arg = arguments;
                engine.log(data, "Data returned->");
                if(engine.isFxn(thenSuccess)) {
                    thenSuccess.apply(null, arg);
                };
            };
            opts.error = function(xhr, status, err) {
                var arg = arguments;
                if(!xhr.responseJSON && xhr.responseText) {
                    try {
                        xhr.responseJSON = JSON.parse(xhr.responseText);
                        arg[0] = xhr;
                    } catch(ex) {}
                }
                engine.log(xhr, "Error information returned->");
                if(engine.isFxn(thenErr)) {
                    thenErr.apply(null, arg);
                };
            };
            opts.complete = function() {
                var arg = arguments;
                if(engine.isFxn(thenComplete)) {
                    thenComplete.apply(null, arg);
                }
                engine.log(arg, "Completed request via ajaxSubmit=>");
            };
            $.ajax(opts);
        },
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
            // var frame = $('body').find('#DialogFrame');
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
           /*
            frame.modal({
                keyboard: false,
                show: false
            });
            */
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
            /** @UPDATE 
             * Added handling of btnCallback and readyCallback methods
             * 
             * Added advanced CSS pass-through to dialog as opts.css parameter
             * 
             * Fixed css issues with alert frames covering the entire page
             */
            //var dialogID = engine.getDOMId("dialog_frame_");
            $("#DialogFrame").remove();
            
            var html = arguments[0];
            var buttons, title = null;
            var opts = {
                btnCallback: false,
                readyCallback: false,
                css: null,
                bootstrapClass: "modal-dialog modal-lg"
            };
            
            if(arguments[1]) {
                buttons = arguments[1];
            }
            if(arguments[2]) {
                title = arguments[2];
            }
            if(arguments[3]) {
                opts = $.extend(opts, arguments[3]);
            }
            
            var dialogID = "DialogFrame";
            var dialogDOM = document.createElement("div");
            dialogDOM.id = dialogID;
            dialogDOM.className = "modal fade";
            var innerDialog = document.createElement("div");
            innerDialog.className = opts.bootstrapClass;
            innerDialog.innerHTML = engine.dialogHTML;
            dialogDOM.appendChild(innerDialog);
            $("body").find(".dialog-frame").remove();
            $("body").append(dialogDOM);
            var dialogObj = $("#"+dialogID);
            
            /*
            $('#DialogFrame').modal({
                show: false
            });
            */
            if(opts.dialogWidth) {
                // $('#DialogFrame').dialog("option", "width", opts.dialogWidth);
                $('#DialogFrame').find(".modal-dialog").css({
                    width: opts.dialogWidth
                });
            }
            if(opts.css) {
                $("#DialogFrame").find(".modal-dialog").css(opts.css);
            }
            
            dialogObj.modal({
                autoOpen: true,
                keyboard: false,
                show: "fade",
                hide: "fade"
            })
            .on('shown.bs.modal', function() {
                if(title)
                    dialogObj.find('#DialogTitle').html(title);
                else
                    dialogObj.find('#DialogTitle').html("&nbsp;");

                dialogObj.find('#DialogContent').html(html);
                var btnBar = dialogObj.find("#DialogBtnBar");
                btnBar.html("");
                engine.log(buttons, "Buttons found->");
                if(buttons) {
                    _.each(buttons, function(button, index) {
                        if(!button.important) {
                            button.important = false;
                        }
                        if(!button.class) {
                            button.class = "btn btn-default";
                        }
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
                            btnBar.append(btn_html);
                            $('#'+btn_id).on('click', function() {
                                button.click();
                                // run dialog callback
                                if(opts.btnCallback && engine.isFxn(opts.btnCallback)) {
                                    opts.btnCallback();
                                }
                            });
                        }
                    });
                }
                // hit callback if passed
                if(opts.readyCallback && engine.isFxn(opts.readyCallback)) {
                    engine.log(opts.readyCallback, "Found readyCallback()!");
                    opts.readyCallback();
                }
            })
            .on('hidden.bs.modal', function() {
                dialogObj.remove();
            });
            engine.currentDialog = dialogObj;
        },
        getDialogDOM: function() {
            return engine.currentDialog;
            // return $('#DialogFrame');
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
            //$('#DialogFrame').modal('hide');
            engine.currentDialog.modal('hide');
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
                trivial: false,
                interval: 1200,
                timeout: 4800
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
            toastFrame.addClass('wiap-ui-engine-toast');
            var toast = document.createElement('div');
            newid = engine.getDOMId("toast-");
            toast.id = newid;
            toast = $(toast);
            toast.addClass("toast");
            if(opts.has_error) {
                toast.addClass("error");
            }
            toast.append("<a href='#' class='close-toast'><b class='fa fa-times'></b></a>");
            toast.append(html);
            toastFrame.append(toast);
            $('body').append(toastFrame);
            engine.log(toast);
            // find instance of toast appended to body
            toast = $('#'+newid);
            toast.find('.close-toast').bind('click', function(e) {
                e.preventDefault();
                // var toast = $(this);
                toast.fadeOut(250, function() {
                    // toastFrame.remove();
                    engine.clearToast();
                });
            });
            if(opts.position) {
                try {
                    toast.position(opts.position);
                } catch(ex) {
                    engine.log(null, "Invalid position option for toast.");
                }
            }
            /**
            if(opts.callback) {
                try {
                    if(engine.isFxn(opts.callback)) opts.callback();
                } catch(ex) {
                    engine.log(null, "Failed to run callback of toast.");
                }
            }
            */
            if(opts.css) {
                toast.css(opts.css);
            }
            if(opts.draggable) {
                toast.draggable();
            }
            if(opts.trivial) {
                toast.append("<div style='text-align:center;font-size:0.75em;'>This notice will clear in <span id='toast-counter'>"+parseInt(opts.timeout/opts.interval)+"</span>...</div>");
                var timekeep=0;
                engine.killToastCheck = setInterval(function() {
                    timekeep += opts.interval;
                    if(timekeep>=opts.timeout) {
                        clearInterval(engine.killToastCheck);
                        engine.clearToast();
                        if(engine.isFxn(opts.callback)) {
                            opts.callback();
                        }
                    } else {
                        counter = toast.find("#toast-counter");
                        if(!counter.is(":visible")) {
                            counter.css({
                                opacity: 1,
                                filter: "alpha(opacity=100)"
                            });
                        }
                        counter.html(parseInt((opts.timeout-timekeep)/opts.interval));
                    }
                }, opts.interval);
            } else {
                if(opts.callback) {
                    try {
                        if(engine.isFxn(opts.callback)) opts.callback();
                    } catch(ex) {
                        engine.log(null, "Failed to run callback of toast.");
                    }
                }
            }
        },
        closeToast: function(toast) {
            clearInterval(engine.killToastCheck);
            toast.fadeOut(250, function() {
                toast.parents('.toast-frame').remove();
                //toast.remove();
            });
        },
        clearToast: function() {
            clearInterval(engine.killToastCheck);
            $('.toast').fadeOut(250, function() {
                $('.toast-frame').remove();
            });
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
        }/*,
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
        }*/,
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
        },
        getJSONFromNativeIframe: function(iframe_id) {
            return JSON.parse($("#"+iframe_id)[0].contentDocument.body.innerText);
        },
        iframeFormSubmit: function() {
            /** @NEW **/
            var form, success_callback, error_callback, complete_callback;
            form = document.querySelector(arguments[0]);
            success_callback = arguments.length>1 ? arguments[1] : false;
            error_callback = arguments.length>2 ? arguments[2] : false;
            complete_callback = arguments.length>3 ? arguments[3] : false;
            var frameId = engine.getDOMId("frame-");
            engine.log(frameId, "Frame ID ->");
            var frame = document.createElement("iframe");
            frame.id = frameId;
            frame.name = frameId;
            frame.style.display = "none";
            frame.style.border = 0;
            document.querySelector("body").appendChild(frame);
            form.target = frameId;
            engine.log(frameId, "Frame name->");
            // frame = $(frame);
            frame = document.querySelector("#"+frameId);
            frame.onload = function() {
                engine.log(true, "iframe submit load complete");
                try {
                    var json = JSON.parse(frame.contentDocument.body.innerText);  
                    engine.log(frame, "Results->");
                    if(engine.isFxn(success_callback)) {
                        engine.log(true, "Found success callback->");
                        success_callback(json, frame.contentDocument.body.innerText, frame.contentDocument.body.innerHTML);
                    }
                } catch(ex) {
                    engine.log(ex, "An error occurred->");
                    engine.log(frame.contentDocument.body.innerText, "Frame contents->");
                    if(engine.isFxn(error_callback)) {
                        error_callback();
                    }
                }
                if(engine.isFxn(complete_callback)) {
                    complete_callback();
                }
            };
        },
        newWindow: function() {
            var w = $(window).width();
            var minW = 450;
            var dialogH = 600;
            var dialogW = Math.min.apply(null, [minW, w]);
            var margins = w-dialogW;
            var margin = margins>20 ? (margins/2) : 10;
            var opts = {
                url: null,
                width: dialogW,
                height: dialogH,
                marginTop: 100,
                marginLeft: margin,
                windowTitle: "New Window"
            };
            opts = arguments.length > 0 ? $.extend(opts, arguments[0]) : opts;
            if(!opts.url) {
                engine.showToast("Dev: You must provide a URL",{has_error:true,trivial:false});
            }
            var params = ["toolbar=no","location=no","menubar=no","resizable=yes","width="+opts.width+"px","height="+opts.height+"px","top="+opts.marginTop,"left="+opts.marginLeft];
            return window.open(opts.url, opts.windowTitle, params.join(","));
        },
        // UNDERSCORE.JS is required to use this method!
        loadTemplates: function(options) {
            if(!_) {
                engine.log("Underscore.js library does not exist! Aborting...");
                return false;
            }
            var options = $.extend({
                source: null, // the source javascript object to load compiled templates to
                dest: {}, // the destination javascript object to load compiled templates to
                callback: false,
                target: document.querySelector("body"), // this should be the 'spinner' target where the busy graphic will show
                retryLimit: 10
            }, options);
            target = options.target;
            spinner.spin(target);
            var attempts = 0;
            // start waiting for templates to load
            var waitingForTemplates = setInterval(function() {
                attempts += 1;
                var passed = true;
                _.each(options.source, function(template) {
                   if(!template.loaded) {
                       engine.log("Templates not ready (" + attempts + ")...");
                       if(attempts >= options.retryLimit) {
                           engine.showToast("There was a problem loading this page. Contact your administrator. Error: template load failure.",{trivial:false, has_error:true});
                           clearInterval(waitingForTemplates);
                           spinner.stop(target);
                       }
                       passed = false;
                   }
                });
                // if all templates are available
                if(passed) {
                    clearInterval(waitingForTemplates);
                    if(engine.isFxn(options.callback)) {
                        // call callback method and pass it the compiled templates
                        options.callback(options.dest);
                    }
                }
            }, 500);
            // start loading templates
            _.each(options.source, function(template, key) {
                $.ajax({
                    url: template.url,
                    async: true,
                    cache: false,
                    success: function(html) {
                        engine.log(template.url, "Compiling template->");
                        // compile user editor
                        options.dest[template.key] = _.template(html);
                        options.source[key].loaded = true;
                        engine.log(options.source, "Template status->");
                    },
                    error: function(xhr, status, err) {
                        engine.log(xhr, "Err->");
                        options.source[key].loaded = false;
                        $(options.source[key].parents).hide();
                    }
                });
            });
            
        },
        enforceMaxLength: function(elemIDEN) {
            $(elemIDEN).each(function(key, elem) {
                // var input = $(this);
                var input = $(elem);
                if(!input.attr("maxlength")) {
                    engine.log(input, "The element at index ("+key+") of [" + elemIDEN + "] was ignored for enforcing maxlength because the maxlength attribute was not set =>");
                } else {
                    var elem_id = engine.getDOMId();
                    input.attr('counter-id', elem_id);
                    try {
                        // input.after("<div class=\"counter-frame\"><span id='" + elem_id + "' class='" + options.counterDisplayClass + "'>" + input.val().length + "</span></div>");
                        input.after("<div class=\"counter-frame\"><span id='" + elem_id + "' class='" + options.counterDisplayClass + "'>" + input.attr("maxlength") + "</span></div>");
                        input.bind('keyup', function() {
                            var maxlen=$(this).attr("maxlength");
                            var counter = $('#'+$(this).attr('counter-id'));
                            if($(this).attr('maxlength')) {
                                if(maxlen-$(this).val().length<10) {
                                    counter.css({
                                        color: "#ff3300"
                                    });
                                } else {
                                    counter.css({
                                        color: "inherit"
                                    });
                                }
                            }
                            counter.html(maxlen-$(this).val().length);
                        });
                    } catch(ex) {}
                }
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
    /*
    $('.'+options.counterClass).each(function() {
        var input = $(this);
        var elem_id = engine.getDOMId();
        input.attr('counter-id', elem_id);
        try {
            // input.after("<div class=\"counter-frame\"><span id='" + elem_id + "' class='" + options.counterDisplayClass + "'>" + input.val().length + "</span></div>");
            input.after("<div class=\"counter-frame\"><span id='" + elem_id + "' class='" + options.counterDisplayClass + "'>" + input.attr("maxlength") + "</span></div>");
            input.bind('keyup', function() {
                var maxlen=$(this).attr("maxlength");
                var counter = $('#'+$(this).attr('counter-id'));
                if($(this).attr('maxlength')) {
                    if(maxlen-$(this).val().length<10) {
                        counter.css({
                            color: "#ff3300"
                        });
                    } else {
                        counter.css({
                            color: "inherit"
                        });
                    }
                }
                counter.html(maxlen-$(this).val().length);
            });
        } catch(ex) {}
    });
    */
    engine.enforceMaxLength('.'+options.counterClass);

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
