from django.shortcuts import render
from django.http import HttpResponse
from .date_to_string_conversion import convert_date

import requests
import urllib.parse
import configparser

config = configparser.ConfigParser()
config_settings = config.read('config/config.ini')


# Create your views here.
def index(request):
    api_key = config.get('SETUP', 'api_key')
    location = 'London, United Kingdom'
    location = urllib.parse.quote(location)

    weather_response = requests.get(
        'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + api_key + '&q=' + location + '&num_of_days=5&isDayTime&tp=24&format=json')
    json = weather_response.json()

    current_weather = {
        "location": json['data']['request'][0]['query'],
        "current_temp": json['data']['current_condition'][0]['temp_C'],
        "humidity": json['data']['current_condition'][0]['humidity'],
        "image": json['data']['current_condition'][0]['weatherIconUrl'][0]['value'],
        "condition": json['data']['current_condition'][0]['weatherDesc'][0]['value'],
        "wind_speed_mph": json['data']['current_condition'][0]['windspeedMiles'],
        "precipitation": json['data']['current_condition'][0]['precipMM'],
    }

    five_day_weather = WeatherForecast.get_five_day_weather(location, json)

    # DEBUGGING PURPOSES ONLY::
    print(current_weather)
    print()
    print(five_day_weather)

    geo_data = {'weather': current_weather, 'forecast': five_day_weather}

    return render(request, 'weather/main_weather.html', geo_data)


class WeatherForecast:
    def get_five_day_weather(self, weather_json):

        current_day = 0
        five_day_weather = {}

        # TODO: include Weather Condition for Each Day
        while current_day < 5:
            five_day_weather['day_' + str(current_day)] = [
                convert_date(weather_json['data']['weather'][current_day]['date']),
                weather_json['data']['weather'][current_day]['astronomy'][0]['sunrise'],
                weather_json['data']['weather'][current_day]['astronomy'][0]['sunset'],
                weather_json['data']['weather'][current_day]['astronomy'][0]['moonrise'],
                weather_json['data']['weather'][current_day]['astronomy'][0]['moonset'],
                weather_json['data']['weather'][current_day]['astronomy'][0]['moon_phase'],
                weather_json['data']['weather'][current_day]['maxtempC'],
                weather_json['data']['weather'][current_day]['mintempC'],
                weather_json['data']['weather'][current_day]['hourly'][0]['weatherDesc'][0]['value'],
                weather_json['data']['weather'][current_day]['hourly'][0]['weatherCode']
            ]

            current_day += 1

        return five_day_weather


# TODO: Complete
# class HourForecast:
