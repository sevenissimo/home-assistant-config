# https://github.com/AlexxIT/XiaomiGateway3/wiki/Converters

from custom_components.xiaomi_gateway3.core.converters.devices import *

DEVICES = [{
  "TRADFRI ON/OFF switch": ["IKEA", "TRADFRI ON/OFF switch", "E1743"],
  "spec": [
    #IKEARemoteConv1("action", "sensor", bind=True),
    MapConv("action", map={ 1: "on", 2: "off", 3: "brightness_move_down", 4: "brightness_move_up", 5: "brightness_stop" }),
    Converter("battery", "sensor", enabled=None),
    Converter("linkquality", "sensor", enabled=None)
  ],
}] + DEVICES

# https://www.zigbee2mqtt.io/devices/E1743.html
# https://github.com/zigpy/zha-device-handlers/blob/6b9516dcf9b60326510caf223a80ec96a9d3b401/zhaquirks/ikea/twobtnremote.py#L141
