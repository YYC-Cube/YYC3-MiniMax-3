---
name: "tos-access-permissions"
description: "Manage TOS encrypted shared folders, protocol access settings (SMB/NFS/WebDAV), ACL permissions (tmacltool), AD domain connection, and LDAP server connection. Use this skill when users need to create/mount/unmount/delete encrypted shared folders, export encryption keys, configure SMB/NFS/WebDAV remote access for shared folders, set folder ACL permissions, or connect to an AD domain or LDAP server."
---


# TOS Access Permissions

Version: 1.001

## Core Principles

1. **Function Independence**: The 6 functions are independent. Only execute the function matching the user's request; untriggered functions must not be involved.
2. **Step Completeness**: Once triggered, all steps must be strictly executed in order. Do not skip or omit any step.
3. **Function Isolation**: Untriggered functions must never participate in operations to avoid excessive token consumption.
4. **Protocol Differences**: In Function 2, SMB/NFS/WebDAV are three independent configuration paths. Only execute the protocol specified by the user.
5. **High-Risk Protection**: Function 6 involves high-risk operations. These must receive explicit user confirmation before execution. Execution without confirmation is strictly prohibited.
6. **ACL Tool Dependency**: All ACL operations in Function 3 must be executed via tmacltool. Before operating, verify command format via `tmacltool help`.

## Function 1: Encrypted Shared Folder Management

**Core Objective**: Perform create, mount, unmount, and delete operations on encrypted shared folders.

**Trigger Conditions**: User requests to create/mount/unmount/delete an encrypted shared folder.

### Create Encrypted Shared Folder

1. Check storage pool available space → `GET /v2/storage/list/volume?type=brief`
2. Verify folder name does not already exist → `GET /v2/folder/check/{name}`
3. **Check domain/LDAP connection status** → `GET /v2/domain/is_connect`
   - `data=0`: Not connected to any domain; no additional domain user permission configuration needed; proceed to next step
   - `data=1`: Joined to AD domain; after creation, configure ACL permissions for domain users/groups (enter Function 3)
   - `data=2`: Connected to LDAP server; after creation, configure ACL permissions for LDAP users/groups (enter Function 3)
   - If already joined to a domain, prompt the user whether domain users/groups need access permissions for this folder
4. Set encryption password and key management policy → Confirm `ecryptfs=1`, prepare RSA-encrypted `pass_phrase`
5. Create encrypted shared folder → `POST /v2/folder/create` (ecryptfs=1, pass_phrase=RSA-encrypted password)
6. Verify creation success and return path → `GET /v2/folder/list`

### Mount Encrypted Shared Folder

1. Query target encrypted shared folder status → `GET /v2/folder/list`, check `is_load` field
2. Verify encryption key/password → Confirm user-provided password (RSA-encrypted) or key file
3. Execute mount operation → `POST /v2/folder/EcryptfsMount` (path + pwd/file)
4. Verify post-mount access permissions → Confirm `is_load=true`
5. Return mount result → `GET /v2/folder/list`

### Unmount Encrypted Shared Folder

1. Check if any processes are using the folder
2. Execute unmount operation → `POST /v2/folder/EcryptfsUmount` (path)
3. Verify unmount status → Confirm successful response
4. Return unmount result → `GET /v2/folder/list`, confirm `is_load=false`

### Export Encryption Key

1. Confirm folder is mounted → `GET /v2/folder/list` (key export requires `is_load=true`)
2. Guide user to TOS web UI:
   > 📌 Please go to TOS web UI: **Access Permissions > Encrypted Shared Folders > Right-click menu > Export Key**, and follow the on-screen instructions to enter the encryption password and export the key file.

### Delete Encrypted Shared Folder

1. Confirm folder is unmounted → `GET /v2/folder/list` (when not unmounted, `is_load=true`, the delete button is greyed out; must unmount first)
2. Confirm deletion intent → Obtain explicit user confirmation
3. Delete encrypted shared folder and associated configuration → `DELETE /v2/folder/res/{id}`
4. Verify deletion success → `GET /v2/folder/list`

### Output Rules

- Success: `Encrypted shared folder [operation type] succeeded: [folder name]`
- Failure: `Step x execution failed: [failure reason]`

### API Details

See [references/api-encrypted-folder.md](references/api-encrypted-folder.md)

## Function 2: Shared Folder Protocol Access Settings

**Core Objective**: Enable and configure SMB, NFS, and WebDAV remote access for specified shared folders.

**Trigger Conditions**: User requests to enable SMB/NFS/WebDAV access for a folder or configure sharing protocols.

### SMB Protocol Configuration

1. Verify target shared folder exists → `GET /v2/folder/check/{name}`
2. Check SMB service status (start if not running) → `GET /folder/GetSmbAclList?folder_id={id}`
3. Configure SMB sharing parameters (share name, path, permissions) → `GET /folder/GetSmbAclList?folder_id={id}`
4. Set SMB access permissions → `POST /v2/folder/SetSmbAcl` (create rule) or `POST /folder/UpdateSmbAcl` (update rule)
5. Restart SMB service to apply configuration → `POST /v2/folder/SetSmbAcl`
6. Verify SMB share accessibility → `/fileManage/checkNFSSMBFolder` + `/fileManage/checkSmbUser`

### NFS Protocol Configuration

1. Verify target shared folder exists → `GET /v2/folder/check/{name}`
2. Check NFS service status → `GET /folder/GetNFSAclList?folder_id={id}`
3. Configure NFS export rules → `GET /folder/GetNFSAclList?folder_id={id}`
4. Set NFS access parameters → `POST /v2/folder/SetNFSAcl`
5. Export NFS share and refresh → `POST /v2/folder/UpdateNFSAcl`
6. Verify NFS share accessibility → `/fileManage/checkNFSSMBFolder`

### WebDAV Protocol Configuration

1. Verify target shared folder exists → `GET /v2/folder/check/{name}`
2. Check WebDAV service status → `GET /folder/GetWebDavAclList?folder_id={id}`
3. Configure WebDAV share path and access port → `GET /folder/GetWebDavAclList?folder_id={id}`
4. Set WebDAV access authentication method → `POST /v2/folder/SetWebDavAcl`
5. Restart WebDAV service → `POST /v2/folder/SetWebDavAcl`
6. Verify WebDAV remote accessibility → `POST /v2/folder/SetWebDavAcl`

### Output Rules

- Success: `[SMB/NFS/WebDAV] protocol configuration succeeded, shared folder: [folder name] is now accessible remotely`
- Failure: `Step x execution failed: [failure reason]`

### API Details

See [references/api-protocol-access.md](references/api-protocol-access.md)

## Function 3: Shared Folder ACL Permission Settings

**Core Objective**: Configure ACL access control permissions for users/groups on specified shared folders, executed via tmacltool.

**Trigger Conditions**: User requests to set folder permissions, assign user/group access permissions, modify ACL, or configure folder permissions.

### Prerequisites

1. Execute `tmacltool help` to verify tool availability and parameter format

### Execution Steps

1. Verify target shared folder exists and obtain its full path
2. Execute `tmacltool get <path>` to retrieve current ACL permission configuration
3. Parse user-specified permission rules (user/group + permission type)
4. Construct and execute ACL change command per tmacltool command format
5. Execute `tmacltool get <path>` to verify permission changes have taken effect
6. Return current ACL configuration result

### tmacltool Command Reference

**Command Format**: `tmacltool <subcommand> <path> [ACL Entry]`

**Subcommands**:

| Subcommand | Description | Example |
|------------|-------------|---------|
| `get <path>` | Retrieve ACL permissions | `tmacltool get /Volume2/myfolder` |
| `add <path> <ACL Entry>` | Add ACL entry | `tmacltool add /Volume2/myfolder user:root:allow:rwxpdDaARWc--:fd--` |
| `del <path> <ACL Entry>` | Delete ACL entry | `tmacltool del /Volume2/myfolder user:root:allow:rwxpdDaARWc--:fd--` |
| `modify <path> <ACL Entry>` | Modify specified ACL entry | `tmacltool modify /Volume2/myfolder user:root:allow:r-x---a-R-c--:fd--` |
| `replace <path> <ACL Entry>` | Replace all ACL entries | `tmacltool replace /Volume2/myfolder user:root:allow:rwxpdDaARWc--:fd--` |
| `clear <path>` | Clear all ACL entries | `tmacltool clear /Volume2/myfolder` |
| `status <path>` | Get ACL archive status | `tmacltool status /Volume2/myfolder` |
| `get-perm <path> <UID>` | Get user's maximum permissions | `tmacltool get-perm /Volume2/myfolder 0` |
| `enable <path> <option>` | Enable ACL archive option | `tmacltool enable /Volume2/myfolder is_inherit` |
| `disable <path> <option>` | Disable ACL archive option | `tmacltool disable /Volume2/myfolder is_inherit` |
| `enable-inheritance <path>` | Add inheritance permissions | `tmacltool enable-inheritance /Volume2/myfolder` |
| `disable-inheritance <path>` | Remove all inheritance permissions | `tmacltool disable-inheritance /Volume2/myfolder` |
| `explicit-inheritance <path>` | Convert inherited permissions to explicit | `tmacltool explicit-inheritance /Volume2/myfolder` |

**ACL Entry Format**: `[user|group]:name:[allow|deny]:permission_string:inheritance_mode`

Example: `user:root:allow:r-x---a-R-c--:fd--`

**Permission String (13 characters, each position corresponds to a permission, use `-` placeholder to deny)**:

| Position | Character | Description |
|----------|-----------|-------------|
| 1 | r | Read data |
| 2 | w | Write data (create files) |
| 3 | x | Execute |
| 4 | p | Append data (create directories) |
| 5 | d | Delete |
| 6 | D | Delete child items (directories only) |
| 7 | a | Read attributes |
| 8 | A | Write attributes |
| 9 | R | Read extended attributes |
| 10 | W | Write extended attributes |
| 11 | c | Read ACL |
| 12 | C | Write ACL |
| 13 | o | Take ownership |

> ⚠️ Note: In actual output, position 5 (d/Delete) and position 6 (D/Delete child items) are easily confused. Always verify against the actual `tmacltool get` output.

**Common Permission Combinations**:

| Scenario | Permission String |
|----------|-------------------|
| Read-only | `r-x---a-R-c--` |
| Read-write | `rwxpdDaARWc--` |
| Full control | `rwxpdDaARWcCo` |
| Deny access | deny entry + corresponding permissions |

**Inheritance Mode (4 characters)**:

| Position | Character | Description |
|----------|-----------|-------------|
| 1 | f | File inheritance |
| 2 | d | Directory inheritance |
| 3 | i | Inherit only (do not apply to self) |
| 4 | n | No propagation |

Common inheritance modes: `fd--` (inherit to files and directories), `fdi-` (inherit only, not applied to self), `fd-n` (inherit but do not propagate to children)

**Special Principal**: `everyone:*` represents all users

> ⚠️ **Important**: The TOS permission system **does not compute everyone's permissions**. ACL entries set with `everyone:*` do not take effect in TOS and are not accumulated into a user's final permissions. Therefore, **using `everyone:*` for permission authorization is prohibited**. Instead, assign permissions to specific users/groups individually.

**ACL Archive Options** (for enable/disable):
- `is_inherit` — Whether to enable inheritance
- `is_exist` — Whether ACL archive exists
- `is_support` — Whether ACL archive is supported

### Output Rules

- Success: `ACL permission configuration succeeded, [folder name] current permissions: [tmacltool get output]`
- Failure: `Step x execution failed: [failure reason]`

## Function 4: AD Domain Connection

**Core Objective**: Connect the TNAS device to an Active Directory domain.

**Trigger Conditions**: User requests to connect to an AD domain, join a Windows domain, or configure Active Directory connection.

### Execution Steps

1. Verify network connectivity → `GET /domain/NetworkDetection?dns={dns}&test=false` (data: 0=normal, 1=IP format error, 2=port 389 unreachable)
2. Verify DNS resolution → `GET /domain/DnsRecordDetection?domain={domain}&dns={dns}&test=false` (data: 0=normal, 1=IP format error, 2=DNS server invalid, 3=network unreachable)
3. Obtain domain administrator credentials → Confirm username and password with user
4. Configure DNS suffix and domain name → `GET /domain/config/ads`
5. Execute domain join operation → `POST /domain/DomainServiceDetection`
   - ⚠️ **Required key fields**: `connection_status=1` (join domain), `domainPassword` (plaintext password), `regist_dns` (network interface e.g. "eth0")
   - The `password` field is the RSA-encrypted password, `domainPassword` is the plaintext password. **Both must be provided**
   - `connection_status=0` only detects domain service availability and **does not actually join the domain**
6. Verify domain trust relationship → `GET /domain/GetDirectory?type={type}&test={test}` (data: 0=normal, -1~6 various errors)
7. Sync domain users/groups → `GET /domain/GetUpdateStatus` (data: 200=sync successful, other values indicate various errors)
8. Return domain connection status → `GET /domain/is_connect` (data: 0=not connected, 1=AD domain, 2=LDAP domain)

### DomainServiceDetection Return Codes

data: 0=normal, 1=configuration save error, 2=DNS setup error, 3=SMB workgroup setup error, 4=domain service startup failed, 5=user authentication failed, 6=NetBIOS retrieval failed, 7=service stop failed, 8=system busy, 9=DC IP configuration error, 10=DC IP connection failed, 11=NetBIOS verification failed, 12=NetBIOS does not exist

### Disconnect AD Domain

1. Confirm current domain connection status → `GET /domain/is_connect` (data=1 or 2 indicates connected)
2. Execute domain leave operation → `POST /domain/OutDomain` (request body `{}`, response data=true indicates success)
3. Poll leave status → `GET /domain/GetOutDomainStatus` (data=0 completed, data=1 in progress)
4. Confirm disconnected → `GET /domain/is_connect` (data=0 indicates not connected)

- ⚠️ After executing `OutDomain`, TOSDaemon may restart services; existing sessions will become invalid and re-login is required

### Output Rules

- Join success: `AD domain connected successfully, current domain: [domain name], synced [user count] domain users`
- Disconnect success: `AD domain disconnected`
- Failure: `Step x execution failed: [failure reason]`

### API Details

See [references/api-domain.md](references/api-domain.md)

## Function 5: LDAP Server Connection

**Core Objective**: Connect the TNAS device to an LDAP server.

**Trigger Conditions**: User requests to connect to an LDAP server, configure LDAP authentication, or connect to OpenLDAP.

### Execution Steps

1. Verify network connectivity → `GET /domain/NetworkDetection?dns={dns}&test=false`
2. Verify LDAP service port accessibility (389/636) → same as above
3. Obtain LDAP bind credentials (Bind DN + password) → Confirm with user
4. Configure LDAP Base DN and search scope → `GET /domain/config/ldap`
5. Test LDAP user authentication → `POST /domain/LdapServiceDetection` (includes ldap_server_location, base_dn, username, password, etc.)
6. Configure LDAP mapping attributes → `GET /domain/config/ldap`
7. Enable LDAP service → `GET /domain/GetDirectory`
8. Sync LDAP users/groups → `GET /domain/GetUpdateStatus`
9. Return LDAP connection status → `GET /domain/is_connect`

### LdapServiceDetection Return Codes

data: 0=normal, 1=configuration save error, 2=hosts setup failed, 3=SMB workgroup setup error, 4=domain service startup failed, 5=user authentication failed

### Output Rules

- Success: `LDAP server connected successfully, server: [LDAP address], Base DN: [Base DN], synced [user count] LDAP users`
- Failure: `Step x execution failed: [failure reason]`

### API Details

See [references/api-domain.md](references/api-domain.md)

## Function 6: High-Risk Operations

**Core Objective**: Execute high-risk operations such as deleting shared folders or deleting encryption keys. Must receive explicit user confirmation before execution.

**Trigger Conditions**: User requests to delete a shared folder (physical deletion) or delete an encryption key and discard data.

### Execution Steps

1. Issue risk warning to user, clearly stating consequences:
   - Delete shared folder: **All data in this folder will be permanently deleted and cannot be recovered**
   - Delete encryption key: **Encrypted data will become permanently inaccessible and cannot be recovered**
2. Require explicit user confirmation (must receive an affirmative response such as "confirm"/"agree"/"yes"):
   - Prompt: `⚠️ You are about to execute a high-risk operation: [operation description]. This operation is irreversible and data will be permanently lost. Do you confirm execution?`
   - User confirms → Proceed to step 3
   - User declines or does not explicitly confirm → Abort operation, return `Operation cancelled`
3. Execute high-risk operation:
   - **Delete shared folder** (must confirm unmounted first):
     1. Confirm folder is unmounted → `GET /v2/folder/list` (when not unmounted, is_load=true; must unmount first)
     2. Obtain RSA public key → From the `X-Rsa-Token` header of any `/v2/` response
     3. RSA-encrypt current user password → Encrypt with public key using PKCS1v15, then base64 encode
     4. Execute deletion → `DELETE /v2/folder/res/{id}`, with `X-CurPass-Token` request header (value is RSA-encrypted password)
     5. Verify deletion success → `GET /v2/folder/list`
   - **Delete encryption key and discard data**:
     1. Confirm encrypted folder is unmounted → `GET /v2/folder/list`
     2. Obtain RSA public key and encrypt password (same as above)
     3. Execute deletion → `DELETE /v2/folder/res/{id}`, with `X-CurPass-Token` request header
     4. Verify deletion success → `GET /v2/folder/list`
4. Return operation result

### Output Rules

- Confirmed execution success: `High-risk operation [operation type] executed successfully: [folder name] deleted`
- User cancelled: `Operation cancelled, [folder name] is unaffected`
- Failure: `Step x execution failed: [failure reason]` (e.g., folder not unmounted, cannot delete)

> ⚠️ **Important**: Without explicit user confirmation, executing any high-risk operation is strictly prohibited. Even when trigger conditions are met, steps 1-2 of the confirmation process must be completed before step 3 can be executed.