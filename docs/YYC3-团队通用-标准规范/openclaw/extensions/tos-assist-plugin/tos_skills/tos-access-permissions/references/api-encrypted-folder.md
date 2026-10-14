# Encrypted Shared Folder Management API Reference

## 1. Check Storage Pool Available Space

- **Path**: `/v2/storage/list/volume?type=brief`
- **Method**: GET
- **Purpose**: Check storage pool for available space before creating an encrypted shared folder

## 2. Check if Folder Name Exists

- **Path**: `/v2/folder/check/{name}`
- **Method**: GET
- **Path Parameter**: `name` — Folder name (required)
- **Response `data`**: `true`=name already exists, `false`=name available

## 3. Check Domain/LDAP Connection Status

- **Path**: `/v2/domain/is_connect`
- **Method**: GET
- **Purpose**: Before creating a shared folder, determine whether the device has joined a domain or connected to LDAP, to decide if ACL permissions need to be configured for domain users
- **Response `data`**:
  - `0` — Not connected to any domain
  - `1` — Joined to AD domain
  - `2` — Connected to LDAP server

## 3. Get Shared Folder List

- **Path**: `/v2/folder/list`
- **Method**: GET
- **Response `data[]`** fields:

| Field | Type | Description |
|-------|------|-------------|
| folder_id | integer | Folder ID |
| folder_name | string | Directory name |
| mnt_path | string | Absolute mount path |
| owner | string | Owner |
| volume_name | string | Volume name |
| description | string | Description |
| type | string | LFS/ISO |
| device | string | @disk/@usb/@iscsi/@iso |
| ecryptfs | integer | 1=encrypted, 0=not encrypted |
| is_load | boolean | Whether mounted (only applicable to encrypted folders) |
| hidden | integer | 0=no, 1=yes |
| disabled | boolean | Whether renaming is disabled |
| quota | integer | Quota (bytes) |
| recycle | integer | 0=no, 1=yes, 2=admin only |
| rsync | integer | 0=no, 1=yes |
| time_machine | integer | 0=disabled, 1=enabled |
| extend | string | Extended information |
| op_lock | integer | 0=unlocked, 1=locked |
| save_days | integer | Recycle bin retention days |

## 4. Create Shared Folder

- **Path**: `/v2/folder/create`
- **Method**: POST
- **Request Body (JSON)**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_name | string | ✅ | Folder name |
| mnt_path | string | ✅ | Mount path (absolute) |
| device | string | ✅ | Storage location |
| description | string | ✅ | Description |
| ecryptfs | integer | ✅ | 0=not encrypted, 1=encrypted |
| pass_phrase | string | Conditional | Encryption password (required when ecryptfs=1, must be RSA-encrypted) |
| recycle | integer | ✅ | 0=disabled, 1=enabled, 2=admin only |
| hidden | integer | ✅ | 0=not hidden, 1=hidden |
| quota_flag | integer | ✅ | -1=disabled, 0=off, 1=enabled |
| quota | integer | ✅ | Quota capacity |
| quota_unit | integer | ✅ | 1=TB, 2=GB, 3=MB |
| acls | array | ❌ | Access permission list |

**acls item structure**:
- `type`: "user"/"group"
- `name`: User/group name
- `acl_type`: "0"=standard permission, "1"=custom
- `permission`: Permission string such as "rwx"

- **Response `data`**: `true`=success, `false`=failure

## 5. Mount Encrypted Folder

- **Path**: `/v2/folder/EcryptfsMount`
- **Method**: POST
- **Request Body (Form)**:

| Field | Required | Description |
|-------|----------|-------------|
| path | ✅ | Absolute path of encrypted folder |
| pwd | One of two | RSA-encrypted password |
| file | One of two | Key file |

- **Response `data`**: `true`=mount succeeded, `false`=mount failed

## 6. Unmount Encrypted Folder

- **Path**: `/v2/folder/EcryptfsUmount`
- **Method**: POST
- **Request Body (Form)**:

| Field | Required | Description |
|-------|----------|-------------|
| path | ✅ | Absolute path of encrypted folder |

- **Response `data`**: `true`=unmount succeeded, `false`=unmount failed

## 7. Delete Shared Folder

- **Path**: `/v2/folder/res/{id}`
- **Method**: DELETE
- **Path Parameter**: `id` — Folder ID (required)
- **Required Request Headers**:
  - `X-Csrf-Token` — CSRF token
  - `X-CurPass-Token` — RSA-encrypted current user password (PKCS1v15 + base64 encoded, encrypted with the RSA public key obtained during login)
- **Note**: Encrypted folders must be unmounted (is_load=false) before deletion
- **Response `data`**: `true`=deletion succeeded, `false`=deletion failed
- **Error Codes**:
  - `code_num=19` — Missing `X-CurPass-Token` request header
  - `code_num=17` — Invalid `X-CurPass-Token` value (RSA decryption failed)
