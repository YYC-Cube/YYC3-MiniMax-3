# Feature 6: Scheduled Tasks

## Trigger Conditions

- Create a scheduled task
- Set up periodic script execution
- Configure a cron-like scheduled task

## Step 1: Get Task List

### GET /proxy/ScheduledTask

**Headers**: Content-Type: application/json (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "system_schedule": {},
    "task_app_list": []
  },
  "code_num": 0
}
```

## Step 2: Confirm Task Details

Ask user for:
- `app_id`: Application ID (required, must ask user)
- `name`: Task name (1-64 chars, required)
- `command`: Command line to execute (required)
- `is_daemon`: Daemon task? (default: false)
- `enable`: Enable task? (default: false)
- `translation.section`: Translation section name (required)
- `translation.key`: Translation key (required)
- `timer_task_param`: Schedule configuration (see below)

### Timer Task Parameters

| Field | Type | Description |
|-------|------|-------------|
| `cycle_type` | string | `Disabled`, `EveryMonth`, `EveryDay`, `WorkingDay`, `WeeksRange` |
| `cycle_weeks_range` | string | Days for WeeksRange: 0-6, comma-separated (0=Sun) |
| `cycle_date` | string | Dates for EveryMonth: 1-31, comma-separated |
| `schedule_time` | string | Date for Disabled: format `2021-08-24` |
| `frequency_type` | string | `Disabled`, `Second`, `Minute`, `Hour` |
| `frequency_value` | int | 1-59 (Second/Minute) or 1-23 (Hour) |
| `hour` | int | Hour 0-23 |
| `minute` | int | Minute 0-59 |

## Step 3: Create Task

### POST /proxy/ScheduledTask

**Headers**: Content-Type: application/json (required)

**Request Body**:
```json
{
  "app_id": "string (required)",
  "task_basic_info": {
    "name": "string (required, 1-64 chars)",
    "command": "string (required)",
    "is_daemon": false,
    "enable": true,
    "translation": {
      "section": "string (required)",
      "key": "string (required)"
    },
    "timer_task_param": {
      "cycle_type": "EveryDay",
      "hour": 3,
      "minute": 0
    }
  }
}
```

**Response** (on success):
```json
{
  "code": true,
  "data": { "id": 12345 },
  "code_num": 0
}
```

## Step 4: Verify Task Created

Call GET `/proxy/ScheduledTask` again. Confirm the new task appears in `task_app_list` and is enabled.
