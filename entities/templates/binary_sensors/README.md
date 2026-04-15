# [Template • Binary Sensors](https://www.home-assistant.io/integrations/template/#binary_sensor)

Template binary sensors are now configured via the Home Assistant UI. The templates documented here serve as the source of truth and reference for those UI configurations.

## General Groups

### binary_sensor.all_openings
Monitors if any doors, windows, or garage doors are open.
```yaml
{{ states.binary_sensor
   | selectattr('attributes.device_class','in', ['door', 'window', 'garage_door'])
   | selectattr('state', 'eq', 'on') | list | count > 0 }}
```

### binary_sensor.all_alarm_sensors
Monitors all security-related sensors (doors, windows, motion) to determine if the alarm should be triggered.
```yaml
{{ states.binary_sensor
   | selectattr('attributes.device_class','in', ['door', 'window', 'motion'])
   | selectattr('state', 'eq', 'on') | list | count > 0 }}
```

### binary_sensor.batteries_low <sup>BETA</sup>
A `problem` class sensor that aggregates all battery-powered devices into a single entity to simplify low-battery monitoring and alerting.
```yaml
{{ states.sensor
 | rejectattr('attributes.device_class', 'undefined')
 | selectattr('attributes.device_class', 'match', '^batter')
 | selectattr('state', 'match', '^[0-9][\.,$]') | list | count }}
```

### binary_sensor.home_empty_and_dirty
Determines if the house is empty and the vacuum bot has not run today, while ensuring the "Do Not Disturb" (DND) schedule is inactive.
```yaml
{{ is_state('zone.home', '0')
   and as_datetime(states('sensor.dreame_bot_task_completion_time')).day != now().day
   and is_state('schedule.dnd', 'off') }}
```
*Note: `sensor.dreame_bot_task_completion_time` is a trigger-based template sensor.*

## Weather-Related Sensors

### binary_sensor.weather_condition_ok
Classifies current weather conditions into "acceptable" or "unacceptable" categories to simplify integration with other automations.
```yaml
{{ states('weather.forecast_home') in ['clear-night', 'cloudy', 'fog', 'partlycloudy', 'sunny', 'windy', 'windy-variant'] }}
```

### binary_sensor.sun_risen_and_shining
A complex trigger for blind automations that combines sun elevation, weather conditions, outdoor temperature, and the DND schedule.
```yaml
{{ state_attr('sun.sun', 'elevation') | int(default=0) > 10
   and is_state('binary_sensor.weather_condition_ok', 'on')
   and is_state('binary_sensor.weather_temperature_ok', 'on')
   and is_state('schedule.dnd', 'off') }}
```

### binary_sensor.sun_blazing_and_shining
Used for blind automations to detect intense sunlight based on sun elevation, azimuth, weather conditions, and temperature.
```yaml
{{  state_attr('sun.sun', 'elevation') | int(default=0) > 10
    and state_attr('sun.sun', 'azimuth') | int(default=0) > 210
    and is_state('binary_sensor.weather_condition_ok', 'on')
    and is_state('binary_sensor.weather_temperature_ok', 'on') }}
```

### binary_sensor.inverter_zero_yield
Detects if the solar inverter is failing to produce energy despite the sun being above the horizon.
```yaml
{{  state_attr('sun.sun', 'elevation') | int(default=0) > 10 
    and is_state('sensor.inverter_rendimento_giornaliero', 0) }}
```

---
[1] Note: `binary_sensor.weather_temperature_ok` is a threshold sensor based on the template sensor `sensor.weather_temperature`, which extracts the `temperature` attribute from `weather.forecast_home`.
