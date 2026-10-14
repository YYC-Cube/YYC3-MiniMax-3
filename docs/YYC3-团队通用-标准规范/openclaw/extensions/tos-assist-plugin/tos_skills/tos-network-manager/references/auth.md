# Authentication

## TOS Internal API (Recommended)

Access TOSDaemon directly via internal port 5050, bypassing nginx and CAPTCHA.

**Route mapping**: `/v2/xxx` (port 8181) → `/xxx` (port 5050)

## Login Flow

### Step 1: Obtain CSRF Token and RSA Public Key

```
POST http://127.0.0.1:5050/login
Content-Type: application/json
Body: {}
```

Retrieve from response headers:
- `Set-Cookie` → `X-Csrf-Token=<token>`
- `X-Rsa-Token`: Base64-encoded RSA public key (PEM format)

### Step 2: Encrypt Password

Encrypt the password using the RSA public key (PKCS1v15 padding):
```bash
echo -n "password" | openssl rsautl -encrypt -pubin -inkey rsa.pub | base64
```

### Step 3: Login

```
POST http://127.0.0.1:5050/login
Content-Type: application/json
X-Csrf-Token: <csrf>
Cookie: X-Csrf-Token=<csrf>
Body: {"username": "demo", "password": "<encrypted_password>"}
```

Retrieve `TMSESSNAME=<session_id>` from `Set-Cookie` response header.

### Step 4: Build Complete Cookie

```
Cookie: X-Csrf-Token=<csrf>; TMSESSNAME=<session_id>; tos_current_username=demo; userName=demo; loginStatus=true
```

## X-Security-Code Generation

Some POST interfaces require this header:
```python
from datetime import datetime, timezone
import base64
now = datetime.now(timezone.utc)
imf_fixdate = now.strftime("%a, %d %b %Y %H:%M:%S GMT")
security_code = base64.b64encode(imf_fixdate.encode()).decode()
```

## Authentication State Persistence

Authentication information can be saved to `/tmp/tos_auth.json`:
```json
{
  "csrf": "<csrf_token>",
  "session_id": "<session_id>",
  "cookie_str": "Complete cookie string"
}
```

**Note**: Sessions expire. When encountering `is_login: false`, you need to re-login.
