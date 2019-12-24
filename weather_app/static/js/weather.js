var today = new Date();
var date = today.getFullYear()+ '-' + (today.getMonth()+1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

console.log(dateTime)

window.addEventListener('load', function () {

    var bg_img = document.getElementById("current_weather_box");

    var condition_text = $('.current_condition').text();

    var sunrise_time = $('.sunrise-text').text();
    var sunrise_hour = parseInt(sunrise_time.slice(0,2));
    var sunrise_minute = parseInt(sunrise_time.slice(3,5));

    var sunset_time = $('.sunset-text').text();
    var sunset_hour = parseInt(sunset_time.slice(0,2));
    var sunset_hour = sunset_hour + 12;

    var sunset_minute = parseInt(sunset_time.slice(3,5));


    // Dynamic Weather Background Images

    // Sunrise Hour
    if (today.getHours() == sunrise_hour) {
        $('#current_weather_box').css('background-image', 'url(static/css/img/Background/sunrise_background.png)');
        console.log('Sunrise');
    }

    // Sunset Hour
    if (today.getHours() == sunset_hour) {
        $('#current_weather_box').css('background-image', 'url(static/css/img/Background/sunset_background.png)');
        console.log('Sunset');
    }

    // If the Current Time is Between Sunrise Time and Sunset Time
    if (today.getHours() > sunrise_hour && today.getHours() < sunset_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/day_rain_background.png)');
            console.log('Day Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/thunder_background.png');
            console.log('Thunder');
        }
         else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/day_snow_background.png)');
            console.log('Day Snow');
        }
        else {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/day_background.png)');
            console.log('Day Time');
        }
    }

    // If the Current Time is Past Sunset or Before Sunrise
    if (today.getHours() > sunset_hour || today.getHours() < sunrise_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/night_rain_background.gif)');
            console.log('Night Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/thunder_background.png)');
            console.log('Thunder');
        }
        else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/night_snow_background.png)');
            console.log('Night Snow');
        }
        else {
            $('#current_weather_box').css('background-image', 'url(static/css/img/Background/night_background.jpg)');
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

            $('#current_weather_box').css('opacity', 1);

            $('.current-location-text').css('opacity', 1);
            $('.change_location').css('opacity', 1);
            $('.col-sm').css('background-color', 'transparent');
            $('.date_text').css('background-color', 'transparent');

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
        $('#current_weather_box').css('opacity', 1);
        $('.current-location-text').css('opacity', 1);
        $('.change_location').css('opacity', 1);
        $('.col-sm').css('background-color', 'transparent');
        $('.date_text').css('background-color', 'transparent');
        $('#developer-log').css('display', 'none');

    }

    function modalOpen() {
        $('#chartContainer').css('display', 'none');
        $('.hourly-weather').attr('style','display:none');
        $('.current-location-text').css('opacity', .05);
        $('.change_location').css('opacity', .05);
        $('#search-box').css('opacity', 1);
        $('#weather-overlay').css('background', 'rgba(0, 0, 0, 0.8) none repeat scroll 0% 0%');
        $('#current_weather_box').css('opacity', 0.05);

    }