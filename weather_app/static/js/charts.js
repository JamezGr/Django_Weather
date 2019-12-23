window.onload = function ()
{

var hourly_results = JSON.parse($("#hourly-results").text());

var temperature_one = hourly_results[0][2];
var temperature_two = hourly_results[0][9];
var temperature_three = hourly_results[0][16];
var temperature_four = hourly_results[0][23];
var temperature_five = hourly_results[0][30];
var temperature_six = hourly_results[0][37];
var temperature_seven = hourly_results[0][44];
var temperature_eight = hourly_results[0][51];


temperature_one = temperature_one.substring(0, temperature_one.length - 1);
temperature_two = temperature_two.substring(0, temperature_two.length - 1);
temperature_three = temperature_three.substring(0, temperature_three.length - 1);
temperature_four = temperature_four.substring(0, temperature_four.length - 1);
temperature_five = temperature_five.substring(0, temperature_five.length - 1);
temperature_six = temperature_six.substring(0, temperature_six.length - 1);
temperature_seven = temperature_seven.substring(0, temperature_seven.length - 1);
temperature_eight = temperature_eight.substring(0, temperature_eight.length - 1);


console.log(hourly_results)

// Settings To Retrieve Hourly Information Based on Index Of JSON
updated_hour_stats = {

    "hour-one": 2,
    "hour-two": 9,
    "hour-three": 16,
    "hour-four": 23,
    "hour-five": 30,
    "hour-six": 37,
    "hour-seven": 44,
    "hour-eight": 51,

}

// Settings To Retrieve Daily Information Based on Index Of JSON
day_stats = {

    "day_1": 0,
    "day_2": 1,
    "day_3": 2,
    "day_4": 3,
    "day_5": 4

}


createChart(temperature_one, temperature_two, temperature_three, temperature_four,temperature_five, temperature_six,
            temperature_seven, temperature_eight);

weatherUpdate(day_stats["day_1"])


$("#updated-temperature").html(hourly_results[0][2]);
$("#updated-condition").html(hourly_results[0][1][2]);
$(".precipitation").html("<b>" + hourly_results[0][4] + "</b>") ;
$(".wind-updated").html("<b>" + hourly_results[0][5] + "</b>");
$(".humidity").html("<b>" + hourly_results[0][6] + "</b>");
$("#rain-probability").html("Chance of Rain: " + hourly_results[0][3]);


$('.col-sm').click(function(e){

    var selected_class = this.className.split(" ");
    var selected_day = selected_class[0];
    var updated_day = day_stats[selected_day];

    $('.current-location').css('display', 'none');
    $('.col-sm').css('background-color', 'transparent');
    $('.col-sm').css('box-shadow', 'inset 0 0 0 0px black');

    $('#weather-overlay').css('background', 'rgba(0, 0, 0, 0) none repeat scroll 0% 0%');
    $('#search-box').css('display', 'none');
    $('#developer-log').css('display', 'none');
    $('#current_weather_box').css('opacity', 1);
    $('.current-location-text').css('opacity', 1);
    $('.change_location').css('opacity', 1);

    $('.date_text').css('box-shadow', 'inset 0 0 0 0px black');
    $('.date_text').css('background-color', 'transparent');

    $('.' + selected_day).css('box-shadow', 'inset 0 0 0 3px #e7e7e7');
    $('.' + selected_day).css('background-color', '#f3f3f3');
    $('.date_text').css('box-shadow', 'inset 0 0 0 0px black');

    var hour_one = hourly_results[updated_day][2];
    var hour_two = hourly_results[updated_day][9];
    var hour_three = hourly_results[updated_day][16];
    var hour_four = hourly_results[updated_day][23];
    var hour_five = hourly_results[updated_day][30];
    var hour_six = hourly_results[updated_day][37];
    var hour_seven = hourly_results[updated_day][44];
    var hour_eight = hourly_results[updated_day][51];

    hour_one = hour_one.substring(0, hour_one.length - 1);
    hour_two = hour_two.substring(0, hour_two.length - 1);
    hour_three = hour_three.substring(0, hour_three.length - 1);
    hour_four = hour_four.substring(0, hour_four.length - 1);
    hour_five = hour_five.substring(0, hour_five.length - 1);
    hour_six = hour_six.substring(0, hour_six.length - 1);
    hour_seven = hour_seven.substring(0, hour_seven.length - 1);
    hour_eight = hour_eight.substring(0, hour_eight.length - 1);


    $('.hourly-weather').attr('style','display:block');
    $('#chartContainer').attr('style','display:block');
    createChart(hour_one, hour_two, hour_three, hour_four, hour_five, hour_six, hour_seven, hour_eight);
    $('.current-weather-row ').attr('style','display:none');

    console.log(selected_day);
    hourUpdate(updated_day);
    weatherUpdate(updated_day);

});


$("#return-weather").click(function(){

    $('.col-sm').css('background-color', 'transparent');
    $('.date_text').css('background-color', 'transparent');
    $('.hourly-weather').attr('style','display:none');
    $('.current-weather-row ').attr('style','display:flex');
    $('.col-sm').css('box-shadow', 'inset 0 0 0 0px black');
    $('.current-location').css('display', 'block');

});


function weatherUpdate(day) {

    $(".hour-one").html("22:00 <br> " + hourly_results[day][2]);
    $(".hour-two").html("01:00 <br> " + hourly_results[day][9]);
    $(".hour-three").html("04:00 <br> " + hourly_results[day][16]);
    $(".hour-four").html("07:00 <br> " + hourly_results[day][23]);
    $(".hour-five").html("10:00 <br> " + hourly_results[day][30]);
    $(".hour-six").html("13:00 <br> " + hourly_results[day][37]);
    $(".hour-seven").html("16:00 <br> " + hourly_results[day][44]);
    $(".hour-eight").html("19:00 <br> " + hourly_results[day][51]);

}


function hourUpdate(updated_day) {
    $('.hour-weather').click(function(e){
    var selected_class = this.className.split(" ");
    var selected_hour = selected_class[1];

    $('.hour-weather').css('color', '#ffffff ');
    $('.' + selected_hour).css('color', '#ffff00 ');

    console.log(selected_hour);
    console.log(updated_day);

    if (this.className.toLowerCase().includes(selected_hour)) {
        $("#updated-temperature").html(hourly_results[updated_day][updated_hour_stats[selected_hour]]);
        $("#updated-condition").html(hourly_results[updated_day][updated_hour_stats[selected_hour] - 1][2]);
        $(".precipitation").html("<b>" + hourly_results[updated_day][updated_hour_stats[selected_hour] + 2] + "</b>");
        $(".wind-updated").html(hourly_results[updated_day][updated_hour_stats[selected_hour] + 3]);
        $(".humidity").html("<b>" + hourly_results[updated_day][updated_hour_stats[selected_hour] + 4] + "</b>");
        $("#rain-probability").html("Chance of Rain: " + hourly_results[updated_day][updated_hour_stats[selected_hour] + 1]);
        }
    });
}


function createChart(hour_one, hour_two, hour_three, hour_four, hour_five, hour_six, hour_seven, hour_eight) {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "dark2",
        backgroundColor: "transparent",

        axisX: {

            gridColor: "none",
            labelFontColor: "none",
            tickColor: "none",
            lineColor: "transparent",
        },
        axisY: {
            gridColor: "none",
            lineColor: "transparent",
            labelFontColor: "none",
            tickColor: "none"
        },
        data: [{
            indexLabelFontColor: "white",
            indexLabelFontSize: 12,
            name: "views",
            color: "#fff5cc",
            lineColor: "#ffe786",
            type: "area",
            markerType: "none",
            yValueFormatString: "",
            dataPoints: [
                { y: parseInt(hour_one)},
                { y: parseInt(hour_two)},
                { y: parseInt(hour_three)},
                { y: parseInt(hour_four)},
                { y: parseInt(hour_five)},
                { y: parseInt(hour_six)},
                { y: parseInt(hour_seven)},
                { y: parseInt(hour_eight)}
            ]
        }]
    });
    chart.render();

};


}