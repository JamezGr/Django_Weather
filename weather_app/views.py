from django.shortcuts import render
from .date_to_string_conversion import convert_date
from .weather_code_to_image import condition


import urllib.parse
import configparser
import json as json_
import requests

config = configparser.ConfigParser()
config_settings = config.read('config/config.ini')
developer_log_data = []


# Create your views here.
def index(request):
    api_key = config.get('SETUP', 'api_key')

    default_location = 'London, United Kingdom'
    default_location = urllib.parse.quote(default_location)

    search_location = request.POST.get('searchText')
    current_weather, current_log_data = WeatherForecast.get_current_weather(search_location, default_location, api_key)
    five_day_weather, five_day_log_data = WeatherForecast.get_five_day_weather(search_location, default_location, api_key)
    hourly_weather, hourly_log_data = WeatherForecast.get_hourly_weather(search_location, default_location, api_key)

    search_results, search_log_data = autocomplete(search_location, api_key)
    search_results = json_.dumps(search_results, sort_keys=True)

    if search_location:
        try:
            if search_results != "Unable to find any matching weather location to the query submitted!":
                updated_results = search_results.split('"')

                # return first result from search results
                updated_location = updated_results[3]
                current_weather, current_log_data = WeatherForecast.get_current_weather(search_location, updated_location, api_key)
                five_day_weather, five_day_log_data = WeatherForecast.get_five_day_weather(search_location, updated_location, api_key)
                hourly_weather, hourly_log_data = WeatherForecast.get_hourly_weather(search_location, updated_location, api_key)

        except IndexError:
            print(search_results)

    print(hourly_weather)

    # Update Developer Log if New REST Request is Made
    developer_log_data.append(str(current_log_data))
    developer_log_data.append(str(five_day_log_data))
    developer_log_data.append(str(hourly_log_data))
    developer_log_data.append("searchText: " + str(search_log_data) + str(search_location) + " 200 OK")

    geo_data = {'weather': current_weather, 'forecast': five_day_weather, 'search_results': search_results, 'hourly_weather': json_.dumps(hourly_weather),
                'developer_log': developer_log_data}

    return render(request, 'weather/main_weather.html', geo_data)


def autocomplete(location, api_key):
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

        log_data = ""

    except KeyError:
        search_results = json['data']['error'][0]['msg']

        search_status_code = str(weather_response.status_code)
        log_data = "searchText: No Results Found " + str(search_status_code) + " OK"

    return search_results, log_data


class WeatherForecast:
    def get_five_day_weather(self, location, api_key):

        current_day = 0
        five_day_weather = {}

        weather_response = requests.get(
            'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + api_key + '&q=' + location + '&num_of_days=5&isDayTime&tp=24&format=json')
        weather_json = weather_response.json()

        # DEBUGGING PURPOSES
        # print(weather_json)

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

        search_status_code = str(weather_response.status_code)

        log_data = "getFiveDayWeather: " + location + " " + str(search_status_code) + " OK"

        return five_day_weather, log_data

    def get_current_weather(self, location, api_key):

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
            "current_time": json['data']['current_condition'][0]['observation_time']
        }

        search_status_code = str(weather_response.status_code)

        log_data = "currentLocation: " + location + " " + str(search_status_code) + " OK"

        return current_weather, log_data

    def get_hourly_weather(self, location, api_key):
        location = urllib.parse.quote(str(location))

        current_day = 0
        current_hour = 0
        hourly_weather = {}

        weather_response = requests.get('http://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + api_key + '&q=' + location + '&num_of_days=5&isDayTime&format=json')
        weather_json = weather_response.json()

        while current_day < 5:
            hourly_weather[str(current_day)] = []

            while current_hour < 8:
                hourly_weather[str(current_day)].append(["Hour " + str(current_hour + 1),
                                                         condition(weather_json['data']['weather'][current_day]['hourly'][current_hour]['weatherCode']),    # Weather Condition
                                                         weather_json['data']['weather'][current_day]['hourly'][current_hour]['tempC'][0] + "°",            # Temperature for Selected Hour
                                                         weather_json['data']['weather'][current_day]['hourly'][current_hour]['chanceofrain'] + "%",        # Probability of Rain
                                                         weather_json['data']['weather'][current_day]['hourly'][current_hour]['precipMM'] + "MM",           # Precipitation
                                                         weather_json['data']['weather'][current_day]['hourly'][current_hour]['windspeedMiles'] + " MPH",   # Wind Speed MPH
                                                         weather_json['data']['weather'][current_day]['hourly'][current_hour]['humidity'] + "%"])           # Humidity

                current_hour += 1

            current_hour = 0
            current_day += 1

        search_status_code = str(weather_response.status_code)

        log_data = "getHourlyWeather: " + location + " " + str(search_status_code) + " OK"

        return hourly_weather, log_data