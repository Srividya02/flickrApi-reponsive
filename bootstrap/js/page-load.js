//calculate the time before calling the function in window.onload
var preload = (new Date()).getTime();

function getPageLoadTimeinSeconds(){
        //current time
        var postload = (new Date()).getTime();
        // calculate the seconds
        getSeconds = (postload-preload) / 1000;
        // show the results in seconds
        $("#display_page_load_time").text('Page load time @  ' + getSeconds + ' in seconds.');
}

window.onload = getPageLoadTimeinSeconds;