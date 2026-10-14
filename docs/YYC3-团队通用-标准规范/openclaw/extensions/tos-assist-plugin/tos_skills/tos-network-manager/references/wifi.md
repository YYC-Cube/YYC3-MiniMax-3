# Connect WiFi - API Interface Definitions

## 1. Detect WiFi Adapter

- **Path**: `/v2/networkSet/WlanOn`
- **Method**: GET
- **Response Body**:

```json
{
  "code": "boolean",
  "data": "boolean - true=WiFi adapter available, false=no WiFi adapter",
  "is_login": "boolean",
  "msg": "string"
}
```

## 2. Get WiFi List

- **Path**: `/v2/networkSet/GetWifiList`
- **Method**: GET
- **Response Body**:

```json
{
  "code": "boolean",
  "data": [
    {
      "encrypt": "string - encryption identifier: WPA/WEP/OPEN",
      "encrypt_show": "string - encryption display: WPA2-PSK/WPA3-PSK/WEP/Open",
      "level": "integer - signal strength 0-100",
      "ssid": "string - WiFi name",
      "old": "integer - 1=previously connected, 2=never connected",
      "is_link": "integer - 1=connected, 0=not connected"
    }
  ]
}
```

## 3. Connect to WiFi

- **Path**: `/v2/networkSet/LinkWiFi`
- **Method**: POST
- **Requires X-Security-Code**: Yes
- **Request Body**:

```json
{
  "wireless_mode": "integer - 0=network mode, 1=direct mode, default: 0",
  "ssid": "string - WiFi name, required",
  "encrypt": "string - encryption method: none/WEP/WPA-PSK/WPA2-PSK/WPA3-PSK, default: WPA2-PSK",
  "password": "string - WiFi password"
}
```

- **Response Body**:

```json
{
  "code": "boolean",
  "data": "boolean - true=connection successful, false=connection failed",
  "msg": "string - error message"
}
```

## 4. Verify Connection Status

- **Path**: `/v2/networkSet/GetInterfaceList`
- **Method**: GET
- **Query Parameters**: `need_wan_ip` (optional, true=get public IP)
- **Response Body Key Fields**:

```json
{
  "data": [
    {
      "eth": "string - interface name",
      "online": "integer - 1=online, 2=offline",
      "ipaddress": "string - IPv4 address",
      "gateway": "string - gateway",
      "ssid": "string - WiFi name (wireless only)",
      "level": "integer - signal strength (wireless only)"
    }
  ]
}
```

## Disconnect WiFi

TOS API has no dedicated disconnect interface. Use wpa_cli:

```bash
# Disable network (prevent auto-reconnect)
wpa_cli -i wlan0 disable_network <network_id>
# Disconnect
wpa_cli -i wlan0 disconnect
```
