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
import re

config = configparser.ConfigParser()
config_settings = config.read('config/config.ini')


# Create your views here.
def index(request):
    default_location = 'London, United Kingdom'
    default_location = urllib.parse.quote(default_location)

    search_location = request.POST.get('searchText')
    current_weather = WeatherForecast.get_current_weather(search_location, default_location)
    five_day_weather = WeatherForecast.get_five_day_weather(search_location, default_location)

    search_results = autocomplete(search_location)
    search_results = json_.dumps(search_results, sort_keys=True)

    if search_location:
        try:
            if search_results != "Unable to find any matching weather location to the query submitted!":
                updated_results = search_results.split('"')

                # return first result from search results
                updated_location = updated_results[3]
                current_weather = WeatherForecast.get_current_weather(search_location, updated_location)
                five_day_weather = WeatherForecast.get_five_day_weather(search_location, updated_location)

        except IndexError:
            print(search_results)

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

        # isValid = False >>>> Return this Value

    return search_results


class WeatherForecast:
    def get_five_day_weather(self, location):
        api_key = config.get('SETUP', 'api_key')

        current_day = 0
        five_day_weather = {}

        weather_response = requests.get(
            'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + api_key + '&q=' + location + '&num_of_days=5&isDayTime&tp=24&format=json')
        weather_json = weather_response.json()

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

    def get_current_weather(self, location):
        api_key = config.get('SETUP', 'api_key')
        # location = 'London, United Kingdom'
        # location = urllib.parse.quote(location)

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

        return current_weather


# TODO: Complete Hourly Forecast

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
