# Shared Folder Protocol Access API Reference

## SMB Protocol

### Check if Folder Name Exists

- **Path**: `GET /v2/folder/check/{name}`
- Response `data`: `true`=already exists, `false`=available

### Get SMB ACL List

- **Path**: `GET /v2/folder/GetSmbAclList?folder_id={id}`
- **Purpose**: Check SMB service status and retrieve SMB access control configuration for a specified folder
- **Response `data`** key fields:

| Field | Type | Description |
|-------|------|-------------|
| status | number | 1=enabled, 2=disabled |
| work_group | string | Workgroup |
| win_server_name | string | Windows server name |
| max_protocol | number | Max protocol: 1=NT1, 2=SMB2, 3=SMB2_10, 4=SMB3 |
| min_protocol | number | Min protocol: same as above |
| smb_ports | number | SMB port |
| encrypt_passwords | number | Transport encryption: 1=required, 2=off, 3=auto |
| win_access_address | string | Windows access address (\\\\IP) |
| mac_access_address | string | Mac access address (smb://IP) |

### Set SMB ACL

- **Path**: `POST /v2/folder/SetSmbAcl`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_id | integer | ✅ | Shared folder ID |
| host | string | ✅ | Allowed access IP or IP range |
| permission | integer | ✅ | 0=deny, 1=allow |

### Delete SMB ACL

- **Path**: `DELETE /v2/folder/DelSmbAcl?hash={hash}`
- **Description**: Delete an SMB ACL rule by its configuration hash. After deletion, the corresponding client will no longer be able to access this shared folder via SMB.
- **Query Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| hash | string | ✅ | Configuration hash of the SMB ACL rule to delete |

- **Response `data`**: `true`=deleted successfully, `false`=deletion failed

### Update SMB ACL

- **Path**: `POST /v2/folder/UpdateSmbAcl`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_id | integer | ✅ | Shared folder ID |
| hash | string | ✅ | Configuration hash |
| host | string | ✅ | IP or IP range |
| permission | integer | ✅ | 0=deny, 1=allow |

## NFS Protocol

### Get NFS ACL List

- **Path**: `GET /v2/folder/GetNFSAclList?folder_id={id}`
- **Response `data[]`** fields:

| Field | Type | Description |
|-------|------|-------------|
| folder_id | integer | Shared folder ID |
| hash | string | Configuration hash |
| host | string | Client host address |
| permission | integer | 1=read-only, 2=read-write |
| async | boolean | Enable async I/O |
| is_mount | boolean | Allow access to mounted sub-folders (crossmnt) |
| privileged_port | boolean | Allow non-privileged ports (insecure) |
| security | string | Security authentication (sys,krb5,krb5i,krb5p) |
| squash | integer | 0=no mapping, 2=map root to guest, 3=map all to admin, 4=map all to guest. **squash=1 is prohibited**; default is 0 (no mapping) |

### Set NFS ACL

- **Path**: `POST /v2/folder/SetNFSAcl`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_id | integer | ✅ | Shared folder ID |
| host | string | ✅ | IP or CIDR |
| permission | integer | ✅ | 0=deny, 1=read-only, 2=read-write |
| squash | integer | ✅ | User mapping mode (0=no mapping, 2=map root to guest, 3=map all to admin, 4=map all to guest). **squash=1 is prohibited**; default is 0 (no mapping) |
| security | string | ✅ | Security mode |
| async | boolean | ✅ | Async mode |
| is_mount | boolean | ✅ | crossmnt |
| privileged_port | boolean | ✅ | insecure |

### Update NFS ACL

- **Path**: `POST /v2/folder/UpdateNFSAcl`
- **Request Body**: Similar to SetNFSAcl, with additional `hash` field required

### Delete NFS ACL

- **Path**: `DELETE /v2/folder/DelNFSAcl?hash={hash}`
- **Description**: Delete an NFS ACL rule by its configuration hash. After deletion, the corresponding client will no longer be able to access this shared folder via NFS.
- **Query Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| hash | string | ✅ | Configuration hash of the NFS ACL rule to delete |

- **Response `data`**: `true`=deleted successfully, `false`=deletion failed

## WebDAV Protocol

### Get WebDAV ACL List

- **Path**: `GET /v2/folder/GetWebDavAclList?folder_id={id}`
- **Response `data[]`** fields:

| Field | Type | Description |
|-------|------|-------------|
| folder_id | integer | Shared folder ID |
| hash | string | Configuration hash |
| host | string | Client host address |
| permission | integer | 0=deny, 1=read-only, 2=read-write |

### Set WebDAV ACL

- **Path**: `POST /v2/folder/SetWebDavAcl`
- **Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_id | integer | ✅ | Shared folder ID |
| host | string | ✅ | Allowed access IP or hostname |
| permission | integer | ✅ | 0=deny, 1=allow |

### Delete WebDAV ACL

- **Path**: `DELETE /v2/folder/DelWebDavAcl?hash={hash}`
- **Description**: Delete a WebDAV ACL rule by its configuration hash. After deletion, the corresponding client will no longer be able to access this shared folder via WebDAV.
- **Query Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| hash | string | ✅ | Configuration hash of the WebDAV ACL rule to delete |

- **Response `data`**: `true`=deleted successfully, `false`=deletion failed

> ⚠️ **Note**: The `permission` values for SetWebDavAcl (0=deny, 1=allow) differ in meaning from the `permission` values returned by GetWebDavAclList (0=deny, 1=read-only, 2=read-write). When setting, only use 0 or 1.
