# Home Assistant Installation & Recovery Guide

This document describes the procedure for a fresh installation, updating, or fixing the Home Assistant environment following system updates.

## 🛠 Standard Recovery / Installation Procedure

Follow these steps to ensure a clean and correctly permissioned environment.

### 1. Clean Up
If a previous environment exists and needs to be reset:

> [!CAUTION]
> The following command deletes the existing virtual environment.
> `sudo rm -rf /var/lib/hass/.uv`

### 2. Environment Setup
Navigate to the Home Assistant directory:
```bash
cd /var/lib/hass/
```

> [!IMPORTANT]
> You **must** assume the identity of the `hass` user. This is fundamental to ensure that the virtual environment is created with the correct ownership and that installation scripts are correctly generated.
> ```bash
> sudo -u hass -s
> ```

### 3. Virtual Environment Creation
Create a new virtual environment using `uv`:

> [!INFORMATION]
> If this command is executed as `root` instead of the `hass` user, the installation will be incomplete (e.g., the `bin/activate` script will be missing).
> ```bash
> uv venv .uv
> ```

### 4. Installation
Activate the environment and install Home Assistant:

```bash
source .uv/bin/activate
uv pip install homeassistant
```

### 5. Finalize
Exit the virtual environment and the `hass` user session:
```bash
deactivate
exit
```

---

## 🔍 Troubleshooting

### Missing Dependencies
If the logs indicate that certain packages are missing (transitive dependencies of HA), repeat the procedure up to the activation step and install the specific package manually:

```bash
# After switching to hass user and activating venv:
uv pip install missing_package==0.1.0
```

### Permission Issues
If the virtual environment was accidentally created with incorrect ownership:

> [!CAUTION]
> Use this command only if ownership is incorrect.
> ```bash
> sudo chown -R hass: /var/lib/hass
> ```
