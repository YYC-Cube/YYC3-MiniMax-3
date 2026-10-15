---
name: "tos-file-manager"
description: "Execute TOS file management operations, including file sharing and share link configuration (supports tnas.online/DDNS remote access), favorites, safe box (open/close/reset/permanently delete files), recycle bin, and remote folder mount/unmount. Use when users ask to share files/folders, create/edit/delete share links, manage favorites, open/close safe box, manage recycle bin, or mount/unmount remote folders on a TerraMaster NAS."
---


# tos-file-manager

Version: 1.004

## Description

Execute TOS file management operations, including file sharing and share link configuration (supports tnas.online/DDNS remote access), favorites, safe box (open/close/reset/permanently delete files), recycle bin, and remote folder mount/unmount.

## Feature List

This skill contains the following 5 independent features:

1. File Sharing and Share Link Configuration (supports tnas.online/DDNS remote access, editable)
2. Favorites Management
3. Safe Box Management (open/close/reset/permanently delete files)
4. Recycle Bin Management
5. Remote Folder Mount/Unmount

## Core Principles

1. Each feature is independent. When a user submits an instruction, only execute the full operations of the feature whose core objective description matches that instruction.
2. Once a feature is triggered, follow the execution steps described for that specific feature exactly as written, without automatically skipping or omitting any step, ensuring every step is fully executed.
3. Untriggered features must never participate in any operation, to avoid excessive token consumption.

## Feature Details

### Feature 1: File Sharing and Share Link Configuration (supports tnas.online/DDNS remote access)

#### 1. Core Objective

Generate share links for specified files or folders, with support for setting expiration, access password, access permissions, and other parameters. Supports remote access via tnas.online or DDNS (either service enabled is sufficient for remote link service). Also supports editing and modifying existing share links.

#### 2. Trigger Conditions (semantically similar user input accepted)

User explicitly requests the following or similar:

- Help me share this file/folder
- Generate a share link
- Set the share link expiration/password
- Cancel a share link
- Generate a share link accessible remotely
- Share a file via tnas.online
- Share a file via DDNS
- Modify/edit this share link
- Update the share link expiration/password/permissions

#### 3. Execution Steps (must execute each step, no omissions)

**Generate Share Link (including remote access configuration):**

① Check whether the target file/folder exists and obtain its full path

POST /fileManage/file/exist

Parameters: { path: Array } — path array

② Obtain current access permissions for the file/folder (whether the user has sharing permission)

GET /v2/fileManage/permission/res/acl

Parameters: { path } — file path

③ Parse user-specified share parameters:

GET /fileManage/GetShareMsg?id=${id}

Parameters: id — share item ID

- Expiration (permanent / 7 days / 30 days / custom days, default permanent)
- Start time (link start time / end time)
- Access password (whether password access is required)
- Access count limit (optional)

④ Automatically detect and configure remote access method:

GET /fileManage/GetRecentlyConf

Description: Returns share_list_v2, containing DDNS/Online/Local three remote access methods and their enable status, used for automatic detection of available methods

- Check whether tnas.online service is enabled
  - If enabled, obtain the current device's tnas.online link address (format: https://[device_id].tnas.online)
- Check whether DDNS service is configured and active
  - If enabled, obtain the current device's bound DDNS domain (format: https://[custom_domain])
- Remote access method determination rules:
  - If neither tnas.online nor DDNS is enabled: prompt the user to enable at least one service to use remote sharing, but local share links can still be generated
  - If only one is enabled: automatically use that service to generate remote share links
  - If both are enabled: prefer tnas.online (or as specified by the user)

⑤ Create share link and generate share code/link address

POST /fileManage/AddShareFile

⑥ Record share configuration to the share management list (including generated local access address and remote access address)

GET /fileManage/AddShareFile

⑦ Return the share link and related access information

**Edit/Modify Share Link:**

① Check whether the specified share link exists

GET /fileManage/GetShareMsg?id=

② Obtain current share configuration

GET /fileManage/GetShareMsg?id=

③ Parse parameters the user wants to modify:

- Expiration (update)
- Access password (add/modify/delete)
- Start time (modify/delete)
- Access count limit (modify)
- Remote access method (switch between tnas.online or DDNS, when both are available)

④ Re-detect remote access service status (if user does not specify remote method, auto-update based on detection results)

GET /fileManage/GetRecentlyConf

⑤ Save updated configuration

POST /fileManage/EditShare

⑥ Verify updated configuration has taken effect

GET /fileManage/GetShareMsg?id=${id}

⑦ Return updated share link information

**Cancel/Delete Share Link:**

① Check whether the specified share link exists

GET /fileManage/GetShareMsg?id=${id}

② Confirm cancellation of share: frontend confirmation

③ Delete share link configuration

POST /fileManage/share/del, parameters { ids: Array }

④ Invalidate the original share link: deletion means invalidation, the original link can no longer be accessed

⑤ Return cancellation result: /fileManage/share/del return value

#### 4. Remote Access Service Detection and Enable Rules

| Service Status | Remote Sharing Availability | Description |
|---------------|---------------------------|-------------|
| tnas.online enabled | ✅ Available | Automatically use tnas.online to generate remote link |
| DDNS enabled | ✅ Available | Automatically use DDNS domain to generate remote link |
| Both enabled | ✅ Available (switchable) | Default to tnas.online, user can specify DDNS |
| Neither enabled | ❌ Unavailable (local only) | Prompt user to enable at least one service, only generate local share link |

#### 5. Output Rules (output nothing else)

- Generation successful:

```
Share link generated successfully!
- Local access address: [local_ip_address]/[share_path]
- Remote access address: [remote_access_link] ([tnas.online/DDNS])
- Expiration: [expiration]
- Access password: [display if present, otherwise "None"]
- Access permissions: [permissions]
```

- Edit successful:

```
Share link edited successfully!
- Share ID: [share_id]
- Local access address: [local_ip_address]/[share_path]
- Remote access address: [remote_access_link] ([tnas.online/DDNS])
- Updated expiration: [expiration]
- Updated access password: [display if present]
- Updated access permissions: [permissions]
```

- Failure: Return "Step x execution failed: [failure reason]"

API details see [references/api-sharing.md](references/api-sharing.md)

### Feature 2: Favorites Management

#### 1. Core Objective

Add/remove favorites for files or folders, allowing users to quickly access frequently used content.

#### 2. Trigger Conditions (semantically similar user input accepted)

User explicitly requests the following or similar:

- Favorite this file/folder
- Add to favorites
- Remove from favorites
- View my favorites list

#### 3. Execution Steps (must execute each step, no omissions)

**Add to Favorites:**

① Check whether the target file/folder exists and obtain its full path

POST: /fileManage/file/exist

② Check whether the file/folder is already in favorites

GET: /fileManage/collect/list

③ Execute favorite operation, write path to favorites list

POST: /fileManage/AddCollect

④ Verify favorite was successfully added

GET: /fileManage/collect/list

⑤ Return favorite result

**Remove from Favorites:**

① Check whether the target file/folder exists in the favorites list

GET: /fileManage/collect/list

② Execute unfavorite operation

DELETE: /fileManage/DelCollect?paths={path}

③ Remove the path from the favorites list

④ Verify unfavorite operation completed

GET: /fileManage/collect/list

⑤ Return removal result

**View Favorites List:**

① Read the current user's favorites list configuration

GET: /fileManage/collect/list

② Iterate through files/folders in the favorites list

GET: /fileManage/collect/list

③ Check the current status of each favorited item (whether it exists / is accessible)

POST: /fileManage/file/exist

④ Return favorites list details

#### 4. Output Rules (output nothing else)

- Success: Return "Favorites [operation type] succeeded: [file/folder name]"
- View favorites: Return "Current favorites list: [list details]"
- Failure: Return "Step x execution failed: [failure reason]"

API details see [references/api-favorites.md](references/api-favorites.md)

### Feature 3: Safe Box Management (open/close/reset/permanently delete files)

#### 1. Core Objective

Manage TNAS safe box functionality, supporting open (unlock and mount), close (lock and unmount), reset safe box, and permanent deletion of files within the safe box (with secondary confirmation).

#### 2. Trigger Conditions (semantically similar user input accepted)

User explicitly requests the following or similar:

- Open safe box / Unlock safe box
- Close safe box / Lock safe box
- Reset safe box
- Delete files in the safe box / Permanently delete safe box files

#### 3. Execution Steps (must execute each step, no omissions)

**Open Safe Box (unlock/mount):**

① Check whether the target safe box exists

GET: /fileManage/GetSafeBoxConf

② Obtain the safe box encryption password (interactively obtained or read from secure storage)

Frontend interaction

③ Verify whether the safe box encryption password is correct

POST: /fileManage/OpenSafeBox

④ Execute unlock operation, mount the safe box as an accessible directory

POST: /fileManage/OpenSafeBox

⑤ Verify unlock success (check mount point is accessible)

GET: /fileManage/GetSafeBoxConf

⑥ Return safe box access path and status

> **Critical**: Password fields use `pass_word` (underscore), NOT `password`. Value must be RSA-encrypted (PKCS1v15 + base64) with TOS public key.
>
> **Note**: Safe box open/close status is bound to the API session (TMSESSNAME cookie). Opening the safe box via API only takes effect for the current API session — it does **not** unlock the safe box in the TOS web UI. To use the safe box in the web UI, the user must enter the password manually in the browser.

**Close Safe Box (lock/unmount):**

① Check whether the target safe box exists and its current status (whether already open)

GET: /fileManage/GetSafeBoxConf

② Check whether the safe box is currently in use (if file transfers are in progress, wait or prompt the user)

Frontend task center detection

③ Execute lock operation, unmount the safe box directory

POST: /fileManage/CloseSafeBox

④ Verify lock success (mount point is no longer accessible)

GET: /fileManage/GetSafeBoxConf

⑤ Return close result

**Permanently Delete Files in Safe Box:**

① Confirm the safe box is open (if not, execute open operation first)

Frontend status detection

② Confirm the target file/folder exists within the safe box

POST: /fileManage/file/exist

③ ⚠️ Secondary confirmation (must be performed):

- Output confirmation prompt: "⚠️ This operation will permanently delete [file/folder name] from the safe box. Deleted items cannot be recovered via the recycle bin. Do you confirm to continue?"
- Wait for explicit user confirmation (e.g., "confirm", "yes", "continue")
- If the user does not explicitly confirm or indicates cancellation, terminate the operation and return cancellation notice

④ Execute permanent deletion (skip recycle bin, direct deletion)

⑤ Verify deletion success

POST: /fileManage/file/exist

⑥ Return deletion result

**Reset Safe Box:**

> ⚠️ **This feature is strictly prohibited from performing any actual operations through this skill**

① Detect that the user is requesting to reset the safe box
② Prohibit execution of any reset, format, or other dangerous operations
③ Output the prompt text from the output rules below

#### 4. Output Rules (output nothing else)

- Open success: Return "Safe box opened successfully, [safe_box_name] has been unlocked and mounted to [access_path]"
- Open failure: Return "Step x execution failed: [failure reason]"
- Close success: Return "Safe box closed successfully, [safe_box_name] has been locked and unmounted"
- Close failure: Return "Step x execution failed: [failure reason]"
- Permanent delete success: Return "Permanently deleted [file/folder name] from the safe box. This operation is irreversible"
- Permanent delete cancelled: Return "Deletion operation cancelled, [file/folder name] was not deleted"
- Permanent delete failure: Return "Step x execution failed: [failure reason]"
- Reset safe box (⚠️ execution prohibited):

```
⚠️ Safe box reset operation carries the risk of permanent data loss!

To protect your data safety, do not execute safe box reset operations through this skill.

To reset the safe box, please go to the TOS web interface [Safe Box Management] page and complete the operation manually in the browser.
```

API details see [references/api-safebox.md](references/api-safebox.md)

### Feature 4: Recycle Bin Management

#### 1. Core Objective

Manage TNAS recycle bin functionality, including viewing recycle bin contents, restoring deleted files/folders, emptying the recycle bin, and other operations.

#### 2. Trigger Conditions (semantically similar user input accepted)

User explicitly requests the following or similar:

- View recycle bin
- Restore file/folder
- Empty recycle bin
- Recover deleted files
- Permanently delete files from the recycle bin

#### 3. Execution Steps (must execute each step, no omissions)

**View Recycle Bin Contents:**

① Confirm recycle bin functionality is enabled

GET: /fileManage/isEnableRecycle

② Scan recycle bin directory, obtain list of all deleted items

GET: /fileManage/recycle/list

③ Obtain original path, deletion time, file size, and other information for each item

GET: /fileManage/recycle/list return values

④ Return recycle bin content details

**Restore File/Folder:**

① Confirm the target item exists in the recycle bin

GET: /fileManage/recycle/list

② Check whether the original path is available (whether the target directory exists, whether there is write permission)

POST: /fileManage/file/exist

③ Execute restore operation, move file/folder back to original path

POST: /fileManage/restoreRecycle

④ Verify restore success (file integrity, original file attributes preserved)

POST: /fileManage/file/exist

⑤ Remove the item record from the recycle bin

⑥ Return restore result

**Batch Restore Operation:**

① Confirm multiple target items exist in the recycle bin

GET: /fileManage/recycle/list

② Check availability of each item's original path individually: frontend processing

③ Execute restore operations sequentially

POST: /fileManage/restoreRecycle

④ Output batch restore result summary

**Empty Recycle Bin:**

① Confirm there are items to empty in the recycle bin

GET: /fileManage/recycle/list

② ⚠️ Secondary confirmation for emptying operation (data will be unrecoverable):

- Output confirmation prompt: "⚠️ This operation will permanently empty all items in the recycle bin. Deleted items cannot be recovered. Do you confirm to continue?"
- Wait for explicit user confirmation
- If the user does not explicitly confirm, terminate the operation

③ Execute empty operation, permanently delete all items in the recycle bin

DELETE: /fileManage/clearRecycle?name={path}
or
DELETE: /fileManage/clearRecycleAll

④ Verify empty success

GET: /fileManage/recycle/list

⑤ Return empty result

**Permanently Delete Specified Items from Recycle Bin:**

① Confirm the target item exists in the recycle bin

GET: /fileManage/recycle/list

② ⚠️ Secondary confirmation for permanent deletion:

- Output confirmation prompt: "⚠️ This operation will permanently delete [file/folder name] from the recycle bin. Deleted items cannot be recovered. Do you confirm to continue?"
- Wait for explicit user confirmation
- If the user does not explicitly confirm, terminate the operation

③ Execute permanent deletion, remove the item from the recycle bin

④ Verify permanent deletion success

GET: /fileManage/recycle/list

⑤ Return deletion result

#### 4. Output Rules (output nothing else)

- Success: Return "Recycle bin [operation type] succeeded, [operation details]"
- View recycle bin: Return recycle bin item list (item name, original path, deletion time, size)
- Failure: Return "Step x execution failed: [failure reason]"

API details see [references/api-recycle.md](references/api-recycle.md) (to be verified)

### Feature 5: Remote Folder Mount/Unmount

#### 1. Core Objective

Mount remote folders (NFS/SMB/WebDAV protocols) to TNAS local directories, or unmount already mounted remote folders.

#### 2. Trigger Conditions (semantically similar user input accepted)

User explicitly requests the following or similar:

- Mount remote folder
- Connect to remote shared directory
- Unmount remote folder
- Mount NFS/SMB/WebDAV share
- Add remote folder connection

#### 3. Execution Steps (must execute each step, no omissions)

**Mount Remote Folder:**

① Parse user-provided connection parameters:

- Protocol type (NFS / SMB / WebDAV)
- Remote server address and port
- Remote share path/directory
- Local mount point path
- Authentication credentials (SMB/WebDAV require username and password; NFS may require client configuration)

② Verify network connectivity (with remote server)

- SMB: POST: /remotefolder/smb/dirs
- NFS: POST: /remotefolder/nfs/dirs
- WebDAV: POST: /remotefolder/cloud_disk/conn → GET: /remotefolder/cloud_disk/is_success

③ Verify authentication credential validity (if required)

④ Check whether the local mount point already exists and is not occupied

GET: /remotefolder/FolderEmpty

⑤ Execute mount command:

- (SMB/NFS) POST: /remotefolder/add
- (WebDAV/Cloud drive) POST: /remotefolder/cloud_disk/create

⑥ Verify mount success (check mount point is readable/writable)

GET: /remotefolder/list

⑦ Configure auto-mount (optional, add to fstab based on user needs): same as step ④

⑧ Return mount result and mount point information

**Unmount Remote Folder:**

① Confirm the local mount point exists and is currently mounted

GET: /remotefolder/{id}/attr

② Check whether any processes are using the mount point: frontend task center detection

③ Execute unmount command

PUT: /remotefolder/{id}/umount

④ Verify unmount success

GET: /remotefolder/{id}/attr

⑤ If auto-mount was configured, ask whether to remove from fstab

DELETE: /remotefolder/{id}

⑥ Return unmount result

**View Mounted Remote Folder List:**

① Execute mount command or read /proc/mounts

GET: /remotefolder/list

② Filter mounts by remote protocol type (nfs/cifs/davfs, etc.)

③ Return current list of mounted remote folders

#### 4. Output Rules (output nothing else)

- Success: Return "Remote folder [mount/unmount] succeeded, [protocol_type]: [remote_path] → [local_mount_point]"
- View list: Return mounted remote folder list (protocol, remote path, local mount point, status)
- Failure: Return "Step x execution failed: [failure reason]"

API details see [references/api-remote-folder.md](references/api-remote-folder.md) (to be verified)

---

## ⚠️ Skill Constraints (IMPORTANT! IMPORTANT! IMPORTANT!)

### I. Feature Execution Constraints

1. **Feature Independence**: Each feature is independent. When a user submits an instruction, only execute the full operations of the feature whose trigger conditions match that instruction.
2. **Step Completeness**: Once a feature is triggered, strictly follow the execution steps for that feature exactly as described, without skipping or omitting any step, ensuring every step is fully executed.
3. **Feature Isolation**: Untriggered features must never participate in any operation, to avoid excessive token consumption.

### II. Remote Sharing Service Dependency Constraints

4. **Remote Sharing Service Dependency**: The remote access methods in Feature 1 require the corresponding services to be enabled:
   - tnas.online: Requires TNAS.online service to be enabled in TOS
   - DDNS: Requires DDNS service to be configured and enabled in TOS
   - If neither service is enabled, only generate local share links and prompt the user to enable at least one service to use remote sharing functionality
   - If only one is enabled, automatically use that service; if both are enabled, default to tnas.online, user can specify DDNS
5. **Share Link Editing**: When editing a share link, the remote access address will be automatically updated based on the currently enabled services

### III. High-Risk Operation Protection Constraints

6. **Safe Box Security**:
   - Opening the safe box requires password verification; closing the safe box requires checking usage status
   - Permanent deletion of files within the safe box: must undergo secondary confirmation, deleted items are unrecoverable
   - **Reset Safe Box**: This is a high-risk operation, strictly prohibited from execution through this skill; must guide the user to perform it manually in the browser
7. **Recycle Bin Irreversibility**: Emptying the recycle bin and permanent deletion operations in Feature 4 are irreversible operations and must undergo secondary confirmation before execution.

### IV. Remote Operation Constraints

8. **Remote Mount Permissions**: When mounting remote folders in Feature 5, ensure TNAS has write permission to the local mount point and the remote server has corresponding access authorization.
9. **Protocol Differences**: NFS/SMB/WebDAV in Feature 5 are three independent mount paths. Execute the corresponding steps based on the user-specified protocol; do not perform any operations for unspecified protocols.

### V. High-Risk Operations Summary

| Operation Type | Feature | Risk Level | Execution Constraint |
|---------------|---------|------------|---------------------|
| Safe Box Reset | Feature 3 | 🔴 High Risk | **Execution prohibited**, must guide user to browser for manual operation |
| Permanent Delete in Safe Box | Feature 3 | 🟠 Medium-High Risk | Must undergo secondary confirmation, unrecoverable after deletion |
| Empty Recycle Bin | Feature 4 | 🟠 Medium-High Risk | Must undergo secondary confirmation, data unrecoverable |
| Permanent Delete in Recycle Bin | Feature 4 | 🟠 Medium-High Risk | Must undergo secondary confirmation, data unrecoverable |

### VI. Prohibited Operations Statement

> ⚠️ **The following operations are strictly prohibited from execution through this skill. Must guide users to perform them manually in the TOS web interface:**
>
> 1. **Safe Box Reset**: Carries risk of permanent data loss
> 2. Other high-risk operations involving system-level configuration reset or formatting