# Feature 1: Time/Timezone Management

## Trigger Conditions

- Modify TNAS system time
- Change timezone to another region
- TNAS time display is incorrect, adjust it

## Step 1: Get Current Time/Timezone Config

### GET /timesetting/get

Fetch current timezone configuration.

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "is_automatic": 1,
    "capital": "string - timezone capital city",
    "time_zone": {
      "uistring": "string - display string",
      "POSIX_TZ": "string - POSIX timezone format",
      "gmtoff": 0,
      "nameInTZDB": "string - IANA timezone name"
    },
    "date_format_str": "string",
    "time_format_str": "string",
    "time_server": "string - NTP server address",
    "time_interval": 12,
    "now": "string - current time"
  },
  "code_num": 0,
  "code_msg": ""
}
```

### GET /desktop/init

Fetch system time from desktop init. Key fields: `data.Date.time` (current time), `data.Date.time_format_str` ("24" = 24h format), `data.Date.date` (date).

**Headers**: Cookie (required), X-Csrf-Token (required)

## Step 2: Confirm Target Time/Timezone

Use `now` for target time. Use `capital`, `time_zone.uistring`, `time_zone.nameInTZDB`, `time_zone.POSIX_TZ` for target timezone.

## Step 3: Set Time/Timezone

### POST /timesetting/set

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "is_automatic": 0,
  "capital": "string",
  "time_zone": {
    "uistring": "string",
    "POSIX_TZ": "string",
    "gmtoff": 0,
    "nameInTZDB": "string"
  },
  "date_format_str": "string",
  "time_format_str": "string",
  "time_server": "string",
  "time_interval": 12,
  "now": "string"
}
```

All fields are required. `is_automatic`: 0=manual, 1=NTP auto sync.

## Step 4: Restart NTP Service

### GET /timesetting/ntp?action=start

- `action=start` → start NTP service
- Any other value → stop NTP service

**Headers**: Cookie (required), X-Csrf-Token (required)

## Step 5: Verify Changes

Call GET `/timesetting/get` again. Confirm timezone config matches target.
