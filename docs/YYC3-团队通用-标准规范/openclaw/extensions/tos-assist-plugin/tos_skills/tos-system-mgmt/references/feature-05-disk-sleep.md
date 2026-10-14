# Feature 5: Disk Sleep Configuration

## Trigger Conditions

- Set TNAS disk auto sleep time
- Make disks auto spin down after idle period
- Adjust disk sleep strategy

## Step 1: Get Current Disk Sleep Config

### GET /hardware/disk

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "general_conf": {
      "sleep_status": true,
      "time": "30m"
    },
    "usb_conf": {
      "sleep_status": false,
      "time": "10m"
    },
    "log_status": true,
    "wake_mode": 0
  },
  "code_num": 0
}
```

Key fields:
- `general_conf.sleep_status`: Enable sleep for internal disks
- `general_conf.time`: Sleep delay — Go time.Duration format (e.g. `"10m"`, `"30m"`, `"1h"`)
- `usb_conf.sleep_status`: Enable sleep for USB disks
- `usb_conf.time`: Sleep delay for USB disks
- `log_status`: Log disk sleep/wake events
- `wake_mode`: 0=wake on demand, 1=wake all

## Step 2: Confirm Target Settings

- `time`: Target sleep duration in Go Duration format (`"10m"`, `"30m"`, `"1h"`)
- Disk scope: `general_conf` (internal disks) and/or `usb_conf` (external USB disks)

## Step 3: Apply Disk Sleep Config

### POST /hardware/disk

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "general_conf": {
    "sleep_status": true,
    "time": "30m"
  },
  "usb_conf": {
    "sleep_status": true,
    "time": "30m"
  },
  "log_status": true,
  "wake_mode": 0
}
```

All fields required.

## Step 4: Verify Configuration

Call GET `/hardware/disk` again. Confirm sleep config matches target values.
