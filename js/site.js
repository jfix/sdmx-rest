// $Id: site.js 110 2010-10-20 22:45:41Z Fix_J $

var __site_version = "0.1";

$(document).ready( function() {
    // write version based on SDMX.version defined above and $Rev: 110 $ keyword in the main html files.
    $("#svn_id").html("v" + __site_version + "." +  /[0-9]+/.exec(svn_rev));
    
    // click on the back to top links in certain h2 headings
    $("a.back2top").click(function(event){
        event.stopPropagation();
        document.location.href="#";
    });  
    
    // create hover effect for main h1 head menu
    $("a.menu").hover(
        function() {
            $(this).find(".arrow").css("color", "black");
            $(this).find(".unselected").addClass("hover");
        },
        function() {
            $(this).find(".arrow").css("color", "white");
            $(this).find(".unselected").removeClass("hover");
        }
    );
    
    // open section when click comes from a toc entry
    $(".toc a").click( function() {
        $( "h2#" + $(this).attr("href")).next().stop(true, true).slideDown();
    });

});