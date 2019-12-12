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

    console.log("Sunrise Time: " + sunrise_hour + ':' + sunrise_minute);
    console.log("Sunset Time: " + sunset_hour + ':' + sunset_minute);
    console.log(search_results);


     $("#search-box-text").click(function(){
        $(".dropdown-content").hide();
     });

     $("#search-text").keyup(function(){
        console.log($("#search-text").val());
     });

    $('#search-results-text').on('submit', function(event){

        console.log($("#search-text").val());
        $("search-text").serialize()

    });


});


    const searchBox = () => {

    // Black Transparent Overlay OnClick of Change Location
    var overlay = document.getElementById("weather-overlay");
    var bg_img = document.getElementById("current_weather_box");
    var search_box = document.getElementById("search-box");


    if (overlay.style.background = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 0 + ")") {
        overlay.style.background = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 0.8 + ")";
        bg_img.style.opacity = 0.05;
        search_box.style.display = "block";

    }

}

