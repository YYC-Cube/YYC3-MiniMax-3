# Feature 9: Service/Process Management

## Trigger Conditions

- Stop a TNAS service
- Terminate a running process
- A service is using too many resources, stop it

## Step 1: Query Service/Process Status

Service and process status are obtained via **WebSocket** connections.

- **Services**: Connect to WebSocket with topic `"services"`. Use `canbeOperate` field to check if a service can be operated on.
- **Processes**: Connect to WebSocket with topic `"top"`. Use `canbeOperate` field to check if a process can be operated on.

## Step 2: Confirm Target

### For Services
- `name`: Target service name
- `action`: `"stop"` (stop) or `"restart"` (restart)

### For Processes
- `pid`: Target process ID
- `action`: `"stop"` (only option for processes)

## Step 3: Execute Operation

### For Services: POST /system/servicesCtl

**Request Body**:
```json
{
  "name": "string - service name",
  "action": "stop"
}
```

`action` values: `"restart"` or `"stop"`

### For Processes: POST /system/processCtl

**Request Body**:
```json
{
  "pid": 12345,
  "action": "stop"
}
```

`action` values: `"stop"` (only option)

## Step 4: Verify Stopped

Query via WebSocket again (topic `"services"` or `"top"`) to confirm the target service/process is no longer running.

## Step 5: Report Resource Usage

WebSocket provides real-time resource usage data. Report the current system resource status after the operation.
