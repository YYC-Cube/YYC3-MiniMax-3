# AD Domain & LDAP Connection API Reference

## Network Detection (Shared by AD/LDAP)

- **Path**: `GET /domain/NetworkDetection?dns={dns}&test=false`
- **Parameters**: `dns`=DNS or LDAP server IP, `test`=whether testing (default false)
- **Response `data`**: 0=normal, 1=IP format error, 2=port 389 unreachable

## DNS Record Detection (AD Domain)

- **Path**: `GET /domain/DnsRecordDetection?domain={domain}&dns={dns}&test=false`
- **Parameters**: `domain`=domain or BaseDN, `dns`=DNS server IP
- **Response `data`**: 0=normal, 1=IP format error, 2=DNS server invalid, 3=network unreachable

## AD Domain Configuration

### Get AD Domain Configuration

- **Path**: `GET /domain/config/ads`
- **Response `data`** fields:

| Field | Type | Description |
|-------|------|-------------|
| domain_name | string | Domain name |
| dns_server | string | DNS server IP |
| management_mode | number | 1=AD domain, 2=LDAP |
| connection_status | number | 1=connected, 0=not connected |
| senior_domain | number | 1=advanced enabled, 0=disabled |
| dc_ip | string | Domain controller IP |
| domain_net_bios | string | NetBIOS name (≤15 characters) |
| domain_FQDN | string | Fully qualified domain name |
| regist_dns | string | Network interface for DNS registration |
| update_interval | number | Update interval (minutes) |
| username | string | Domain administrator username |
| password | string | Domain administrator password |

### AD Domain Join (DomainServiceDetection)

- **Path**: `POST /domain/DomainServiceDetection`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| domain_name | string | ✅ | Domain name |
| dns_server | string | ✅ | DNS server |
| username | string | ✅ | Domain administrator username |
| password | string | ✅ | RSA-encrypted password |
| domainPassword | string | ✅ | **Plaintext domain administrator password** |
| connection_status | integer | ✅ | **1=join domain, 0=detect only** |
| regist_dns | string | ✅ | Network interface name for DNS registration (e.g. "eth0") |
| management_mode | integer | ❌ | Management mode (default 0) |
| senior_domain | integer | ❌ | Advanced settings (default 0) |
| dc_ip | string | ❌ | Domain controller IP |
| domain_FQDN | string | ❌ | FQDN |
| domain_net_bios | string | ❌ | NetBIOS name |
| update_interval | integer | ❌ | Update interval (default 10) |

> ⚠️ **Key Finding**: `connection_status` must be **1** to actually join the domain! When set to 0, it only detects domain service availability and does not execute `net ads join`.
>
> ⚠️ **Dual Password Fields**: `password` is the RSA-encrypted password, `domainPassword` is the plaintext password. **Both fields must be provided**. TOSDaemon uses the plaintext password to execute `net ads join`.
>
> ⚠️ **`regist_dns` is required**: Specifies the network interface name for DNS record registration (can be obtained via `GET /v2/network/interface`, typically "eth0").

- **Response `data`**: 0=normal, 1=configuration save error, 2=DNS setup error, 3=SMB workgroup setup error, 4=domain service startup failed, 5=user authentication failed, 6=NetBIOS retrieval failed, 7=service stop failed, 8=system busy, 9=DC IP configuration error, 10=DC IP connection failed, 11=NetBIOS verification failed, 12=NetBIOS does not exist

**Request Example**:
```json
{
  "domain_name": "example.com",
  "dns_server": "10.18.8.95",
  "management_mode": 0,
  "connection_status": 1,
  "senior_domain": 0,
  "dc_ip": "",
  "domain_net_bios": "",
  "domain_FQDN": "",
  "regist_dns": "eth0",
  "update_interval": 10,
  "username": "Administrator",
  "password": "<RSA-encrypted password>",
  "domainPassword": "Admin123"
}
```

## LDAP Configuration

### Get LDAP Configuration

- **Path**: `GET /domain/config/ldap`
- **Response `data`** fields:

| Field | Type | Description |
|-------|------|-------------|
| ldap_server_location | string | LDAP server address |
| encryption | number | 0=no encryption, 1=TLS, 2=STARTTLS |
| base_dn | string | Base DN |
| connection_status | number | 1=connected, 0=not connected |
| ldap_conf_file | number | 1=standard format, 2=custom format |
| update_interval | number | Update interval (seconds) |
| ldap_start_cifs | number | CIFS plaintext password: 1=enabled, 0=disabled |
| ldap_start_uid | number | UID/GID mapping: 1=enabled, 0=disabled |
| ldap_no_nested | number | Disable nesting: 1=disabled, 0=enabled |
| ldap_client_certificate | string | Client certificate path |
| username | string | LDAP administrator username (DN format) |
| password | string | LDAP administrator password |

### LDAP Service Detection

- **Path**: `POST /domain/LdapServiceDetection`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | ✅ | Username |
| password | string | ✅ | Password |
| ldap_server_location | string | ❌ | LDAP server address |
| base_dn | string | ❌ | Base DN |
| encryption | integer | ❌ | Encryption method |
| ldap_conf_file | integer | ❌ | Configuration file format |
| ldap_start_cifs | integer | ❌ | CIFS plaintext password |
| ldap_start_uid | integer | ❌ | UID/GID mapping |
| ldap_no_nested | integer | ❌ | Disable nesting |
| ldap_client_certificate | string | ❌ | Client certificate |
| update_interval | integer | ❌ | Update interval |
| connection_status | integer | ❌ | Connection status |

- **Response `data`**: 0=normal, 1=configuration save error, 2=hosts setup failed, 3=SMB workgroup setup error, 4=domain service startup failed, 5=user authentication failed

## General Domain Interfaces

### Disconnect Domain (OutDomain)

- **Path**: `POST /domain/OutDomain`
- **Request Body**: `{}`
- **Response**:

| Field | Type | Description |
|-------|------|-------------|
| code | boolean | Response status |
| code_num | number | Status code |
| code_msg | string | Status message |
| data | boolean | true=disconnection succeeded |
| is_login | boolean | Whether logged in |
| msg | string | Error message |
| time | number | Duration (seconds) |

- ⚠️ After execution, TOSDaemon will restart related services; existing sessions will become invalid and re-login is required

### Get Domain Leave Status (GetOutDomainStatus)

- **Path**: `GET /domain/GetOutDomainStatus`
- **Response**:

| Field | Type | Description |
|-------|------|-------------|
| code | boolean | Response status |
| code_num | number | Status code |
| code_msg | string | Status message |
| data | number | 0=completed, 1=in progress |
| is_login | boolean | Whether logged in |
| msg | string | Error message |
| time | number | Duration (seconds) |

- Usage: Poll this endpoint after calling `OutDomain`; `data=0` indicates the leave operation is complete

### Get Domain Users and Groups

- **Path**: `GET /domain/GetDirectory?type={type}&test={test}`
- **Response `data`**: -1=failed to read configuration, 0=normal, 1=domain service not running, 2=failed to get configuration, 3=failed to connect to domain server, 4=user authentication failed, 5=failed to get domain groups, 6=failed to get domain users

### Get Update Status

- **Path**: `GET /domain/GetUpdateStatus`
- **Response `data`**: -1=update interrupted, 0=not updated, 1=updating, 2=failed to get domain group info, 3=failed to get domain user info, 4=failed to update domain group info, 5=failed to update domain user info, 6=domain connection failed, 7=failed to load configuration, 8=server error, 200=update successful

### Check Domain Connection Status

- **Path**: `GET /domain/is_connect`
- **Response `data`**: 0=not connected, 1=AD domain, 2=LDAP domain
