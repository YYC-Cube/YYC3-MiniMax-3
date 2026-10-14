# Time Machine API Reference

## Overview

All endpoints start with `{NAS_BASE_URL}/v2`.

Time Machine (时光回溯器) provides Mac backup support.

---

## GET /v2/timemachine/status

Get Time Machine service status.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": true,
  "code_num": 0
}
```

| `data` | Meaning |
|--------|---------|
| `true` | Service running |
| `false` | Service stopped |

---

## GET /v2/timemachine/service

Start or stop Time Machine service.

**Query Parameters:**
- `action` (required): Operation type
  - `start` - Start service
  - `stop` - Stop service

**Example:**
```
GET /v2/timemachine/service?action=stop
```

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "msg": "",
  "data": null,
  "time": 0.215374466,
  "code_num": 0,
  "code_msg": ""
}
```

---

## POST /v2/timemachine/get_limit

Get authorized directory list.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "Mntpath": "/Volume1/public",
      "Foldername": "public",
      "FolderId": 1,
      "Device": "Volume1",
      "Status": 0,
      "Description": ""
    }
  ],
  "code_num": 0
}
```

### Directory Fields

| Field | Description |
|-------|-------------|
| `FolderId` | Folder ID |
| `Foldername` | Folder name |
| `Mntpath` | Mount path |
| `Device` | Volume device |
| `Status` | Authorization status |

---

## GET /v2/timemachine/get_dir_list

Get all shared folders available for Time Machine.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "folder_id": 1,
      "folder_name": "public",
      "mnt_path": "/Volume1/public",
      "device": "Volume1",
      "volume_name": "Volume1",
      "file_system": "btrfs",
      "hidden": 0,
      "recycle": 1,
      "ecryptfs": 0,
      "time_machine": 1,
      "is_mount": 1,
      "disabled": false
    }
  ],
  "code_num": 0
}
```

---

## POST /v2/timemachine/set_limit

Add authorized directory.

**Additional Header:**
- `X-Security-Code`: Security verification code

**Request Body:**
```json
{
  "status": 1,
  "folder_id": 1
}
```

| Field | Description |
|-------|-------------|
| `status` | 1=enable, 0=disable |
| `folder_id` | Shared folder ID |

---

## DELETE /v2/timemachine/del_limit

Remove authorized directory.

**Query Parameters:**
- `folder_id` (required): Folder ID to remove

**Note:** Cannot remove if only one authorized directory exists.

---

## GET /v2/timemachine/list

Get backup list.

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "path": "/Volume2/time/Mac的Mac mini.sparsebundle",
      "size": 103231583486,
      "time": 1777536455
    }
  ],
  "code_num": 0
}
```

---

## User Password Verification

Some operations require password verification.

**POST /v2/otp/verify_pwd**

Verify current user password.

**Request Body:**
```json
{
  "password": "<RSA-encrypted-password>"
}
```

Password must be RSA-encrypted using the public key from `X-Rsa-Token` header (obtained during session initialization).

**Response:**
```json
{
  "is_login": true,
  "code": true,
  "data": null,
  "code_num": 0
}
```

| `code` | Meaning |
|--------|---------|
| `true` | Password correct |
| `false` | Password incorrect |