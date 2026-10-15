---
name: "tos-network-manager"
description: ">"
---


  One-stop quick management for TNAS wireless network connection, Telnet service management,
  media index configuration, port management, and high-risk operation interception.
  Trigger conditions: user mentions WiFi connection, wireless network connection, enable Telnet,
  media index settings/thumbnail level, modify ports/port numbers, or involves high-risk operations
  such as OVS Bond/PPTP/OpenVPN/L2TP/traffic management/edit network interfaces/add index directory/
  edit media index/DDNS.
  Use when: user asks to connect WiFi, enable Telnet, configure media index thumbnails,
  modify service ports on TNAS/TOS, or attempts high-risk operations
  (OVS Bond, PPTP, OpenVPN, L2TP/IPSec, traffic management, edit network interfaces, add/edit media index, DDNS).

# TOS Network Manager

Version: 1.003

## Important Constraints

1. **Feature independence**: Each command only executes the matched feature; untriggered features do not participate.
2. **Steps must be fully executed**: Once a feature is triggered, complete the entire workflow step by step without skipping or omitting.
3. **High-risk operations are prohibited from execution**: Feature 5 only outputs a risk warning message and does not perform any actual operations.

## General: API Request Specification

The base path for all interfaces is the TNAS device address (e.g., `http://<nasIP>:<port>`).

**Common Request Headers**:

| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | Use `application/x-www-form-urlencoded` for GET requests; `application/json` for POST requests |
| Cookie | Yes | `userName=<username>; TMSESSNAME=<sessionID>; X-Csrf-Token=<CSRFToken>; tos_current_username=<username>; loginStatus=true` |
| X-Csrf-Token | Yes | Must match the X-Csrf-Token value in the Cookie |
| X-Security-Code | Some POST endpoints | Base64 encoding of current time in IMF-fixdate format |

**Obtaining authentication**: Before making any API calls, you must first obtain valid Cookie and CSRF Token from the TOS web interface. Options:
- Read `references/auth.md` for authentication methods
- Or prompt the user to provide valid authentication credentials

**Detailed API Interface Documentation**: Complete interface definitions (paths, parameters, response bodies) for each feature are stored in the `references/` directory, organized by feature:
- `references/wifi.md` — Feature 1: Connect WiFi
- `references/telnet.md` — Feature 2: Enable Telnet
- `references/media-index.md` — Feature 3: Media Index Settings
- `references/port-management.md` — Feature 4: Modify Ports

When executing a feature, first `read` the corresponding reference file to get complete interface definitions, then call the APIs step by step.

---

## Feature 1: Connect WiFi

**Trigger**: User says "connect WiFi", "connect to wireless network", "connect to WiFi", or similar instructions.

**Steps**:

1. **Detect USB wireless adapter** — GET `/v2/networkSet/WlanOn`. If `data=false`, output "No USB wireless adapter detected. Please plug in a wireless adapter and try again" and terminate.
2. **Scan WiFi list** — GET `/v2/networkSet/GetWifiList`. Display the scanned WiFi list to the user (SSID, encryption method, signal strength, connection status).
3. **Prompt user input** — Ask for the target WiFi SSID and password.
4. **Connect to WiFi** — POST `/v2/networkSet/LinkWiFi`, request body contains `ssid`, `password`, `encrypt` (default `WPA2-PSK`), `wireless_mode` (default 0).
5. **Verify connection** — GET `/v2/networkSet/GetInterfaceList`, find the IP address of the wlan interface.

**Output**:
- Success: `WiFi connected successfully, current IP: {IP address}`
- Failure: `Step X execution failed`

**Detailed interface definitions**: `read references/wifi.md`

---

## Feature 2: Enable Telnet

**Trigger**: User says "enable Telnet", "turn on Telnet connection", "allow Telnet", or similar instructions.

**Steps**:

1. **Output risk warning**: `⚠️ Warning: Telnet is an unencrypted transmission protocol with security risks (such as plaintext password transmission, session eavesdropping, etc.). It is recommended to use SSH instead.`
2. **Ask for confirmation**: `Please confirm whether to continue enabling Telnet. Enter yes or no`
3. **Wait for user input** — no → output "Telnet enable operation cancelled" and terminate; yes → continue.
4. **Enable Telnet** — POST `/v2/terminalManage/SetTelnetSSHConf`, request body contains `telnet=1, telnet_port=23, only_local=1` (preserve current values of other fields).
5. **Verify status** — GET `/v2/terminalManage/GetTelnetSSHConf`, confirm `telnet=1`.

**Output**:
- Success: `Telnet enabled, port: 23. Please note the security risks. It is recommended to disable it after use.`
- User cancelled: `Telnet enable operation cancelled`
- Execution error: `Step X execution failed`

**Special**: Must wait for user to explicitly input yes/no. Skipping the risk confirmation to enable Telnet directly is prohibited.

**Detailed interface definitions**: `read references/telnet.md`

---

## Feature 3: Media Index Settings

**Trigger**: User says "set media index", "modify thumbnail level", "configure photo/video thumbnails", or similar instructions.

**Steps**:

1. **Get current configuration** — GET `/v2/mediaIndex/MediaThumbnail`.
2. **Display current configuration**: Photo thumbnail level (0=standard/1=high quality), Video thumbnail level (0=standard/1=high quality).
3. **Ask what to modify**: A=Modify photo thumbnail level, B=Modify video thumbnail level, C=Modify both.
4. **Determine new values based on selection**.
5. **Apply configuration** — POST `/v2/mediaIndex/MediaThumbnail`, request body contains `photo_conversion_level`, `video_conversion_level`.
6. **Verify configuration** — GET `/v2/mediaIndex/MediaThumbnail` again, confirm the update.

**Output**:
- Success: `Media index settings applied: photo thumbnail=[level], video thumbnail=[level]` (level text: standard quality/high quality)
- Failure: `Step X execution failed`

**Detailed interface definitions**: `read references/media-index.md`

---

## Feature 4: Modify Ports

**Trigger**: User says "modify port", "set port number", or similar instructions.

**Steps**:

1. **Get current service port configuration** — Based on the user-specified service, call the corresponding GET interface:
   - Web Management: `/v2/networkSet/GetRoutineSetConf` (http_port, https_port)
   - SMB: `/v2/fileService/GetSambaConf` (smb_ports)
   - FTP/SFTP: `/v2/fileService/GetFtpConf` (ftp_port, sftp_port)
   - NFS: `/v2/fileService/GetNfsConf`
   - rsync: `/v2/fileService/GetRsyncConf` (port)
   - WebDAV: `/v2/fileService/GetWebdavConf` (http_port, https_port)
   - Telnet/SSH: `/v2/terminalManage/GetTelnetSSHConf` (telnet_port, ssh_port)
   - SNMP: `/v2/terminalManage/GetSnmpdConf` (port)
2. **Check if service is enabled** — If status shows the service is not enabled, ask user whether to enable it first; no → terminate.
3. **Get new port number** — Ask user to input (1-65535).
4. **Validate port number** — Non-numeric or out of range → return "Invalid port number. Please enter a number between 1 and 65535".
5. **Check port availability** — GET `/v2/fileService/CheckPort?port={new_port}&original={original_port}`. If occupied → return "Port {new_port_number} is already in use. Please choose a different port number".
6. **Execute modification** — Call the corresponding POST interface, preserving other fields unchanged, only modifying the target port.
7. **Verify result** — Call the GET interface again to confirm the port has been updated.

**Output**:
- Success: `Port modification successful. The port for {service_name} has been changed to {new_port_number}.`
- User cancelled: `Port modification operation cancelled`
- Invalid port: `Invalid port number. Please enter a number between 1 and 65535`
- Port occupied: `Port {new_port_number} is already in use. Please choose a different port number`
- Execution error: `Step X execution failed`

**Special**: Port availability check is mandatory before modification. Skipping is strictly prohibited. This does not involve proxy connection configuration.

**Detailed interface definitions**: `read references/port-management.md`

---

## Feature 5: High-Risk Operations (Unified Handling)

**Trigger**: Matches when user mentions any of the following operations:
1. OVS Bond (configure OVS Bond, OVS binding)
2. PPTP (configure PPTP, PPTP VPN settings)
3. OpenVPN (import ovpn file, configure OpenVPN)
4. L2TP/IPSec (configure L2TP, L2TP/IPSec settings)
5. Create traffic management (configure traffic management policies)
6. Edit network interface (modify IP address, gateway, DNS, LAN port configuration)
7. Add index directory (add new media index directory)
8. Edit media index (modify media index configuration)
9. Remote access - DDNS (configure DDNS, set up remote access DDNS)

**Execution**: Performing any actual operations is prohibited.

**Output** (sole output):

```
This operation carries risks such as network anomalies and device failure. To protect your data and device security, do not execute it through OpenClaw. Please go to the TOS web interface at {nasIP_address+port} to perform it manually.
```

Where `{nasIP_address+port}` is replaced with the actual accessible IP address and port of the TNAS device.