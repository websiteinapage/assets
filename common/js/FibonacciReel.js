$.fn.FibonacciReel = function() {
    var me = this;
    var options = {
        container: null,
        itemClass: 'reel-items',
        height: 240,
        gutter: 10,
        limit: 3,
        overlayTextColor: '#fff',
        overlayDivClass: 'item-overlay',
        data: [],
        datasource: null,
        api_index: null
    };
    if(!options.container) options.container = '#'+this.attr('id');
    if(arguments) {
        options = $.extend(options, arguments[0]);
    }
    me.css({ margin: 0, padding: 0 });
    me.find('li').addClass(options.itemClass);
    $('.item-caption').css({
        display: "none",
        width: "100%"
    });
    $('.'+options.itemClass).css({
        padding: 0, float: "left", display: "inline-block", 
        margin: "0 " + options.gutter + "px " + options.gutter + "px 0" 
    });
    var sequence = {
        set: [],
        wideset: [1, 2, 3, 4, 5],
        narrowset: [1, 2, 3],
        mobileset: [1, 1], /** Trick to fix bug with mobile layout **/
        widths: []
    };
    $('body').css({
        margin: 0, padding: 0
    });
    me.rows = [];
    /** scroll position to trigger fetch **/
    me.triggerFetchAt = 0;
    var last_at;

    this.getId = function() {
        var id = Math.random()*100000;
        while($('#item-'+id).length>0) {
            id = Math.random()*100000;
        }
        return 'item-'+id;
    };

    this.reLayout = function() {
        var parentElem = $(options.container);
        var w = parentElem.width();
        sequence.widths = [];
        if(parentElem.width()>=1100) {
            sequence.set = sequence.wideset;
        } else if (parentElem.width()>=500) {
            sequence.set = sequence.narrowset;
        } else {
            sequence.set = sequence.mobileset;
        }
        for(var i=0; i<sequence.set.length; i++) {
            sequence.widths[i] = w/sequence.set[i];
        }
        console.log(sequence.set);
        console.log("reLayout() done");
    };
    this.genWidth = function() {
        var at = 1;
        if(sequence.set.length>1) {
            /** Make sure rows get number of elements different from last row **/
            at = Math.floor(Math.random()*sequence.set.length);
            while(last_at===at) {
               at = Math.floor(Math.random()*sequence.set.length);
            }
        }
        last_at = at;
        me.rowCnt=sequence.set[at];
        return sequence.widths[at];
    };

    this.init = function() {
        /** MUST come AFTER fetchData() **/
        if(!options) throw 'No options available.'; 
        if(!options.data) throw 'No data available.'; 
        if(options.data.length<1) throw 'No items available.'; 
        $(options.container).html("");
        me.at = 0;
        console.log("init() done");
    };

    this.append = function() {
        if(!me.at) me.at = 0;
        var row_tally=0;
        // console.log(options.data);
        console.log("Limit: " + options.limit);
        console.log("Data size: " + options.data.length);
        do {
            var w = me.genWidth();
            var thisrow = [];
            w = w-options.gutter;
            console.log("Row " + (row_tally));
            for(var j=0; j<me.rowCnt && me.at<options.data.length; j++, me.at++) {
                var item = options.data[me.at];
                // append to container
                $(options.container).append("<li id=\"" + item.id + "\">" + item.html + "</li>");
                var DOMitem = $('#'+item.id);
                DOMitem.hide();
                DOMitem.css({
                    width: w,
                    height: options.height,
                    padding: 0, float: "left", display: "inline-block", 
                    margin: "0 " + options.gutter + "px " + options.gutter + "px 0"
                });
                DOMitem.fadeIn(250);
                if(item.img) {
                    // track width
                    DOMitem.css({
                        width: w,
                        margin: "0 " + options.gutter + "px " + options.gutter + "px 0",
                        height: options.height,
                        backgroundImage: "url('" + item.img.src + "')",
                        backgroundSize: "cover"
                    });
                } else {
                    // track width
                    DOMitem.css({
                        width: w,
                        margin: "0 " + options.gutter + "px " + options.gutter + "px 0",
                        height: options.height,
                        color: '#000'
                    });
                }
                var DOMcaption = DOMitem.find('.item-caption');
                DOMcaption.css({
                    height: options.height-6,
                    width: w-6,
                    opacity: 0.5,
                    background: '#000',
                    color: '#fff',
                    padding: '3px',
                    position: "absolute",
                    zIndex: 2
                })
                .position({
                    my: "top left",
                    at: "top left",
                    of: DOMitem
                });
                var DOMcontent = DOMitem.find('.item-content');
                DOMcontent
                        .css({
                            position: "absolute",
                            zIndex: 1,
                            width: DOMitem.width(),
                            height: DOMitem.height(),
                            overflow: "hidden"
                        })
                        .position({
                            my: "top left",
                            at: "top left",
                            of: DOMitem
                        });

                DOMitem.bind('mouseover click', function() {
                    var tItem = $(this).find('.item-caption');
                    me.focusCaptionID = tItem.attr('id');
                    me.focusItemID = $(this).attr('id');
                    // var lastContent = $(this).find('.item-content');
                    $(".item-caption:not(#" + tItem.attr('id') + ")").fadeOut(250, function() {
                        var focusCaption = $('#'+me.focusCaptionID);
                        var focusItem = $('#'+me.focusItemID);
                        var focusContent = focusItem.find('.item-content');
                        setTimeout(function() {
                            $('.item-content:not(:visible):not(#' + focusContent.attr('id') + ')').show();
                        }, 350);
                        focusContent.hide();
                        focusCaption.fadeIn(250);
                    });
                });
                me.lastItem = item;
                // push to row last
                thisrow.push($.extend(item, {
                    width: w,
                    height: options.height
                }));
            }
            // fix last item in row
            var DOMitem = $('#'+me.lastItem.id);
            DOMitem.css({
                marginRight: 0
            });
            me.rows.push(thisrow);
            row_tally=row_tally+1;
        } while(row_tally<options.limit && me.at<options.data.length);
        // get last item
        var DOMitem = $('#'+me.lastItem.id);
        me.triggerFetchAt = DOMitem.position().top-DOMitem.height();
        console.log(me.triggerFetchAt);
        console.log("append() done.");
    };

    this.constructFromElem = function() {
        //this.hide();
        var at=1;
        this.find('li').each(function() {
            var item = $(this);
            var item_id = 'item-'+at;
            item.attr('id', item_id);
            // item.addClass(options.itemClass);
            // get slide details via ajax
            var thumbnail = {
                id: item_id,
                caption: "<h1>This is the Cover Story</h1>This is caption #" + at,
                detail: "This is some more information",
                url: "http://twitter.com/uchechilaka",
                img: null,
                html: null
            };
            var imgelem = item.find('img:first');
            if(imgelem.length>0) {
                try {
                    thumbnail.img = new Image();
                    thumbnail.img.src = imgelem.attr('src');
                } catch(ex) {
                    // do nothing
                }
                imgelem.remove();
            } else {
                item.addClass('html-only');
            }
            // track classes
            var captionElem = item.find('caption:first');
            if(captionElem.length>0) {
                thumbnail.caption = captionElem.html();
                captionElem.remove();
            }
            var content = item.html();
            item.html("<div id=\"item-content-" + at + "\" class='item-content'>" + content + "</div>");
            item.append("<div id=\"item-caption-" + at + "\" class=\"item-caption " + options.overlayDivClass + "\" style='display: none'>" + thumbnail.caption + "</div>");
            if(imgelem.length>0) {
                item.find('.item-content').css({
                    color: options.overlayTextColor
                });
            }
            // thumbnail.class= item.attr('class');
            thumbnail.html = item.html();
            options.data.push(thumbnail);
            at+=1;
        });
    };

    this.constructFromDS = function() {
        $.ajax({
            url: options.datasource,
            type: "post",
            success: function(data, status, jqXHR) {
                // console.log(data);
                var src_data;
                if(data[options.api_index]) {
                    src_data = data[options.api_index];
                } 
                else if(Object.prototype.toString.call( data ) === '[object Array]') {
                    src_data = data;
                } else {
                    throw "Index " + options.api_index + " not found in output";
                }
                console.log(src_data);
                // build
                for(var i=0;i<src_data.length;i++) {
                    var item = src_data[i];
                    var xid = me.getId();
                    var at = i+1;
                    // get slide details via ajax
                    var thumbnail = $.extend({
                        id: xid,
                        caption: item.caption,
                        detail: "This is some more information on item #" + xid,
                        url: "http://twitter.com/uchechilaka",
                        default_content: "This is the default content for #" + xid,
                        img_url: null,
                        img: null,
                        html: null
                    }, item);
                    if(thumbnail.img_url) {
                        try {
                            thumbnail.img = new Image();
                            thumbnail.img.src = thumbnail.img_url;
                        } catch(ex) {
                            // do nothing
                        }
                    } else {
                        thumbnail.class += ' html-only';
                    }
                    var content = item.default_content;
                    // track classes
                    thumbnail.html = "<div id=\"item-content-" + at + "\" class='item-content' style=\"color: " + options.overlayTextColor + "\">" + content + "</div>"
                            + "<div id=\"item-caption-" + at + "\" class=\"item-caption " + options.overlayDivClass + "\" style='display: none'>" + thumbnail.caption + "</div>";
                    options.data.push(thumbnail);
                }
                console.log(options.data);
                me.init();
                /** Re-layout on window resize **/
                me.reLayout();
                /** Build layout **/
                me.append();
            },
            error: function(jqXHR, status, err) {
                console.log(err);
            }
        });
    };

    this.fetchData = function() {
        /** pull all ajax data for elements and build DOM **/
        if(!options.datasource) {
            // build from ul element
            me.constructFromElem();
            me.init();
            /** Re-layout on window resize **/
            me.reLayout();
            /** Build layout **/
            me.append();
        } else {
            me.constructFromDS();
        }
    };

    try {
        this.fetchData();
        console.log(options);
        console.log(sequence.widths);
        var me = this;
        $(window).bind('scroll', function() {
           console.log("Scroll Top: " + $(document).scrollTop());
           // append more
           if($(document).scrollTop()>me.triggerFetchAt) {
               me.append();
           } 
        });
        /** Re-calculate widths **/
        $(window).bind('resize', function() {
            me.reLayout();
            clearTimeout(me.do_ReBuild);
            me.do_ReBuild = setTimeout(function() {
                me.init();
                me.append();
            }, 500);
        });
    } catch(ex) { }
};
