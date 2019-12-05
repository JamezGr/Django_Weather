import datetime


def convert_date(date):

    week_days = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")

    # Find Out Day of The Week

    date_string = date
    date_year = int(date_string[0:4])
    date_month = int(date_string[5:7])
    date_day = int(date_string[8:10])

    current_date = datetime.date(date_year, date_month, date_day)
    current_day = current_date.weekday()
    current_day_as_string = week_days[current_day]

    return current_day_as_string


convert_date('2019-12-10')
