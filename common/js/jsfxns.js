function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function validateURL(textval) {
        var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return urlregex.test(textval);
    }
    
function validEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email);
} 
    
function getTimeZeroFill(pos, val) {
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
}
function getTimeString( date ) {
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
}
function getTimeDiff(date1, date2) {
    return date1.getTime() - date2.getTime();
}

function preview(text, previewMax) {
    var showtext = text.substring(0,previewMax);
    if(text.length>previewMax) {
        showtext = showtext + "...";
    }
    return showtext;
}

function isNumericKeyCode(keyCode) {
    if(keyCode >= 48 && keyCode <= 57 
            || keyCode >= 96 && keyCode <= 105
            || [107, 108, 110, 8, 9, 45, 46].indexOf(keyCode)!==-1) {
        return true;
    } else {
        return false;
    }
}