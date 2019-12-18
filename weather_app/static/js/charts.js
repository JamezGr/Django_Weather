window.onload = function ()
{
var hourly_results = JSON.parse(document.getElementById("hourly-results").innerText);
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


var temperature_one = hourly_results[0][2];
var temperature_two = hourly_results[0][9];
var temperature_three = hourly_results[0][16];
var temperature_four = hourly_results[0][23];
var temperature_five = hourly_results[0][30];
var temperature_six = hourly_results[0][37];
var temperature_seven = hourly_results[0][44];
var temperature_eight = hourly_results[0][51];

$("div.hour-one").html("22:00 <br> " + hourly_results[0][2]);
$("div.hour-two").html("01:00 <br> " + hourly_results[0][9]);
$("div.hour-three").html("04:00 <br> " + hourly_results[0][16]);
$("div.hour-four").html("07:00 <br> " + hourly_results[0][23]);
$("div.hour-five").html("10:00 <br> " + hourly_results[0][30]);
$("div.hour-six").html("13:00 <br> " + hourly_results[0][37]);
$("div.hour-seven").html("16:00 <br> " + hourly_results[0][44]);
$("div.hour-eight").html("19:00 <br> " + hourly_results[0][51]);


$("#updated-temperature").html(hourly_results[0][2]);
$("#updated-condition").html(hourly_results[0][1][2]);
$("div.precipitation").html(hourly_results[0][4]);
$("div.wind-text").html("<b>WIND</b> <br> <b>" + hourly_results[0][5]);
$("div.humidity").html(hourly_results[0][6]);
$("#rain-probability").html("Chance of Rain: " + hourly_results[0][3]);


$('.hour-weather').click(function(e){
    var selected_class = this.className.split(" ");
    var selected_hour = selected_class[1];

    console.log(selected_hour);

    if (this.className.toLowerCase().includes(selected_hour)) {
        $("#updated-temperature").html(hourly_results[0][updated_hour_stats[selected_hour]]);
        $("#updated-condition").html(hourly_results[0][updated_hour_stats[selected_hour] - 1][2]);
        $("div.precipitation").html(hourly_results[0][updated_hour_stats[selected_hour] + 2]);
        $("div.wind-text").html("<b>WIND</b> <br> <b>" + hourly_results[0][updated_hour_stats[selected_hour] + 3]);
        $("div.humidity").html(hourly_results[0][updated_hour_stats[selected_hour] + 4]);
        $("#rain-probability").html("Chance of Rain: " + hourly_results[0][updated_hour_stats[selected_hour] + 1]);
    }
});


temperature_one = temperature_one.substring(0, temperature_one.length - 1);
temperature_two = temperature_two.substring(0, temperature_two.length - 1);
temperature_three = temperature_three.substring(0, temperature_three.length - 1);
temperature_four = temperature_four.substring(0, temperature_four.length - 1);
temperature_five = temperature_five.substring(0, temperature_five.length - 1);
temperature_six = temperature_six.substring(0, temperature_six.length - 1);
temperature_seven = temperature_seven.substring(0, temperature_seven.length - 1);
temperature_eight = temperature_eight.substring(0, temperature_eight.length - 1);


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
			{ y: parseInt(temperature_one)},
			{ y: parseInt(temperature_two)},
			{ y: parseInt(temperature_three)},
			{ y: parseInt(temperature_four)},
			{ y: parseInt(temperature_five)},
			{ y: parseInt(temperature_six)},
			{ y: parseInt(temperature_seven)},
			{ y: parseInt(temperature_eight)}
		]
	}]
});
chart.render();

}