/* 
 * The MIT License
 *
 * Copyright 2014 uchilaka.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Requires FontAwesome CSS
wiap_ui = function() {
    var me = this;

    var options = {
        verbose: true, // option for outputting runtime activity - true = show feedback in console log
        namespace: "WIAP_UI_INIT", // app namespace - will prefix console outputs
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
    me.getDOMId = function(prefix) {
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
    };
    me.isFxn = function(obj) {
        return obj && typeof obj === "function";
    };
    me.showToast = function() {
        // cancel removal of toast
        clearTimeout(me.killToast);
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
        me.log(html, "Show toast message:");
        var toastFrame = document.createElement('div');
        toastFrame.id = me.getDOMId("toastframe-");
        toastFrame = $(toastFrame);
        toastFrame.addClass('toast-frame');
        toastFrame.addClass('wiap-ui-engine-toast');
        var toast = document.createElement('div');
        newid = me.getDOMId("toast-");
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
        me.log(toast);
        // find instance of toast appended to body
        toast = $('#'+newid);
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
                me.log(null, "Invalid position option for toast.");
            }
        }
        if(opts.callback) {
            try {
                if(me.isFxn(opts.callback)) opts.callback();
            } catch(ex) {
                me.log(null, "Failed to run callback of toast.");
            }
        }
        if(opts.css) {
            toast.css(opts.css);
        }
        if(opts.draggable) {
            toast.draggable();
        }
        if(opts.trivial) {
            toast.append("<div style='text-align:center;font-size:0.75em;'>This notice will clear in <span id='toast-counter'>"+parseInt(opts.timeout/opts.interval)+"</span>...</div>");
            var timekeep=0;
            me.killToastCheck = setInterval(function() {
                timekeep += opts.interval;
                if(timekeep>=opts.timeout) {
                    clearInterval(me.killToastCheck);
                    me.clearToast();
                    if(me.isFxn(opts.callback)) {
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
        }
    };
    me.closeToast = function(toast) {
        clearInterval(me.killToastCheck);
        toast.fadeOut(250, function() {
            toast.remove();
            toast.parents('.toast-frame').remove();
        });
    };
    me.clearToast = function() {
        clearInterval(me.killToastCheck);
        $('.toast').fadeOut(250, function() {
            $('.toast-frame').remove();
        });
    };
    me.log = function(obj, msg) {
        if(options.verbose) {
            if(msg) console.log(options.namespace +"::" + msg);
            if(obj) console.log(obj);
        }
    };
    return me;
};

