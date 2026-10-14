# Rsync Backup API Reference

## Overview

All endpoints start with `{NAS_BASE_URL}/v2`.

Common headers:
- `Content-Type: application/json`
- `Cookie`: Session cookies (auto-maintained)
- `X-Csrf-Token`: CSRF token (auto-maintained)

---

## GET /v2/rsync/state

Get all rsync backup tasks.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "taskStatus": {
        "task_name": "backup-01",
        "status": "Stopped",
        "schedule": 0,
        "crontab": {
          "id": "backup-01",
          "handle_command": "/usr/sbin/rsyncClient -task 'backup-01'",
          "enabled": false,
          "cycle_type": "Disabled"
        }
      },
      "server": "10.18.8.83",
      "encrypt": false,
      "sourcePath": "/Volume1/Photo",
      "DestPath": "/backup/photos",
      "difference": false,
      "compression": false,
      "sparse": false,
      "network_monopolize": 0
    }
  ],
  "code_num": 0,
  "code_msg": "success"
}
```

---

## GET /v2/rsync/task/{task_name}

Get specific task details.

**Path Parameters:**
- `task_name` (string): Task name

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "task_name": "backup-01",
    "host": "10.18.8.83",
    "port": 873,
    "username": "backup",
    "source": "/Volume1/Photo",
    "dest": "/backup/photos",
    "difference": false,
    "compression": false,
    "mirroring": false,
    "sparse": false,
    "security": false,
    "network_monopolize": 0,
    "crontab": {
      "id": "backup-01",
      "handle_command": "/usr/sbin/rsyncClient -task 'backup-01'",
      "enabled": false,
      "cycle_type": "Disabled"
    }
  },
  "code_num": 0
}
```

---

## POST /v2/rsync/test

Test connection to remote rsync server.

**Request Body:**
```json
{
  "host": "10.18.8.83",
  "port": 873,
  "username": "backup",
  "password": "<RSA-encrypted>",
  "security": false
}
```

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": null,
  "code_num": 0
}
```

---

## POST /v2/rsync/create

Create or update rsync backup task.

**Additional Header:**
- `X-Security-Code`: Security verification code

**Request Body:**
```json
{
  "task_name": "backup-01",
  "host": "10.18.8.83",
  "port": 873,
  "username": "backup",
  "password": "<RSA-encrypted>",
  "source": "/Volume1/Photo",
  "dest": "/backup/photos",
  "difference": false,
  "compression": false,
  "mirroring": false,
  "sparse": false,
  "security": false,
  "network_monopolize": 0,
  "action": "stop",
  "crontab": {
    "id": "backup-01",
    "handle_command": "/usr/sbin/rsyncClient -task 'backup-01'",
    "enabled": true,
    "cycle_type": "EveryDay",
    "hour": 2,
    "minute": 0,
    "frequency_type": "Disabled"
  }
}
```

### Crontab Configuration

| Field | Values |
|-------|--------|
| `cycle_type` | `Disabled`, `EveryDay`, `EveryMonth`, `WorkingDay`, `WeeksRange` |
| `cycle_weeks_range` | "0,1,3,5" (0=Sun, 1-6=Mon-Sat) |
| `cycle_date` | "1,15,28" (day of month) |
| `frequency_type` | `Disabled`, `Second`, `Minute`, `Hour` |
| `frequency_value` | 1-59 (seconds/minutes) or 1-23 (hours) |
| `hour` | 0-23 |
| `minute` | 0-59 |
| `schedule_time` | "2026-04-30" (for Disabled cycle) |

---

## POST /v2/rsync/service

Start or stop task.

**Request Body:**
```json
{
  "task_name": "backup-01",
  "action": "immediately",
  "dest_path": "/backup/photos"
}
```

| Action | Description |
|--------|-------------|
| `immediately` | Start task now |
| `stop` | Stop running task |

---

## DELETE /v2/rsync/task/{task_name}

Delete rsync task.

**Path Parameters:**
- `task_name` (string): Task name to delete
