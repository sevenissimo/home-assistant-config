# Home Assistant Configuration

My Home Assistant configuration.

> With the development of Home Assistant, the configuration is moving to the user interface. This configuration often refers to integrations and entities configured via the user interface.
>
> For this reason it may seems incomplete.

### Installation

Since my Home Assistant is a [core installation](https://www.home-assistant.io/installation/linux#install-home-assistant-core)
and SystemD manages the [home-assistant.service](https://gitlab.archlinux.org/archlinux/packaging/packages/home-assistant/-/blob/main/home-assistant.service?ref_type=heads),
my configuration resides in `/var/lib/hass` and owned by user `hass`.

A simple Makefile is provided. This meets my needs.

`sudo make install`

This issues an [rsync](https://man.archlinux.org/man/rsync.1) command like `rsync -auv --exclude-from='.rsyncignore' --chown=hass:hass ./* /var/lib/hass/` to "install" HA config files (and skip unecessary ones).

---
#### References
[Awesome HA configuration index](https://www.awesome-ha.com/#public-configurations)
