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
    default_location = 'London, United Kingdom'
    default_location = urllib.parse.quote(default_location)

    search_location = request.POST.get('searchText')
    current_weather, current_log_data = WeatherForecast.get_current_weather(search_location, default_location)
    five_day_weather, five_day_log_data = WeatherForecast.get_five_day_weather(search_location, default_location)
    hourly_weather, hourly_log_data = WeatherForecast.get_hourly_weather(search_location, default_location)

    search_results, search_log_data = autocomplete(search_location)
    search_results = json_.dumps(search_results, sort_keys=True)

    if search_location:
        try:
            if search_results != "Unable to find any matching weather location to the query submitted!":
                updated_results = search_results.split('"')

                # return first result from search results
                updated_location = updated_results[3]
                current_weather, current_log_data = WeatherForecast.get_current_weather(search_location, updated_location)
                five_day_weather, five_day_log_data = WeatherForecast.get_five_day_weather(search_location, updated_location)
                hourly_weather, hourly_log_data = WeatherForecast.get_hourly_weather(search_location, updated_location)

        except IndexError:
            print(search_results)

    print(search_results)

    developer_log_data.append(current_log_data)
    developer_log_data.append(five_day_log_data)
    developer_log_data.append(hourly_log_data)
    developer_log_data.append("searchText: " + search_log_data + search_location + " 200 OK")

    print(developer_log_data)

    geo_data = {'weather': current_weather, 'forecast': five_day_weather, 'search_results': search_results, 'hourly_weather': json_.dumps(hourly_weather),
                'developer_log': developer_log_data}

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

        log_data = ""

    except KeyError:
        search_results = json['data']['error'][0]['msg']

        search_status_code = str(weather_response.status_code)
        log_data = "searchText: No Results Found " + str(search_status_code) + " OK"

    return search_results, log_data


class WeatherForecast:
    def get_five_day_weather(self, location):
        api_key = config.get('SETUP', 'api_key')

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
            "current_time": json['data']['current_condition'][0]['observation_time']
        }

        search_status_code = str(weather_response.status_code)

        log_data = "currentLocation: " + location + " " + str(search_status_code) + " OK"

        return current_weather, log_data

    def get_hourly_weather(self, location):
        api_key = config.get('SETUP', 'api_key')
        location = urllib.parse.quote(str(location))

        current_day = 0
        hourly_weather = {}

        weather_response = requests.get('http://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + api_key + '&q=' + location + '&num_of_days=5&isDayTime&format=json')
        weather_json = weather_response.json()

        while current_day < 5:
            hourly_weather[str(current_day)] = [
                "Hour 1",
                condition(weather_json['data']['weather'][current_day]['hourly'][0]['weatherCode']),   # Weather Code
                weather_json['data']['weather'][current_day]['hourly'][0]['tempC'][0] + "°",           # Temperature
                weather_json['data']['weather'][current_day]['hourly'][0]['chanceofrain'] + "%",       # Rain Probability
                weather_json['data']['weather'][current_day]['hourly'][0]['precipMM'] + "MM",          # Precipitation MM
                weather_json['data']['weather'][current_day]['hourly'][0]['windspeedMiles'] + " MPH",  # Wind Speed mph
                weather_json['data']['weather'][current_day]['hourly'][0]['humidity'] + "%",           # Humidity

                "Hour 2",
                condition(weather_json['data']['weather'][current_day]['hourly'][1]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][1]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][1]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][1]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][1]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][1]['humidity'] + "%",

                "Hour 3",
                condition(weather_json['data']['weather'][current_day]['hourly'][2]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][2]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][2]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][2]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][2]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][2]['humidity'] + "%",

                "Hour 4",
                condition(weather_json['data']['weather'][current_day]['hourly'][3]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][3]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][3]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][3]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][3]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][3]['humidity'] + "%",

                "Hour 5",
                condition(weather_json['data']['weather'][current_day]['hourly'][4]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][4]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][4]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][4]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][4]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][4]['humidity'] + "%",

                "Hour 6",
                condition(weather_json['data']['weather'][current_day]['hourly'][5]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][5]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][5]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][5]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][5]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][5]['humidity'] + "%",

                "Hour 7",
                condition(weather_json['data']['weather'][current_day]['hourly'][6]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][6]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][6]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][6]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][6]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][6]['humidity'] + "%",

                "Hour 8",
                condition(weather_json['data']['weather'][current_day]['hourly'][7]['weatherCode']),
                weather_json['data']['weather'][current_day]['hourly'][7]['tempC'][0] + "°",
                weather_json['data']['weather'][current_day]['hourly'][7]['chanceofrain'] + "%",
                weather_json['data']['weather'][current_day]['hourly'][7]['precipMM'] + "MM",
                weather_json['data']['weather'][current_day]['hourly'][7]['windspeedMiles'] + " MPH",
                weather_json['data']['weather'][current_day]['hourly'][7]['humidity'] + "%"

            ]

            current_day += 1

        search_status_code = str(weather_response.status_code)

        log_data = "getHourlyWeather: " + location + " " + str(search_status_code) + " OK"

        return hourly_weather, log_data

    def update_log(self, data):

        developer_log = list([])
        developer_log.append('<div class="log-info"> <b>POST </b> / HTTP 1.1 ' + data + '</div>')

        return developer_log



