# Home Assistant Configuration

This repository contains the configuration for my Home Assistant instance.

> [!IMPORTANT]
> As Home Assistant evolves, more configuration is moving to the User Interface. Consequently, many entities and integrations are managed via the UI and may not be explicitly defined in these YAML files. This repository serves as a backup and documentation for the YAML-based portions of the setup.

## 🚀 Installation & Deployment

This is a [core installation](https://www.home-assistant.io/installation/linux#install-home-assistant-core) managed by SystemD via the [home-assistant.service](https://gitlab.archlinux.org/archlinux/packaging/packages/home-assistant/-/blob/main/home-assistant.service?ref_type=heads).

The active configuration resides in `/var/lib/hass` and is owned by the `hass` user. To synchronize this repository with the production environment, a `Makefile` is provided.

### Deployment Command
To deploy the configuration files:
```bash
sudo make install
```

This command executes an `rsync` operation (e.g., `rsync -auv --exclude-from='.rsyncignore' --chown=hass:hass ./* /var/lib/hass/`), ensuring that only necessary files are transferred and permissions are correctly set to `hass:hass`.

---

#### References
- [Awesome HA configuration index](https://www.awesome-ha.com/#public-configurations)
