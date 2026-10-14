# Filesystem Snapshot API Reference

## Overview

All endpoints start with `{NAS_BASE_URL}/v2`.

BTRFS snapshots support point-in-time filesystem copies.

---

## GET /v2/snapShoot/GetBtrfsVolume

Get all BTRFS volumes.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": ["/Volume1"],
  "code_num": 0
}
```

---

## GET /v2/snapShoot/GetSnapShootConf

Get snapshot configuration.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "status": true,
    "dir_name": "snapshot",
    "max_quantity": 30,
    "strategy": 1,
    "timed_task": {
      "cycle_type": "EveryDay",
      "hour": 2,
      "minute": 0,
      "frequency_type": "Disabled"
    },
    "task_id": 1
  },
  "code_num": 0
}
```

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | boolean | Enable snapshot feature |
| `max_quantity` | int | Max snapshots (**valid range: 1-1024**, validate before API call) |
| `strategy` | int | 1=Delete oldest, 2=Stop creating |
| `timed_task` | object | Schedule configuration |

**Validation Rule:** `max_quantity` must be between 1 and 1024. Values outside this range will cause API error. Always validate user input before calling the API.

---

## POST /v2/snapShoot/SetSnapShootConf

Set snapshot configuration.

**Additional Header:**
- `X-Security-Code`: Security verification code

**Request Body:**
```json
{
  "status": true,
  "max_quantity": 30,
  "strategy": 1,
  "timed_task": {
    "cycle_type": "EveryDay",
    "hour": 2,
    "minute": 0,
    "frequency_type": "Disabled"
  }
}
```

### Schedule Examples

**Daily at 2 AM:**
```json
{
  "cycle_type": "EveryDay",
  "hour": 2,
  "minute": 0,
  "frequency_type": "Disabled"
}
```

**Hourly:**
```json
{
  "cycle_type": "EveryDay",
  "frequency_type": "Hour",
  "frequency_value": 1
}
```

**Mon/Wed/Fri at 2 AM:**
```json
{
  "cycle_type": "WeeksRange",
  "cycle_weeks_range": "1,3,5",
  "hour": 2,
  "minute": 0
}
```

**Monthly on 1st and 15th:**
```json
{
  "cycle_type": "EveryMonth",
  "cycle_date": "1,15",
  "hour": 0,
  "minute": 0
}
```

---

## GET /v2/snapShoot/GetVolumeSnapShoot

Get snapshot list for a volume.

**Query Parameters:**
- `volume` (required): Volume path like "/Volume1"
- `task_name` (optional): Filter by task name

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "path": "/Volume1/.snapshot/snap_20260430_020001",
      "name": "snap_20260430_020001",
      "time": "2026-04-30 02:00:01",
      "lock": false,
      "status": 5,
      "msg": ""
    }
  ],
  "code_num": 0
}
```

### Snapshot Status Codes

| Code | Meaning |
|------|---------|
| 0 | Not running |
| 1 | Restoring |
| 2 | Restore success |
| 3 | Restore failed |
| 4 | Snapshot running |
| 5 | Snapshot success |
| 6 | Snapshot failed |
| 7 | Deleting |

---

## POST /v2/snapShoot/TakeSnapshot

Manually create snapshot.

**Additional Header:**
- `X-Security-Code`: Security verification code

**Request Body:**
```json
{
  "volume": "/Volume1"
}
```

---

## DELETE /v2/snapShoot/DelSnapShot

Delete specific snapshots.

**Request Body:**
```json
{
  "paths": [
    "/Volume1/.snapshot/snap_20260428_020001",
    "/Volume1/.snapshot/snap_20260427_020001"
  ]
}
```

---

## DELETE /v2/snapShoot/DelAllSnapShot

Delete all snapshots for a volume.

**Query Parameters:**
- `volume` (required): Volume path
- `taskName` (optional): Task name filter

---

## POST /v2/snapShoot/LockSnapShot

Lock or unlock snapshot.

**Additional Header:**
- `X-Security-Code`: Security verification code

**Request Body:**
```json
{
  "path": "/Volume1/.snapshot/snap_20260430_020001",
  "lock": true
}
```

| `lock` value | Action |
|--------------|--------|
| `true` | Lock snapshot (prevent deletion) |
| `false` | Unlock snapshot |