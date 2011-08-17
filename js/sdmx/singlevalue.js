var __jquery = false;
function initJQuery() {
    if (typeof (jQuery) == 'undefined') {
        if (! __jquery) {
            __jquery = true;
            
            document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js\"></scr" + "ipt>");
        }
        setTimeout("initJQuery()", 50);
    }
}
initJQuery();

var __sdmx = false;
function initSDMX() {
    if (typeof(SDMX)=='undefined' || (jQuery.xmlToJSON)=='undefined') {
        if(!__sdmx) {
            __sdmx = true;
            document.write("<scr" + "ipt type=\"text/javascript\" src=\"../js/sdmx/core.js\"></scr" + "ipt>");
            document.write("<scr" + "ipt type=\"text/javascript\" src=\"../js/jquery.xmlutils.js\"></scr" + "ipt>");
        }
        setTimeout("initJQuery()", 50);
    }
}
initSDMX();
