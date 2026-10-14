# Feature 3: Power Schedule

## Trigger Conditions

- Set TNAS timed power on/off
- Auto shutdown NAS every night
- Configure scheduled boot/shutdown plan

## Step 1: Get Current Power Config

### GET /power

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "wol_enabled": true,
    "powerset_enabled": true,
    "cron_power": {
      "enabled": true,
      "schedules": [
        {
          "enabled": true,
          "is_turn_on": false,
          "days": [1, 2, 3, 4, 5],
          "hour": 23,
          "min": 0
        }
      ]
    }
  },
  "code_num": 0
}
```

Key fields:
- `wol_enabled`: Wake-on-LAN toggle
- `powerset_enabled`: Auto power schedule toggle (non-free versions only)
- `cron_power.enabled`: Master switch for power schedules
- `cron_power.schedules[]`: Array of schedule entries

Schedule entry fields:
- `enabled`: Enable this schedule entry
- `is_turn_on`: true=power on, false=power off
- `days[]`: Execution days — 0=Sun, 1=Mon, ..., 6=Sat. MUST NOT be empty.
- `hour`: 0-23 (24h format)
- `min`: 0-59

## Step 2: Confirm Schedule with User

Record: time (hour/min), days of week, action (on/off).

## Step 3: Build Schedule Object

Append new entry to `cron_power.schedules`:
```json
{
  "enabled": true,
  "is_turn_on": true,
  "days": [1, 2, 3, 4, 5],
  "hour": 8,
  "min": 0
}
```

## Step 4: Apply Schedule

### POST /power/set

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "wol_enabled": true,
  "powerset_enabled": true,
  "cron_power": {
    "enabled": true,
    "schedules": [...]
  }
}
```

Note: When `schedules` array is empty, `enabled` is automatically set to false.

## Step 5: Verify Schedule

Call GET `/power` again. Confirm `cron_power.enabled=true` and `schedules` contains the new entry.
