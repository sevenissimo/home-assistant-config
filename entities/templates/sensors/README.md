# [Template • Sensors](https://www.home-assistant.io/integrations/template/#sensor)

Template sensors are now configured via the Home Assistant UI. The templates documented here serve as the reference for those configurations.

## Sun-Related Sensors

### sensor.sunrise_time
Calculates today's sunrise time, regardless of whether the sun is currently above the horizon.
```yaml
{{ iif(is_state('sun.sun', 'above_horizon'),
       states.sun.sun.last_changed,
       state_attr('sun.sun', 'next_rising')) | default('unavailable') }}
```

### sensor.sunset_time
Calculates today's sunset time, regardless of whether the sun has already set.
```yaml
{{ iif(is_state('sun.sun', 'above_horizon'),
       state_attr('sun.sun', 'next_setting'),
       states.sun.sun.last_changed) | default('unavailable') }}
```
