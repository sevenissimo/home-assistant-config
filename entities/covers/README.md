# [Template • Cover](https://www.home-assistant.io/integrations/template/#cover)

The legacy YAML platform for Template Covers is being deprecated. While it is still possible to use the modern template syntax for `tapparella_*` entities, Template Covers are now primarily configured directly through the Home Assistant UI.

The following example illustrates the logic used for a typical cover configuration, providing a reference for the UI settings:

```yaml
template:
- cover:
  - unique_id: 12e483c2-c75c-11ed-afa1-0242ac120002
    device_class: blind
    open_cover:
    - data:
        entity_id: cover.tapparella_bagno_curtain
        position: 0
      action: cover.set_cover_position
    close_cover:
    - data:
        entity_id: cover.tapparella_bagno_curtain
        position: 100
      action: cover.set_cover_position
    stop_cover:
    - entity_id:
      - cover.tapparella_bagno_curtain
      action: cover.stop_cover
    set_cover_position:
    - data:
        entity_id: cover.tapparella_bagno_curtain
        position: '{{ 100 - position }}'
      action: cover.set_cover_position
    default_entity_id: cover.tapparella_bagno
    position: '{{ 100 - state_attr(''cover.tapparella_bagno_curtain'', ''current_position'')
      | int(0) }}'
    name: tapparella_bagno
```
