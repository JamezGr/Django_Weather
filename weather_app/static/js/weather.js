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
    var sunrise_hour = sunrise_time.slice(0,2);
    var sunrise_minute = sunrise_time.slice(3,5);

    var sunset = document.getElementsByClassName("sunset-icon");
    var sunset_time = sunset[0]['lastElementChild']['innerText'];
    var sunset_hour = sunset_time.slice(0,2);
    var sunset_minute = sunset_time.slice(3,5);


    if (today.getHours() >= 18 || today.getHours < sunrise_hour) {
        if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_rain_background.gif)";
        }
        else if (condition_text.toLowerCase().includes("thunder")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/thunder_background.png)";
        }
        else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_snow_background.png)";
        }
        else {
            document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/night_background.jpg)";
        }
    }

    if (today.getHours() == sunrise_hour && today.getMinutes() <= sunrise_minute) {
        document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/sunrise_background.png)";
    }

    // If the Current Time is Past Sunrise
    else if (today.getHours() >= sunrise_hour && today.getMinutes > sunrise_minute) {

        if (today.getHours() < sunset_hour) {
            if (condition_text.toLowerCase().includes("rain") || condition_text.toLowerCase().includes("drizzle")) {
                document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_rain_background.png)";
            }
             else if (condition_text.toLowerCase().includes("thunder")) {
                document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/thunder_background.png)";
            }
            else if (condition_text.toLowerCase().includes("snow") || condition_text.toLowerCase().includes("sleet") || condition_text.toLowerCase().includes("blizzard")) {
                document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_snow_background.png)";
            }
            else {
                document.getElementById('current_weather_box').style.backgroundImage="url(static/css/img/Background/day_background.jpg)";
            }
        }
    }

    console.log("Condition: " + condition_text);
    console.log(window.getComputedStyle(bg_img).backgroundImage);
    console.log("Hour: " + today.getHours());
    console.log(sunrise_hour + ':' + sunrise_minute);
    console.log(sunset_hour + ':' + sunset_minute);

    })