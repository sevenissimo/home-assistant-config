# Home Assistant Configuration

This repository contains the configuration for my Home Assistant instance.

> [!IMPORTANT]
> As Home Assistant evolves, more configuration is moving to the User Interface. Consequently, many entities and integrations are managed via the UI and may not be explicitly defined in these YAML files. This repository serves as a backup and documentation for the YAML-based portions of the setup.

## 🚀 Installation & Deployment

This is a [core installation](https://www.home-assistant.io/installation/linux#install-home-assistant-core) managed by SystemD via the [home-assistant.service](https://gitlab.archlinux.org/archlinux/packaging/packages/home-assistant/-/blob/main/home-assistant.service?ref_type=heads).

The active configuration resides in `/var/lib/hass` and is owned by the `hass` user. To synchronize this repository with the production environment, a `Makefile` is provided.

### Git Setup
To configure Git filters for protecting sensitive information (secrets, device IDs):
```bash
make git-setup
```

### Previewing Changes
Before deploying, you can preview which files would be changed:
- To see a list of files that would be updated: `sudo make dry-run`
- To see the actual content diffs: `sudo make show-diff`

### Deployment Command
To deploy the configuration files:
```bash
sudo make install
```
This command uses `rsync` to synchronize files. It handles protected files (`automations.yaml`, `scenes.yaml`, `scripts.yaml`) carefully to avoid overwriting UI-managed changes in production while still updating other components.

---

#### References
- [Awesome HA configuration index](https://www.awesome-ha.com/#public-configurations)
