var today = new Date();
var date = today.getFullYear()+ '-' + (today.getMonth()+1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

console.log(dateTime)

window.addEventListener('load', function () {
    var condition = document.getElementsByClassName("current_condition");
    var condition_text = condition[0]['innerText'];
    var bg_img = document.getElementById("current_weather_box");


    var sunrise = document.getElementsByClassName("sunrise-icon");
    var sunrise_time = sunrise[0]['lastElementChild']['innerText'];
    var sunrise_hour = parseInt(sunrise_time.slice(0,2));
    var sunrise_minute = parseInt(sunrise_time.slice(3,5));

    var sunset = document.getElementsByClassName("sunset-icon");
    var sunset_time = sunset[0]['lastElementChild']['innerText'];
    var sunset_hour = parseInt(sunset_time.slice(0,2));
    var sunset_hour = sunset_hour + 12;

    var sunset_minute = parseInt(sunset_time.slice(3,5));

    // Dynamic Weather Background Images

    // Sunrise Hour
    if (today.getHours() == sunrise_hour) {
        document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/sunrise_background.png)";
        console.log('Sunrise');
    }

    // Sunset Hour
    if (today.getHours() == sunset_hour) {
        document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/sunset_background.png)";
        console.log('Sunset');
    }

    // If the Current Time is Between Sunrise Time and Sunset Time
    if (today.getHours() > sunrise_hour && today.getHours() < sunset_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_rain_background.png)";
            console.log('Day Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/thunder_background.png)";
            console.log('Thunder');
        }
         else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_snow_background.png)";
            console.log('Day Snow');
        }
        else {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_background.png)";
            console.log('Day Time');
        }
    }

    // If the Current Time is Past Sunset or Before Sunrise
    if (today.getHours() > sunset_hour || today.getHours() < sunrise_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_rain_background.gif)";
            console.log('Night Rain');
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/thunder_background.png)";
            console.log('Thunder');
        }
        else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_snow_background.png)";
            console.log('Night Snow');
        }
        else {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_background.jpg)";
            console.log('Night');
        }
    }

    // DEBUGGING PURPOSES
    // console.log("Condition: " + condition_text);
    // console.log(window.getComputedStyle(bg_img).backgroundImage);
    // console.log(window.getComputedStyle(overlay).backgroundColor)
    // console.log("Hour: " + today.getHours());

    var search_results = JSON.parse(document.getElementById("results-json").textContent);
    var overlay = document.getElementById("weather-overlay");
    var change_location = document.getElementById("change-location");
    var search_box = document.getElementById("search-box");
    var bg_img = document.getElementById("current_weather_box");
    var close = document.getElementById("close-icon");


    console.log("Sunrise Time: " + sunrise_hour + ':' + sunrise_minute);
    console.log("Sunset Time: " + sunset_hour + ':' + sunset_minute);


    if (search_results[0] != "Nonette, France") {
        if (search_results[0] != "U" ) {
            console.log(search_results[0]);
            alert("Location Selected is " + search_results[0])
        }
    }

    if (search_results == "Unable to find any matching weather location to the query submitted!") {
        alert(search_results)
    }


    // Modal View for Search Box
    $("#change-location").click(function(e){
        e.stopPropagation();

        close.addEventListener('click', function(){
            e.stopPropagation();

            overlay.style.background = "rgba(0, 0, 0, 0) none repeat scroll 0% 0%";
            search_box.style.display = "none";

            if ($('.current-weather-row').css('display') == "none") {
                $('.hourly-weather').attr('style','opacity: 1');
                $('.hourly-weather').attr('style','display:block');
                $('#chartContainer').attr('style','display:block');
            }

            bg_img.style.opacity = 1;

        })
     });


     $(document).keyup(function(e)  {
            if(e.key === "Escape") {
                overlay.style.background = "rgba(0, 0, 0, 0) none repeat scroll 0% 0%";
                $('.hourly-weather').attr('style','opacity: 1');
                search_box.style.display = "none";
                $('.hourly-weather').attr('style','display:block');
                bg_img.style.opacity = 1;

                if ($('.current-weather-row').css('display') == "none") {
                    $('#chartContainer').attr('style','display:block');
                }

            };
        });



     $(".search-icon").on("click", function()
     {
        $("#search-results-text").submit();
     });


     $("#search-text").keyup(function(){
        console.log($("#search-text").val());
     });


     $("#search-results-text").keyup(function(e){
        // console.log($("#search").val());

        var search_text = $("#search-text").val();
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();


        $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/",
        data:{
            searchText: search_text,
            csrfmiddlewaretoken: csrftoken,
        },

        success: function() {
            console.log("Typing");
        }

     });
     });


});

    const searchBox = () => {

    // Black Transparent Overlay OnClick of Change Location
    var overlay = document.getElementById("weather-overlay");
    var bg_img = document.getElementById("current_weather_box");
    var search_box = document.getElementById("search-box");


    if (overlay.style.background = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 0 + ")") {
        $('#chartContainer').css('display', 'none');
        $('.hourly-weather').attr('style','display:none');
        overlay.style.background = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 0.8 + ")";
        bg_img.style.opacity = 0.05;
        search_box.style.display = "block";
    }

}