# Enable Telnet - API Interface Definitions

## Get Telnet/SSH Configuration

- **Path**: `/v2/terminalManage/GetTelnetSSHConf`
- **Method**: GET
- **Content-Type**: `application/json`
- **Response Body**:

```json
{
  "code": "boolean",
  "data": {
    "telnet": "integer - 1=enabled, 2=disabled",
    "telnet_port": "integer - Telnet port",
    "only_local": "integer - 1=local only, 2=allow remote",
    "ssh": "integer - 1=enabled, 2=disabled",
    "ssh_port": "integer - SSH port",
    "ssh_notify": "integer - 1=notifications enabled, 2=notifications disabled"
  }
}
```

## Set Telnet/SSH Configuration

- **Path**: `/v2/terminalManage/SetTelnetSSHConf`
- **Method**: POST
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "only_local": "integer - 1=local only, 2=allow remote",
  "ssh": "integer - 1=enabled, 2=disabled",
  "ssh_port": "integer - SSH port",
  "telnet": "integer - 1=enabled, 2=disabled",
  "telnet_port": "integer - Telnet port",
  "ssh_notify": "integer - 1=notifications enabled, 2=notifications disabled"
}
```

- **Response Body**:

```json
{
  "code": "boolean - true=settings applied successfully",
  "data": "boolean - true=settings applied successfully",
  "msg": "string"
}
```

**Note**: Set `telnet=1` to enable Telnet, `telnet=2` to disable. When modifying, preserve the current values of other fields.
