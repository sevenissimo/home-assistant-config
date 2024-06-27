# Binary sensors (1)[https://www.home-assistant.io/integrations/binary_sensor/]

Most, if not all, of the binary sensors have been moved to the Home assistant UI

### binary_sensor.home_dirty_and_empty
```yaml
{{ is_state('zone.home', '0')
   and as_datetime(states('sensor.dreame_bot_task_completion_time')).day != now().day
   and is_state('schedule.dnd', 'off') }}
```
Note: `sensor.dreame_bot_task_completion_time` is a trigger based template sensor.

### binary_sensor.low_batteries <sup>BETA</sup>
This sensor attempts to combine all battery sensors into one to facilitate low battery monitoring and alerting.
```yaml
{{ states.sensor
 | rejectattr('attributes.device_class', 'undefined')
 | selectattr('attributes.device_class', 'match', '^batter')
 | selectattr('state', 'match', '^[0-9]$')
 | map(attribute='name') | list | count }}
```

## Weather related sensors

### binary_sensor.weather_condition_ok
This sensor attempts to classify and reduce possible weather conditions (dividing acceptable and unacceptable) and obtain a binary result that is easy to combine with other information.
```yaml
{{ states('weather.forecast_home') in ['clear-night', 'cloudy', 'fog', 'partlycloudy', 'sunny', 'windy', 'windy-variant'] }}
```

### binary_sensor.sun_risen_and_shining
This sensor combines sun position, weather conditions, outdoor temperature and DND scheduling.
This sensor is used as a trigger for the blinds automations.
```yaml
{{ state_attr('sun.sun', 'elevation') | int > 10
   and is_state('binary_sensor.weather_condition_ok', 'on')
   and is_state('binary_sensor.weather_temperature_ok', 'on')
   and is_state('schedule.dnd', 'off') }}
```

### binary_sensor.sun_blazing_and_shining
This sensor combines sun position, weather conditions and outdoor temperature.
This sensor is used as a trigger for the blinds automations.
```yaml
{{  state_attr('sun.sun', 'elevation') | int > 10
    and state_attr('sun.sun', 'azimuth') | int > 210
    and is_state('binary_sensor.weather_condition_ok', 'on')
    and is_state('binary_sensor.weather_temperature_ok', 'on') }}
```
