# Feature 8: Security Isolation Mode

## Trigger Conditions

- Enable/disable TNAS security isolation mode
- Configure isolation mode access whitelist or blocking rules
- Check current security isolation mode status

## Step 1: Get Current Isolation Status

### GET /security/absolute/status

**Headers**: Content-Type: application/json

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": true,
  "time": 0.1,
  "code_num": 0,
  "code_msg": ""
}
```

- `data`: Boolean — `true` = isolation enabled, `false` = disabled

## Step 2: Confirm User Intent

Record user's intent: `true` (enable) or `false` (disable).

## Step 3: Apply Configuration

### POST /security/absolute/set?enable=<true|false>

**Query Parameter**: `enable` — `true` to enable, `false` to disable (required)

**Headers**: Content-Type: application/json

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {},
  "time": 0.1,
  "code_num": 0
}
```

When enabled, firewall rules are automatically applied.

## Step 4: Verify Configuration

Call GET `/security/absolute/status` again. Confirm `data` matches the intended state.
