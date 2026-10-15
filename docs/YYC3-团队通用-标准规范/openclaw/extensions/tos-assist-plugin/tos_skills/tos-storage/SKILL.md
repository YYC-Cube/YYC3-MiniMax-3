---
name: "tos-storage"
description: "\"TNAS storage management operations, including storage pool/volume creation, expansion, deletion, formatting, disk S.M.A.R.T. testing, Hyper Cache creation and deletion. Triggers when user requests: create/delete/expand/format volumes, create/delete storage pools, create/delete Hyper Cache, SMART disk testing, or other storage-related operations.\""
---


# TOS Storage Management Skill

Provides TNAS storage management operations, including storage pool/volume management, disk SMART testing, and Hyper Cache management.

## Important Principles

1. Each function is independent; only execute the function that matches the trigger condition
2. Once triggered, follow all steps sequentially without skipping
3. Strictly follow output rules; do not output additional content

## Authentication

Before all API calls, obtain authentication credentials:

```
Call auth_get_api_credentials tool to get Cookie and X-Csrf-Token
```

If authentication fails, guide the user to log in using `auth_login`.

### Password Verification (High-Risk Operations)

Deletion, formatting, and other high-risk operations require password verification:

1. Request any TOS API, get RSA public key from response header `X-Rsa-Token` (Base64 decode and save as PEM file)
2. Encrypt password: `echo -n "password" | openssl rsautl -encrypt -pubin -inkey pubkey.pem | base64 -w 0`
3. Call `POST /v2/otp/verify_pwd`, **must simultaneously**:
   - Request body: `{"password": "encrypted_text"}`
   - Request header: `X-CurPass-Token: encrypted_text`
   - ⚠️ Missing `X-CurPass-Token` will return `missing request header` error!
4. Subsequent high-risk operations must also carry `X-CurPass-Token` header

### Request Header Template

```
Content-Type: application/json
X-Csrf-Token: {csrf_token}
Cookie: X-Csrf-Token={csrf_token}; TMSESSNAME={session_id}
```

High-risk operations additionally carry: `X-CurPass-Token: {encrypted_text}`

## Function Index

| # | Function | Trigger Example | Detail Docs |
|---|----------|-----------------|-------------|
| 1 | Create Volume | "help me create a volume" | [references/create-volume.md](references/create-volume.md) |
| 2 | Expand Volume | "volume space is running low" | [references/expand-volume.md](references/expand-volume.md) |
| 3 | Delete Volume | "help me delete the volume" | [references/delete-volume.md](references/delete-volume.md) |
| 4 | Format Volume | "I want to change the file system" | [references/format-volume.md](references/format-volume.md) |
| 5 | SMART Test | "test disk SMART" | [references/smart-test.md](references/smart-test.md) |
| 6 | Create Storage Pool | "help me create a storage pool" | [references/create-pool.md](references/create-pool.md) |
| 7 | Delete Storage Pool | "help me delete the storage pool" | [references/delete-pool.md](references/delete-pool.md) |
| 8 | Create Hyper Cache | "help me create a hyper cache" | [references/create-hypercache.md](references/create-hypercache.md) |
| 9 | Delete Hyper Cache | "help me delete the hyper cache" | [references/delete-hypercache.md](references/delete-hypercache.md) |
| 10 | High-Risk Operations | involving system disk / secure erase | See below |

After triggering, read the corresponding references file for complete execution steps and API specifications.

## Function 10: High-Risk Operations (Prohibited)

**Trigger conditions:** All operations involving system disks, secure erase/disk wipe

**Output:** This operation carries risks of data loss and device failure. To protect your data and device safety, do not execute via OpenClaw. Please go to TOS Storage Management to perform this operation manually.

## General API Basics

- **API base path:** Obtain port from `auth_get_api_credentials`, construct as `http://127.0.0.1:{port}`
- All interfaces require authentication headers

## Notes

1. Delete operations cannot be judged successful solely by API returning `code:true`; must re-query the list to confirm
2. Expanding a volume must pass the original `description`, otherwise it will be overwritten as empty
3. HyperLock-worm file system creation via OpenClaw is prohibited
4. SMART test task edit interface uses `POST /v2/disk/smart_test/schedule/:id/edit` (not PUT), `test_type` must be Number type
5. Unavailable storage pools should not be displayed to users
6. Capacity calculations must use the precise `bytes.value` field from the API