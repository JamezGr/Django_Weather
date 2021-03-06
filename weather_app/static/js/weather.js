window.addEventListener('load', function () {

    var current_time = $('#current-time').text();
    var current_hour = current_time.slice(0,2);
    var current_minute = current_time.slice(3,5);
    
    current_hour = parseInt(current_hour);
    current_minute = parseInt(current_minute);

    console.log(current_time);


    var bg_img = document.getElementById("current-weather-box");

    var condition_text = $('.current-condition').text();

    var sunrise_time = $('.sunrise-text').text();
    var sunrise_hour = parseInt(sunrise_time.slice(0,2));
    var sunrise_minute = parseInt(sunrise_time.slice(3,5));

    var sunset_time = $('.sunset-text').text();
    var sunset_hour = parseInt(sunset_time.slice(0,2));
    var sunset_hour = sunset_hour + 12;

    var sunset_minute = parseInt(sunset_time.slice(3,5));


    // Dynamic Weather Background Images

    // Sunrise Hour
    if (current_hour == sunrise_hour) {
        $('#current-weather-box').css('background-image', 'url(static/css/img/Background/sunrise_background.png)');
        console.log('Sunrise');
    }

    // Sunset Hour
    if (current_hour == sunset_hour) {
        $('#current-weather-box').css('background-image', 'url(static/css/img/Background/sunset_background.png)');
        console.log('Sunset');
    }

    // If the Current Time is Between Sunrise Time and Sunset Time
    if (current_hour > sunrise_hour && current_hour < sunset_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/day_rain_background.png)');
            console.log('Day Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/thunder_background.png');
            console.log('Thunder');
        }
         else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/day_snow_background.png)');
            console.log('Day Snow');
        }
        else {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/day_background.png)');
            console.log('Day Time');
        }
    }

    // If the Current Time is Past Sunset or Before Sunrise
    if (current_hour > sunset_hour || current_hour < sunrise_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/night_rain_background.gif)');
            console.log('Night Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/thunder_background.png)');
            console.log('Thunder');
        }
        else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/night_snow_background.png)');
            console.log('Night Snow');
        }
        else {
            $('#current-weather-box').css('background-image', 'url(static/css/img/Background/night_background.jpg)');
            console.log('Night');
        }
    }


    var search_results = JSON.parse($("#results-json").text());

    if (search_results[0] != "Nonette, France") {
        if (search_results[0] != "U" ) {
            console.log(search_results[0]);
            alert("Location Selected is " + search_results[0])
        }
    }


    console.log("Sunrise Time: " + sunrise_hour + ':' + sunrise_minute);
    console.log("Sunset Time: " + sunset_hour + ':' + sunset_minute);


    if (search_results == "Unable to find any matching weather location to the query submitted!") {
        alert(search_results)
    }


    // Modal View for Search Box
    $("#change-location").click(function(e){
        e.stopPropagation();

        $('#close-icon').click (function(){
            e.stopPropagation();

            modalClose();

            if ($('.current-weather-row').css('display') == "none") {
                $('.hourly-weather').attr('style','opacity: 1');
                $('.hourly-weather').attr('style','display:block');
                $('#chartContainer').attr('style','display:block');
            }

            $('#current-weather-box').css('opacity', 1);

            $('.current-location-text').css('opacity', 1);
            $('.change-location').css('opacity', 1);
            $('.col-sm').css('background-color', 'transparent');
            $('.date-text').css('background-color', 'transparent');

        })
     });


     $(document).keyup(function(e)  {
            if(e.key === "Escape") {
                modalClose();

                if ($('.current-weather-row').css('display') == "none") {
                    $('.hourly-weather').attr('style','opacity: 1');
                    $('.hourly-weather').attr('style','display:block');
                    $('#chartContainer').attr('style','display:block');
                }

            };
        });


     $("#change-location").on("click", function() {
        $('#search-box').css('display', 'block');
        modalOpen();
     })


     $(".search-icon").on("click", function() {
        $("#search-results-text").submit();
     });


     $(".user-location").on("click", function()
     {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            $("#search-text").val(lat.toString() + ", " + long.toString());
            $("#search-results-text").submit();

        });
     });


     $("#search-text").keyup(function(){
        console.log($("#search-text").val());
     });


     $('.developer-log-text').click(function() {
        console.log('Developer Log');

        if ($('#weather-overlay').css('background-color') == "rgba(0, 0, 0, 0)") {

            $('#developer-log').css('display', 'block');
            modalOpen();
        }
     });


     $('#log-close-icon').click(function(){
        console.log('Clicked');

        modalClose();

     });


});

    function modalClose() {
        $('#weather-overlay').css('background', 'rgba(0, 0, 0, 0) none repeat scroll 0% 0%');
        $('#search-box').css('display', 'none');
        $('#current-weather-box').css('opacity', 1);
        $('.current-location-text').css('opacity', 1);
        $('.change-location').css('opacity', 1);
        $('.col-sm').css('background-color', 'transparent');
        $('.date-text').css('background-color', 'transparent');
        $('#developer-log').css('display', 'none');

    }

    function modalOpen() {
        $('#chartContainer').css('display', 'none');
        $('.hourly-weather').attr('style','display:none');
        $('.current-location-text').css('opacity', .05);
        $('.change-location').css('opacity', .05);
        $('#search-box').css('opacity', 1);
        $('#weather-overlay').css('background', 'rgba(0, 0, 0, 0.8) none repeat scroll 0% 0%');
        $('#current-weather-box').css('opacity', 0.05);

    }