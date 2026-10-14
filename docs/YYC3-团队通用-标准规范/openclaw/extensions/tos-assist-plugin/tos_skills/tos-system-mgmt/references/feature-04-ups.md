# Feature 4: UPS Configuration

## Trigger Conditions

- Configure TNAS UPS uninterruptible power supply
- Set UPS power-loss auto shutdown strategy
- Configure UPS monitoring parameters

## Step 1 & 2: Get UPS Status and Config

### GET /ups/

**Headers**: Content-Type: application/x-www-form-urlencoded, Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "ups_connected": true,
    "is_usb_device": true,
    "dev": {
      "mfr": "string - manufacturer",
      "model": "string - model",
      "charge": "100",
      "name": "string - device name",
      "runtime": "string - remaining runtime in seconds",
      "status": "OL",
      "port": "auto",
      "vendorid": "string",
      "productid": "string"
    },
    "conf": {
      "enabled": true,
      "type": 1,
      "time_conf": {
        "is_same_as_server": true,
        "time_mode": 1,
        "secs": 300
      },
      "enabled_listen": false,
      "allowed_ips": [],
      "server_addr": "string",
      "server_port": "string",
      "snmp_conf": {
        "port": "auto",
        "mibs": "string",
        "community": "public",
        "version": "v2c"
      }
    }
  },
  "code_num": 0
}
```

Key fields:
- `ups_connected`: Whether UPS is connected
- `dev.charge`: Battery level percentage
- `dev.status`: OL=mains power, OB=battery power
- `conf.type`: 1=USB, 2=SNMP, 3=TNAS server
- `conf.time_conf.time_mode`: 1=specified time, 2=no specified time
- `conf.time_conf.secs`: Shutdown time in seconds (when time_mode=1)

## Step 3: Confirm Target Settings

Based on `/ups/set` fields, confirm with user:
- `enabled`: Enable/disable UPS
- `type`: Connection type (1=USB, 2=SNMP, 3=TNAS server)
- `time_conf`: Shutdown time configuration
- `enabled_listen`: Enable listen mode
- For type=2 (SNMP): `snmp_conf` details
- For type=3 (TNAS server): `server_addr`, `server_port`

## Step 4: Apply UPS Config

### POST /ups/set

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "enabled": true,
  "type": 1,
  "time_conf": {
    "is_same_as_server": true,
    "time_mode": 1,
    "secs": 300
  },
  "enabled_listen": false,
  "allowed_ips": [],
  "server_addr": "string (required when type=3)",
  "server_port": "string (required when type=3)",
  "snmp_conf": {
    "port": "string (required when type=2)",
    "mibs": "auto",
    "community": "public",
    "version": "v2c"
  }
}
```

Required fields: `enabled`, `type`, `time_conf`, `enabled_listen`.

## Step 5: Verify Configuration

Call GET `/ups/` again. Confirm config matches target values.
