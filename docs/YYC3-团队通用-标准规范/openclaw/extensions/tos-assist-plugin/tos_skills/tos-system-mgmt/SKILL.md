---
name: "tos-system-mgmt"
description: "\"Execute TNAS system management operations including time/timezone settings, language switching, power on/off schedules, UPS configuration, disk sleep, scheduled tasks, SMTP mail server, security isolation mode, service/process management, SPC, system config restore/reset, factory reset, and developer mode. Use when user asks to modify TNAS system time or timezone, change interface/notification language, set power schedules, configure UPS, adjust disk sleep, create scheduled tasks, setup SMTP, toggle security isolation, stop services or processes, or mentions SPC/config restore/config reset/factory reset/developer mode on a TerraMaster NAS.\""
---


# TNAS System Management

Manage TerraMaster NAS (TNAS) system operations through TOS web API endpoints.

**Version:** 1.0.003

## Authentication

All TOS API endpoints require session cookies and CSRF token. When making API calls, include:

- **Cookie header**: `userName=<user>; TMSESSNAME=<sessionId>; X-Csrf-Token=<token>; tos_current_username=<user>; loginStatus=true`
- **X-Csrf-Token header**: Must match the token in Cookie

## Feature Routing

When a user request arrives, match it to exactly ONE feature below. Only execute steps for the matched feature. Do NOT execute steps for unrelated features.

## Features Overview

| # | Feature | Trigger Keywords | Status |
|---|---------|-----------------|--------|
| 1 | Time/Timezone | time, timezone, NTP, clock | Active |
| 2 | Language | language, interface lang, notification lang | Active |
| 3 | Power Schedule | power on/off, auto start/stop, schedule boot | Active |
| 4 | UPS | UPS, battery, uninterruptible power | Active |
| 5 | Disk Sleep | disk sleep, hibernate, standby, spin down | Active |
| 6 | Scheduled Tasks | cron, scheduled task, periodic script | Active |
| 7 | SMTP | SMTP, mail server, email notification | Active |
| 8 | Security Isolation | security isolation, firewall, isolation mode | Active |
| 9 | Service/Process | stop service, kill process, restart service | Active |
| 10 | SPC | SPC, storage pool config | **BLOCKED** |
| 11 | Config Restore | restore config, config backup | **BLOCKED** |
| 12 | Config Reset | reset config, default config | **BLOCKED** |
| 13 | Factory Reset | factory reset, initialize device | **BLOCKED** |
| 14 | Developer Mode | developer mode, SSH, root access | **BLOCKED** |

## Blocked Features (10-14)

These features are HIGH RISK and MUST NOT be executed. When triggered, return ONLY the corresponding warning message:

- **Feature 10 (SPC)**: "This operation modifies the storage pool's underlying configuration, posing serious risks such as data loss or storage pool degradation. To protect your data safety, do not execute via OpenClaw. Please go to TOS web interface [General Settings > Security > SPC] and perform manually."
- **Feature 11 (Config Restore)**: "This operation carries risks of configuration conflicts and service interruptions. To protect your system safety, do not execute via OpenClaw. Please go to TOS web interface [General Settings > System > Configuration] and perform manually."
- **Feature 12 (Config Reset)**: "This operation will clear all user-customized configurations, carrying risks of service interruptions. To protect your system safety, do not execute via OpenClaw. Please go to TOS web interface [General Settings > System > Configuration] and perform manually."
- **Feature 13 (Factory Reset)**: "This operation will erase all data and configurations on the device, posing extremely high risk. To protect your data and device safety, do not execute via OpenClaw. Please go to TOS web interface [General Settings > System > Factory Reset] and perform manually."
- **Feature 14 (Developer Mode)**: "This operation grants root-level system access, carrying risks of security vulnerabilities and system instability. To protect your device safety, do not execute via OpenClaw. Please go to TOS web interface [General Settings > System > Developer Mode] and perform manually."

## Active Features Execution Steps

For each active feature (1-9), follow the steps exactly. Do not skip or omit any step. Read the corresponding reference file for detailed API specifications before executing.

### Feature 1: Time/Timezone

Read [references/feature-01-time-timezone.md](references/feature-01-time-timezone.md) for API details.

1. GET `/timesetting/get` + GET `/desktop/init` → fetch current time/timezone config
2. Confirm target time/timezone with user (`now`, `capital`, `time_zone.*`)
3. POST `/timesetting/set` → apply time/timezone changes
4. GET `/timesetting/ntp?action=start` → restart NTP service
5. GET `/timesetting/get` → verify changes applied

**Output**: Success → `"Time/timezone modified successfully. Current time: [modified_time]"` | Failure → `"Step x failed."`

### Feature 2: Language

Read [references/feature-02-language.md](references/feature-02-language.md) for API details.

1. GET `/timesetting/getlang` → fetch current language config
2. Confirm target language with user (`tos_lang`, `notify_lang`)
3. POST `/timesetting/setlang` with `tos_lang` → set interface language
4. POST `/timesetting/setlang` with `notify_lang` → set notification language
5. GET `/timesetting/getlang` → verify changes applied

**Output**: Success → `"Interface and notification language modified successfully"` | Failure → `"Step x failed."`

### Feature 3: Power Schedule

Read [references/feature-03-power-schedule.md](references/feature-03-power-schedule.md) for API details.

1. GET `/power` → fetch current power schedule (`cron_power`)
2. Confirm schedule with user (time, days, on/off action)
3. Build schedule object: `{enabled, is_turn_on, days[], hour, min}` → append to `cron_power.schedules`
4. POST `/power/set` → apply schedule
5. GET `/power` → verify schedule active (`enabled=true`, schedules match)

**Output**: Success → `"Power schedule set successfully. Next execution: [next_schedule_time]"` | Failure → `"Step x failed."`

### Feature 4: UPS

Read [references/feature-04-ups.md](references/feature-04-ups.md) for API details.

1. GET `/ups/` → fetch UPS connection status and battery level
2. GET `/ups/` → fetch current UPS config
3. Confirm target settings with user (shutdown threshold, delay, type, etc.)
4. POST `/ups/set` → apply UPS configuration
5. GET `/ups/` → verify configuration applied

**Output**: Success → `"UPS configured successfully. Current battery level: [x%]"` | Failure → `"Step x failed."`

### Feature 5: Disk Sleep

Read [references/feature-05-disk-sleep.md](references/feature-05-disk-sleep.md) for API details.

1. GET `/hardware/disk` → fetch current disk sleep config
2. Confirm target sleep duration (`time` in Go Duration format, e.g. `"30m"`, `"1h"`) and disk scope (`general_conf`/`usb_conf`) with user
3. POST `/hardware/disk` → apply disk sleep config
4. GET `/hardware/disk` → verify configuration applied

**Output**: Success → `"Disk sleep policy set successfully. Auto-sleep after [x] minutes idle"` | Failure → `"Step x failed."`

### Feature 6: Scheduled Tasks

Read [references/feature-06-scheduled-tasks.md](references/feature-06-scheduled-tasks.md) for API details.

1. GET `/proxy/ScheduledTask` → fetch existing task list
2. Confirm task details with user (app_id, name, command, cycle, time, etc.)
3. POST `/proxy/ScheduledTask` → create task
4. GET `/proxy/ScheduledTask` → verify task registered and pending

**Output**: Success → `"Scheduled task set successfully. Next execution: [next_run_time]"` | Failure → `"Step x failed."`

### Feature 7: SMTP

Read [references/feature-07-smtp.md](references/feature-07-smtp.md) for API details.

1. GET `/smtp/GetSmtpConfig` → fetch current SMTP config
2. Confirm SMTP settings with user (server, port, user, pass, etc.)
3. POST `/smtp/SetSmtpConfig` → apply SMTP config
4. GET `/person/list/user` → get admin email, then POST `/smtp/SendEmail` → send test email

**Output**: Success → `"SMTP mail server configured successfully. Test email sent"` | Failure → `"Step x failed."`

### Feature 8: Security Isolation

Read [references/feature-08-security-isolation.md](references/feature-08-security-isolation.md) for API details.

1. GET `/security/absolute/status` → fetch current isolation status
2. Confirm enable/disable intent with user
3. POST `/security/absolute/set?enable=<true|false>` → apply setting
4. GET `/security/absolute/status` → verify status matches intent

**Output**: Success → `"Security isolation mode set successfully. Current status: [enabled/disabled]"` | Failure → `"Step x failed."`

### Feature 9: Service/Process

Read [references/feature-09-service-process.md](references/feature-09-service-process.md) for API details.

1. Query service/process status via WebSocket (topic: `"services"` for services, `"top"` for processes)
2. Confirm target: service name + action (`"stop"`/`"restart"`) OR process PID + action (`"stop"`)
3. Execute: POST `/system/servicesCtl` (for services) or POST `/system/processCtl` (for processes)
4. Verify via WebSocket that target stopped
5. Report current resource usage from WebSocket

**Output**: Success → `"[service/process_name] stopped successfully"` | Failure → `"Step x failed."`

## Error Handling

If any step fails, return `"Step x failed."` where x is the failed step number. Do not continue to subsequent steps.

## Constraints

- Each feature is INDEPENDENT — only execute the matched feature's steps
- Complete ALL steps for the triggered feature — no skipping
- Only return the specified output messages — no extra content
- Features 10-14 are BLOCKED — return only the warning text, no API calls