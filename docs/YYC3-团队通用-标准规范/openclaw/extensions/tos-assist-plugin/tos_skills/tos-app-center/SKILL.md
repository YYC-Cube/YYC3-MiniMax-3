---
name: tos-app-center
description: "TNAS App Center management, including app install, enable/disable, uninstall, and default install location settings. Use when user asks to install, enable/disable, uninstall apps on TerraMaster TOS, or change default app install location."

---

# TOS App Center

TNAS App Center management, including app install, enable/disable, uninstall, and default install location settings. v1.0.001

⚠️ Strictly execute only the triggered feature. Untriggered features must not participate. Each feature step must not be skipped or omitted.

## Feature 1: Install App

**Trigger Conditions** (semantically similar user input accepted):
- Install XX app / Install app XX (XX is the specific app name)

**Execution Steps** (must execute each step):

1. Find the target app in App Center, confirm compatibility with current system version → `GET /v2/app/list?refresh=` (see [references/api_install.md](references/api_install.md) endpoint 1)
   - Search for target app in `online_list`
   - Confirm app exists, verify `platform` matches current CPU architecture, verify `low_version` is compatible with current system version
   - **[CRITICAL] Immediately check `application_type` field**: If `docker`, output rule (4) and terminate, do not proceed
   - **[CRITICAL] If target app is Docker Manager (id=docker)**, check if Docker Engine (id=DockerEngine) is installed and enabled: if not installed, output rule (5) and terminate; if installed but not enabled, enable Docker Engine first

2. Download app installer, display available storage volumes for user to select install location → `GET /v2/storage/list/volume?type=brief` (see [references/api_install.md](references/api_install.md) endpoint 0)
   - Display format: "Available volumes: 1.Volume1 (XX GB free); 2.Volume2 (XX GB free), please select install location."
   - **Wait for user confirmation before proceeding**

3. Confirm selected volume has sufficient space, execute install and enable app → `POST /v2/app/install`, pass user-selected `install_path` (see [references/api_install.md](references/api_install.md) endpoint 2)
   - After install, call `PUT /v2/app/start/{id}` to enable app (SPC logic see output rule (6))

4. Verify enable status, return result → `GET /v2/app/list?refresh=` check `is_running` field (true=enabled, false=disabled)

**Output Rules** (output nothing else):
1. App not found: "Please verify the app name. If the name is correct and an installer is available, install manually via App Center."
2. System incompatible: "This app is not compatible with the current TNAS system and cannot be installed."
3. Insufficient space: "Selected volume has insufficient space, please choose another or free up space."
4. Docker app (application_type=docker): "This Docker app should be installed manually via App Center."
5. Install Docker Manager (no Docker Engine): "Please install Docker Engine first."
6. SPC not authorized (TOS SPC enabled): "Please authorize SPC and enter password to enable app"; after authorization: "App XX installed and enabled successfully"; not authorized: "App XX installed but not enabled"
7. Completed normally: "App XX installed and enabled successfully."
8. Step failed: "Step x failed."

## Feature 2: Enable/Disable App

**Trigger Conditions** (semantically similar user input accepted):
- Enable/disable XX app (XX is the specific app name)

**Execution Steps** (must execute each step):

1. Find target app in App Center, confirm current status → `GET /v2/app/list?refresh=` (see [references/api_enable_disable.md](references/api_enable_disable.md) endpoint 1)

2. Before enable/disable, check app is installed properly, verify SPC authorization (TOS SPC enabled) → confirm installation via `/v2/app/list?refresh=` `install` field, verify SPC via `/v2/app/activeSafetyList` (see [references/api_enable_disable.md](references/api_enable_disable.md) endpoint 2)

3. **Dependency check**:
   - **When enabling**: Docker apps (application_type=docker) must check if dependencies (id:docker and DockerEngine) are enabled; enable them together if not → check via `/v2/app/list?refresh=`
   - **When disabling**: If disabling Docker Engine (id=DockerEngine) or Docker Manager (id=docker), must find all dependent Docker apps (application_type=docker and is_running=true), disable them one by one, and list the apps being simultaneously disabled → filter via `/v2/app/list?refresh=` `install_list` for apps with `depend` containing DockerEngine and `is_running=true`, call `PUT /v2/app/stop/{id}` for each

4. Execute enable/disable operation, verify result and return → enable `PUT /v2/app/start/{id}`, disable `PUT /v2/app/stop/{id}` (see [references/api_enable_disable.md](references/api_enable_disable.md) endpoints 3, 4)

**Output Rules** (output nothing else):
1. App not found/not installed: "Please verify the app name or confirm it is installed."
2. Redundant operation: "App XX is already in the current state, no action needed."
3. App corrupted (enable): "App XX is corrupted, please reinstall before enabling."
4. SPC not authorized: "Please authorize SPC and enter password"; return result after authorization, not authorized: "Unable to execute operation." and return previous result
5. Docker app enable (dependencies not enabled): "Will enable dependencies and XX together", completed: "Dependencies and XX have been enabled."
6. Disable Docker Engine/Docker Manager (Docker apps running): "Disabling XX will simultaneously stop these Docker apps: 1.YY; 2.ZZ; ..., continue?" → after user confirmation, disable each and then disable XX, completed: "The following apps have been disabled: 1.YY; 2.ZZ; ..., XX has been disabled."
7. Disable Docker Engine/Docker Manager (no Docker apps running): disable directly, output normal disable rules.
8. Enable normally: "App XX has been enabled."
9. Disable normally: "App XX has been disabled."
10. Step failed: "Step x failed."

## Feature 3: Uninstall App

**Trigger Conditions** (semantically similar user input accepted):
- Uninstall XX app / Delete XX app (XX is the specific app name)

**Execution Steps** (must execute each step):

1. Find target app in App Center, confirm installed → `GET /v2/app/list?refresh=` verify installed via `install:1` (see [references/api_uninstall.md](references/api_uninstall.md) endpoint 1)

2. Confirm user intent to uninstall, whether to delete config files, and dependency check:
   - Ask user whether to delete config files (clean parameter)
   - **[CRITICAL] If uninstalling Docker Engine (id=DockerEngine) or Docker Manager (id=docker)**: must find all Docker apps (`application_type=docker`) with `depend` containing DockerEngine via `/v2/app/list?refresh=` `install_list`, list them all regardless of running status, confirm with user: "Uninstalling XX will simultaneously stop these associated apps: 1.YY; 2.ZZ; ..., are you sure?" → after user confirmation, stop each associated app (`PUT /v2/app/stop/{id}`) first, then proceed with uninstall; if user cancels, terminate
   - In `DELETE /v2/app/remove`, `clean: true` means delete config files (see [references/api_uninstall.md](references/api_uninstall.md) endpoint 2)

3. Disable app (verify SPC authorization, TOS SPC enabled) → `/v2/security/sad/state` check if SPC is enabled (see [references/api_enable_disable.md](references/api_enable_disable.md) endpoint 5), `/v2/app/activeSafetyList` check if app is SPC authorized (see [references/api_uninstall.md](references/api_uninstall.md) endpoint 3), `/v2/otp/verify_pwd` verify user password (see [references/api_enable_disable.md](references/api_enable_disable.md) endpoint 6), `/v2/app/setAppSecurity` confirm authorization (see [references/api_uninstall.md](references/api_uninstall.md) endpoint 4)

4. Complete uninstall and config file handling, verify result and return → `GET /v2/app/list?refresh=` confirm via `install`

**Output Rules** (output nothing else):
1. App not found/not installed: "Please verify the app name or confirm it is installed."
2. User cancelled: "Uninstall of app XX cancelled."
3. Uninstall Docker Engine/Docker Manager (associated Docker apps exist): "Uninstalling XX will simultaneously stop these associated apps: 1.YY; 2.ZZ; ..., are you sure?" → after user confirmation, stop associated apps then uninstall, completed: "The following associated apps have been stopped: 1.YY; 2.ZZ; ..., XX has been uninstalled, config files retained/deleted."
4. Uninstall Docker Engine/Docker Manager (no associated Docker apps): uninstall directly, output normal rules.
5. SPC not authorized: "Please authorize SPC and enter password"; continue after authorization, not authorized: "Unable to uninstall."
6. Config not deleted: "App XX has been uninstalled, config files retained."
7. Config deleted: "App XX has been uninstalled, config files also deleted."
8. Step failed: "Step x failed."

## Feature 4: App Center Settings

**Trigger Conditions** (semantically similar user input accepted):
- Set default install location / Change default app install volume

**Execution Steps** (must execute each step):

1. Query all storage volumes, filter available and mark status → `GET /v2/storage/list/volume?type=brief` (see [references/api_settings.md](references/api_settings.md) endpoint 0)

2. Display available volumes, get user selection → `GET /v2/app/setting` (see [references/api_settings.md](references/api_settings.md) endpoint 1)

3. Confirm selected volume is available, set as default install location → verify available volume via `/v2/storage/list/volume?type=brief`, set via `POST /v2/app/setting` (see [references/api_settings.md](references/api_settings.md) endpoint 2)

4. Verify setting result and return → `GET /v2/app/setting`

**Output Rules** (output nothing else):
1. No available volumes: "No available storage volumes, please check volume status."
2. Display volume info: "Available volumes: 1.XXX (XX free); 2.XXX (XX free, insufficient space), please select."
3. Selected volume unavailable: "Selected storage volume is unavailable, please choose again."
4. Set successfully: "Default install location has been set to volume XX."
5. Step failed: "Step x failed."

## Skill Constraints (IMPORTANT)

1. Each feature is independent. Only when a user instruction matches a feature's core description will that feature's full operations be executed.
2. Once a feature is triggered, follow the execution steps exactly without skipping or omitting any step, ensuring every step is fully executed.
3. Untriggered features must never participate in operations to avoid excessive token consumption.
4. Cross-feature inference or chaining is prohibited.
5. When no trigger condition is matched, no operation shall be executed.

