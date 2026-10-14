# Modify Ports - API Interface Definitions

## Port Availability Check

- **Path**: `/v2/fileService/CheckPort`
- **Method**: GET
- **Query Parameters**:

| Parameter | Required | Description |
|-----------|----------|-------------|
| port | Yes | Port number to check, 1-65535 |
| original | No | Currently occupied original port (when provided, this port is considered occupied and excluded from the check) |

- **Response Body**:

```json
{
  "code": "boolean - true=check successful",
  "data": "boolean - true=port occupied (unavailable), false=port available"
}
```

---

## Web Management Port

### GET - Get Routine Settings

- **Path**: `/v2/networkSet/GetRoutineSetConf`
- **Response Key Fields**:

```json
{
  "data": {
    "http_port": "integer - HTTP port",
    "https_port": "integer - HTTPS port",
    "device_name": "string - device name",
    "ip": "string - public IPv4 address"
  }
}
```

### POST - Set Routine Settings

- **Path**: `/v2/networkSet/SetRoutineSetConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "device_name": "string - device name",
  "http_port": "integer - HTTP port",
  "https_port": "integer - HTTPS port",
  "http_redirect": "boolean - whether to enable HTTP to HTTPS redirect",
  "release_default_port": "boolean - whether to release ports 80 and 443",
  "http_server_name_status": "integer - HTTP response header Server field display status",
  "http_connections_status": "integer - HTTP max connections limit status"
}
```

---

## SMB

### GET - Get Samba Configuration

- **Path**: `/v2/fileService/GetSambaConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "number - 1=enabled, 2=disabled",
    "smb_ports": "number - SMB port",
    "work_group": "string - workgroup",
    "win_server_name": "string - Win server name"
  }
}
```

### POST - Set Samba Configuration

- **Path**: `/v2/fileService/SetSambaConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "number - 1=enabled, 2=disabled",
  "smb_ports": "number - SMB port",
  "work_group": "string - workgroup",
  "win_server_name": "string - Win server name"
}
```

---

## FTP/SFTP

### GET - Get FTP Configuration

- **Path**: `/v2/fileService/GetFtpConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "number - 1=enabled, 2=disabled",
    "ftp_port": "number - FTP port",
    "sftp_status": "number - 1=enabled, 2=disabled",
    "sftp_port": "number - SFTP port"
  }
}
```

### POST - Set FTP Configuration

- **Path**: `/v2/fileService/SetFtpConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "number - 1=enabled, 2=disabled",
  "ftp_port": "number - FTP port",
  "sftp_status": "number - 1=enabled, 2=disabled",
  "sftp_port": "number - SFTP port"
}
```

---

## NFS

### GET - Get NFS Configuration

- **Path**: `/v2/fileService/GetNfsConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "number - 1=enabled, 2=disabled",
    "max_nfs": "number - NFS max version",
    "nfs_4_region": "string - NFSv4 domain"
  }
}
```

### POST - Set NFS Configuration

- **Path**: `/v2/fileService/SetNfsConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "number - 1=enabled, 2=disabled",
  "max_nfs": "number - NFS max version",
  "nfs_4_region": "string - NFSv4 domain"
}
```

**Note**: NFS has no user-modifiable port field. If the user requests to modify the NFS port, inform them that NFS ports are managed by the system.

---

## rsync

### GET - Get rsync Configuration

- **Path**: `/v2/fileService/GetRsyncConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "number - 1=enabled, 2=disabled",
    "port": "number - rsync port",
    "auth_users": "string - authentication username"
  }
}
```

### POST - Set rsync Configuration

- **Path**: `/v2/fileService/SetRsyncConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "number - 1=enabled, 2=disabled",
  "port": "number - rsync port",
  "auth_users": "string - authentication username",
  "pwd": "string - authentication password (must be encrypted via JS Encrypt)"
}
```

---

## WebDAV

### GET - Get WebDAV Configuration

- **Path**: `/v2/fileService/GetWebdavConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "number - 1=enabled, 2=disabled",
    "http_port": "number - HTTP port",
    "https_port": "number - HTTPS port"
  }
}
```

### POST - Set WebDAV Configuration

- **Path**: `/v2/fileService/SetWebdavConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "number - 1=enabled, 2=disabled",
  "http_port": "number - HTTP port",
  "https_port": "number - HTTPS port",
  "http_status": "number - HTTP status: 1=enabled, 2=disabled",
  "https_status": "number - HTTPS status: 1=enabled, 2=disabled"
}
```

---

## Telnet/SSH

### GET - Get Telnet/SSH Configuration

- **Path**: `/v2/terminalManage/GetTelnetSSHConf`
- **Content-Type**: `application/json`
- **Response Key Fields**:

```json
{
  "data": {
    "telnet": "integer - 1=enabled, 2=disabled",
    "telnet_port": "integer - Telnet port",
    "ssh": "integer - 1=enabled, 2=disabled",
    "ssh_port": "integer - SSH port",
    "only_local": "integer - 1=local only, 2=allow remote",
    "ssh_notify": "integer - 1=notifications enabled, 2=notifications disabled"
  }
}
```

### POST - Set Telnet/SSH Configuration

- **Path**: `/v2/terminalManage/SetTelnetSSHConf`
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

---

## SNMP

### GET - Get SNMP Configuration

- **Path**: `/v2/terminalManage/GetSnmpdConf`
- **Response Key Fields**:

```json
{
  "data": {
    "status": "boolean - true=enabled, false=disabled",
    "port": "number - SNMP port"
  }
}
```

### POST - Set SNMP Configuration

- **Path**: `/v2/terminalManage/SetSnmpdConf`
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "status": "boolean - true=enabled, false=disabled",
  "port": "number - SNMP port",
  "event": "array - event type enumeration",
  "ip": "array - receiver address list"
}
```
