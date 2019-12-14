from django.shortcuts import render
from django.http import HttpResponse
from .date_to_string_conversion import convert_date
from .weather_code_to_image import condition
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.core import serializers


import requests
import urllib.parse
import configparser
import json as json_
import requests

config = configparser.ConfigParser()
config_settings = config.read('config/config.ini')


# Create your views here.
def index(request):
    csrf_token = get_token(request)

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

    location = request.POST.get('searchText')
    search_results = autocomplete(location)
    search_results = json_.dumps(search_results, sort_keys=True)

    # DEBUGGING PURPOSES ONLY::
    # print(current_weather)
    # print()
    # print(five_day_weather)
    # print()

    if request.is_ajax():
        print("Yes, AJAX!")
        print(search_results + "\n")
        print(requests.post("http://127.0.0.1:8000", search_results))

    geo_data = {'weather': current_weather, 'forecast': five_day_weather, 'search_results': search_results}

    return render(request, 'weather/main_weather.html', geo_data)


def autocomplete(location):
    api_key = config.get('SETUP', 'api_key')
    location = urllib.parse.quote(str(location))

    weather_response = requests.get(
        'http://api.worldweatheronline.com/premium/v1/search.ashx?query=' + location + "&num_of_results=3&format=json&key=" + api_key)
    json = weather_response.json()

    try:
        current_result = 0
        results_found = len(json['search_api']['result'])
        search_results = {}

        while current_result < results_found:
            search_results[current_result] = [
                json['search_api']['result'][current_result]['areaName'][0]['value'] + ", " +
                json['search_api']['result'][current_result]['country'][0]['value']
            ]
            current_result += 1

    except KeyError:
        search_results = json['data']['error'][0]['msg']

    return search_results


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
                'img/Weather_Icons/' + weather_json['data']['weather'][current_day]['astronomy'][0]['moon_phase']+'.svg',
                weather_json['data']['weather'][current_day]['maxtempC'],
                weather_json['data']['weather'][current_day]['mintempC'],
                weather_json['data']['weather'][current_day]['hourly'][0]['weatherDesc'][0]['value'],
                condition(weather_json['data']['weather'][current_day]['hourly'][0]['weatherCode'])
            ]

            current_day += 1

        return five_day_weather


# TODO: Complete Hourly Forecast
# class HourForecast:

# TODO: Complete Autocomplete For Search Box
class AutoComplete:
    def get_search_results(self):
        api_key = config.get('SETUP', 'api_key')

        # LOCATION USED FOR TESTING PURPOSES
        location = 'BS16'
        location = urllib.parse.quote(location)

        weather_response = requests.get('http://api.worldweatheronline.com/premium/v1/search.ashx?query=' + location + "&num_of_results=3&format=json&key=" + api_key)
        json = weather_response.json()

        current_result = 0
        results_found = len(json['search_api']['result'])
        search_results = {}

        while current_result < results_found:
            search_results['result_' + str(current_result)] = [
                json['search_api']['result'][current_result]['areaName'][0]['value'] + ", " +
                json['search_api']['result'][current_result]['country'][0]['value']
            ]

            current_result += 1

        return search_results
