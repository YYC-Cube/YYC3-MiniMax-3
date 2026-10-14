# TOS fileManage API - Authentication

## Overview

fileManage APIs are accessed via `/v2/fileManage/` path, which nginx rewrites and proxies to the file-manage unix socket.

## Authentication

All requests require TOS session authentication:

### Required Cookies
- `TMSESSNAME` — session cookie from login
- `X-Csrf-Token` — CSRF token cookie
- `tos_current_username` — current username

### Required Header
- `X-Csrf-Token` — same value as the cookie

## Session Environment

Session variables stored in `/tmp/tos_env.sh`:
```bash
source /tmp/tos_env.sh
TOS="http://localhost:8181"
# $TMSESSNAME, $CSRF are available after sourcing
```

## Example Request

```bash
curl -sk \
  -b "TMSESSNAME=$TMSESSNAME;X-Csrf-Token=$CSRF;tos_current_username=xia" \
  -H "X-Csrf-Token: $CSRF" \
  "$TOS/v2/fileManage/GetShareList"
```

## POST Request with JSON Body

**Important**: Write JSON to a file and use `-d @file` to avoid session loss:
```bash
cat > /tmp/request.json << 'EOF'
{"paths":["/Volume2/222"]}
EOF

curl -sk \
  -b "TMSESSNAME=$TMSESSNAME;X-Csrf-Token=$CSRF;tos_current_username=xia" \
  -H "X-Csrf-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d @/tmp/request.json \
  "$TOS/v2/fileManage/AddShareFile"
```

## Service Management

If filemanage service crashes (502 Bad Gateway):
```bash
systemctl restart filemanage
# Wait 15-25 seconds for service to stabilize
```
