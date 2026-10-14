# API Reference: Safe Box (保险箱)

Manage user safe box: set password, open, close, reset.

All endpoints: `POST /v2/fileManage/<action>` unless noted.
Authentication: session cookies + CSRF token + RSA-encrypted password fields.

> **Critical**: Password fields use `pass_word` (underscore), NOT `password`.
> The value must be RSA-encrypted with the TOS public key (PKCS1v15 + base64), same method as login password encryption.

---

## 1. GetSafeBoxConf

Get safe box status and configuration.

**Request**: `GET /v2/fileManage/GetSafeBoxConf`

**Response**:
```json
{
  "code": true,
  "data": {
    "status": false,        // boolean - true=opened, false=closed
    "is_pass_word": false,  // boolean - true=password set, false=no password
    "path": "/Volume2/homes/xia/safe"  // string - safe box folder path
  },
  "code_num": 0
}
```

**Behavior**:
- No auth beyond session cookies required
- Returns current safe box state for the logged-in user

---

## 2. SetSafeBoxPwd

Set safe box password (first-time setup or change).

**Request**: `POST /v2/fileManage/SetSafeBoxPwd`

**Body**:
```json
{
  "pass_word": "<RSA-encrypted-password>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pass_word | string | Yes | RSA PKCS1v15 encrypted + base64 encoded password |

**Password requirements** (enforced by frontend, may be enforced by backend):
- At least 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one digit

**Response**:
```json
{
  "code": true,
  "data": true,
  "code_num": 0,
  "code_msg": ""
}
```

**Error responses**:
- `code_num: 36, code_msg: "bad password"` — RSA decryption failed (wrong key or field name is `password` instead of `pass_word`)

**Behavior**:
- Only works when safe box has no password yet (`is_pass_word: false`)
- To change existing password, use `ResetSafeNew` instead

---

## 3. OpenSafeBox

Open (unlock) the safe box.

**Request**: `POST /v2/fileManage/OpenSafeBox`

**Body**:
```json
{
  "pass_word": "<RSA-encrypted-password>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pass_word | string | Yes | RSA PKCS1v15 encrypted + base64 encoded password |

**Response**:
```json
{
  "code": true,
  "data": {
    "code": 0,
    "image_id": "",
    "image": "",
    "path": "/home/xia/safe"
  },
  "code_num": 0
}
```

**Behavior**:
- Unlocks the safe box for the current session
- After opening, `GetSafeBoxConf` returns `status: true`
- Safe box auto-locks after 15 minutes of inactivity (frontend timer)

---

## 4. CloseSafeBox

Close (lock) the safe box.

**Request**: `POST /v2/fileManage/CloseSafeBox`

**Body**: `{}`

**Response**:
```json
{
  "code": true,
  "data": 0,
  "code_num": 0
}
```

**Behavior**:
- Locks the safe box immediately
- After closing, `GetSafeBoxConf` returns `status: false`

---

## 5. ResetSafeNew

Reset safe box password (requires current user password verification first).

**Request**: `POST /v2/fileManage/ResetSafeNew`

**Body** (to be verified):
```json
{
  "pass_word": "<RSA-encrypted-new-password>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pass_word | string | Yes | RSA encrypted new password |

**Prerequisite**: Must verify current user password via `CheckUserPasswd` before calling.

**Response**: *(to be verified)*

---

## 6. CheckUserPasswd

Verify current user's login password (used as authorization step before sensitive operations like resetting safe box password).

**Request**: `POST /v2/fileManage/CheckUserPasswd`

**Body**: `{}`

**Custom Header**: `x-curpass-token: <RSA-encrypted-current-password>`

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| x-curpass-token | string | Yes | RSA PKCS1v15 encrypted + base64 encoded current user password |

**Response**: *(to be verified)*
```json
{
  "code": true,
  "data": {
    "is_pass": true
  },
  "code_num": 0
}
```

---

## 7. GetPathWriteAcl

Get write ACL for a path (used by safe box to check permissions).

**Request**: *(to be verified)*

**Response**: *(to be verified)*

---

## Workflow: Enable Safe Box (First Time)

1. Call `GetSafeBoxConf` → confirm `is_pass_word: false` and `status: false`
2. Call `SetSafeBoxPwd` with RSA-encrypted password → sets the password
3. Call `OpenSafeBox` with RSA-encrypted password → unlocks the safe box
4. Safe box folder is now accessible at the `path` returned by `GetSafeBoxConf`

## Workflow: Open Safe Box (Subsequent)

1. Call `GetSafeBoxConf` → confirm `is_pass_word: true` and `status: false`
2. Call `OpenSafeBox` with RSA-encrypted password → unlocks the safe box

## Workflow: Reset Safe Box Password

1. Call `CheckUserPasswd` with `x-curpass-token` header containing RSA-encrypted current user password
2. On success, call `ResetSafeNew` with RSA-encrypted new password

## Workflow: Close Safe Box

1. Call `CloseSafeBox` with empty body `{}` → locks the safe box
