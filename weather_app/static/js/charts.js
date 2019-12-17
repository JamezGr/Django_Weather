window.onload = function ()

{

var temperature_one = $( "div.hour-one" ).text();
var temperature_two = $( "div.hour-two" ).text();
var temperature_three = $( "div.hour-three" ).text();
var temperature_four = $( "div.hour-four" ).text();
var temperature_five = $( "div.hour-five" ).text();
var temperature_six = $( "div.hour-six" ).text();
var temperature_seven = $( "div.hour-seven" ).text();
var temperature_eight = $( "div.hour-eight" ).text();


temperature_one = temperature_one.slice(5, 8);
temperature_two = temperature_two.slice(5, 8);
temperature_three = temperature_three.slice(5, 8);
temperature_four = temperature_four.slice(5, 8);
temperature_five = temperature_five.slice(5, 8);
temperature_six = temperature_six.slice(5, 8);
temperature_seven = temperature_seven.slice(5, 8);
temperature_eight = temperature_eight.slice(5, 8);


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