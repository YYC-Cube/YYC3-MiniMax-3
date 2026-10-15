---
name: "tos-backup-center"
description: "Manage TOS (Terramaster OS) backup operations including rsync backup tasks, filesystem snapshots, and Time Machine backup authorization. Use when users request operations on backup center features such as creating/modifying/deleting rsync tasks, managing BTRFS snapshots (enable/query/delete/take/lock/unlock), or configuring Time Machine authorized directories. Triggers on terms like \"rsync backup\", \"snapshot\", \"Time Machine\", \"Time Machine\", \"snapshot\", \"backup task\" in the context of TOS/NAS management."
---


# TOS Backup Center

Manage backup operations on Terramaster TOS (NAS) systems. This skill runs locally on the NAS and requires authentication.

## Authentication

**Critical:** This skill requires TOS admin credentials.

1. **First run**: Skill will ask for NAS admin username and password
2. **Credentials saved**: Stored securely for subsequent operations
3. **Auto-login**: Skill handles session management automatically

### NAS URL Auto-Discovery

Skill attempts these local endpoints in order:
- `http://127.0.0.1:8181`
- `https://127.0.0.1:5443`
- `http://localhost:8181`
- `https://localhost:5443`

If unavailable, skill reads nginx config from `/etc/nginx/` to discover valid ports.

### Session Initialization

Before any API call:
1. `GET {NAS_URL}/tos/` - Obtain CSRF token and RSA token
2. `POST {NAS_URL}/v2/login` - Authenticate with credentials
3. Maintain Cookie Jar for all subsequent requests

**Never ask user for Cookie, X-Csrf-Token, or X-Security-Code manually.**

---

## Feature 1: Rsync Backup Management

Manage rsync backup task lifecycle: create, modify, delete, start/stop, query.

### Default Configuration

| Setting | Default |
|---------|---------|
| Task Name | `sync-backup-01` |
| Backup Mode | Differential (differential) |
| Compression | Disabled |
| Pause Network Services | Disabled |
| Sparse File Backup | Disabled |
| Schedule | Disabled |

### Operations

#### 1.1 Query Rsync Tasks

**Triggers:** "query rsync tasks", "show all rsync backups", "view rsync tasks"

**Steps:**
1. Determine single task or all tasks
2. If single task, verify task exists via `/v2/rsync/state`
3. Get task config via `/v2/rsync/task/{task_name}`
4. Return task list with status

**Output:** Task list with configuration and status

#### 1.2 Create Rsync Task

**Triggers:** "create rsync task", "new rsync backup", "create rsync backup"

**Steps:**
1. Test connection via `/v2/rsync/test` (host, port, username, password)
2. Set source/destination paths
3. Apply default config if user doesn't specify
4. Summarize config and request confirmation
5. Create via `/v2/rsync/create`
6. Ask if immediate execution needed

**Output:** "rsync backup task [{name}] created successfully"

#### 1.3 Edit Rsync Task

**Triggers:** "modify rsync task", "edit rsync config", "edit rsync task"

**Editable fields:** source path, destination, immediate backup, schedule

**Non-editable fields:** task name, backup mode, compression, network_monopolize, sparse

**Steps:**
1. Verify task exists
2. Get current config
3. Validate editable fields
4. Update via `/v2/rsync/create`

**Output:** "rsync backup task [{name}] updated successfully"

#### 1.4 Start/Stop Rsync Task

**Triggers:** "start rsync task", "stop rsync backup", "enable/stop rsync"

**Steps:**
1. Verify task exists
2. Get current status
3. Execute via `/v2/rsync/service` with `action: "immediately"` or `"stop"`

**Output:** "rsync backup task [{name}] started/stopped"

#### 1.5 Delete Rsync Task

**Triggers:** "delete rsync task", "remove rsync backup", "delete rsync task"

**Steps:**
1. Verify task exists
2. Check if running (stop first if needed)
3. Delete via `DELETE /v2/rsync/task/{task_name}`

**Output:** "rsync backup task [{name}] deleted successfully"

---

## Feature 2: Filesystem Snapshot Management

Manage BTRFS snapshots: enable, query, delete, clear, take, restore, lock/unlock.

### Default Configuration

| Setting | Default | Valid Range |
|---------|---------|-------------|
| Snapshot Enabled | true | true/false |
| Max Snapshots | 30 | **1-1024** (validate before API call) |
| Retention Policy | Delete oldest | strategy=1 (delete oldest), strategy=2 (stop creating) |
| Schedule | System default | - |

**Important:** `max_quantity` must be between **1 and 1024**. Validate user input before calling API to avoid unnecessary failed requests.

### Operations

#### 2.1 Enable Filesystem Snapshot

**Triggers:** "enable snapshot", "turn on snapshots", "enable snapshot"

**Steps:**
1. Check BTRFS volumes via `/v2/snapShoot/GetBtrfsVolume`
2. Check current status via `/v2/snapShoot/GetSnapShootConf`
3. If disabled, apply defaults
4. Configure via `/v2/snapShoot/SetSnapShootConf`
5. Request confirmation before enabling

**Output:** "Filesystem snapshot enabled with default configuration"

#### 2.2 Query Snapshot List

**Triggers:** "show snapshots", "list snapshots", "query snapshot"

**Steps:**
1. Get all BTRFS volumes
2. If volume specified, verify exists
3. Get snapshots via `/v2/snapShoot/GetVolumeSnapShoot`
4. Return table: name, time, status, lock state

**Output:** Snapshot table with columns: Name, Created, Status, Locked

#### 2.3 Delete Snapshot

**Triggers:** "delete snapshot", "remove snapshot", "delete snapshot"

**Steps:**
1. Get snapshot list
2. Match by name, time, or range
3. Check lock status (locked snapshots cannot be deleted)
4. Delete via `/v2/snapShoot/DelSnapShot`

**Output:** "Deleted [{count}] snapshot(s)"

#### 2.4 Clear All Snapshots

**Triggers:** "clear all snapshots", "delete all snapshots", "clear snapshot"

**Steps:**
1. Verify volume exists
2. Get all snapshots
3. Check for locked snapshots (prompt user to unlock or skip)
4. Clear via `/v2/snapShoot/DelAllSnapShot`

**Output:** "Cleared all snapshots on [{volume}]"

#### 2.5 Take Snapshot Manually

**Triggers:** "take snapshot", "create snapshot now", "take snapshot manually"

**Steps:**
1. Verify volume exists
2. Check snapshot feature enabled
3. Take via `/v2/snapShoot/TakeSnapshot`

**Output:** "Snapshot created: [{name}], [{time}]"

#### 2.6 Restore Snapshot

**Triggers:** "restore snapshot", "rollback snapshot", "restore snapshot"

**Output:** "This operation involves data recovery with potential data loss risks. For your data safety, this operation is not supported via AI assistant. Please use TOS web interface: Backup Center > Filesystem Snapshot."

#### 2.7 Lock/Unlock Snapshot

**Triggers:** "lock snapshot", "unlock snapshot", "lock/unlock snapshot"

**Steps:**
1. Get snapshot list
2. Match target snapshot
3. Execute via `/v2/snapShoot/LockSnapShot`

**Output:** "Snapshot [{name}] locked/unlocked"

---

## Feature 3: Time Machine Backup Management

Manage Time Machine (Time Machine) backup authorization.

### Operations

#### 3.1 Query Time Machine Status

**Triggers:** "check time machine status", "show time machine", "query time machine"

**Steps:**
1. Get service status via `/v2/timemachine/status`
2. Get authorized dirs via `/v2/timemachine/get_limit`

**Output:** "Time Machine backup is [enabled/disabled]"

#### 3.2 Enable/Disable Time Machine Service

**Triggers:** "enable time machine", "disable time machine", "enable/disable time machine"

**Steps:**
1. Get current status via `/v2/timemachine/status`
2. Execute via `/v2/timemachine/service?action=start` or `?action=stop`
3. Verify status change

**Output:** "Time Machine service [started/stopped]"

#### 3.3 Add/Remove Authorized Directory

**Triggers:** "add time machine directory", "remove time machine auth", "add/remove authorized directory"

**Steps:**

**Add:**
1. Verify directory is shared folder via `/v2/timemachine/get_dir_list`
2. Check if already authorized
3. Add via `/v2/timemachine/set_limit`

**Remove:**
1. Get current auth list
2. Verify directory in list
3. Remove via `/v2/timemachine/del_limit` (cannot remove if only one)

**Output:** "Authorized directory [{name}] added/removed"

---

## Important Constraints

1. **Independent operations**: Each request triggers ONE feature. Never chain multiple features.
2. **Step-by-step execution**: Follow all steps for the triggered feature. No skipping.
3. **Token efficiency**: Only load relevant feature logic.
4. **No speculation**: Don't infer or combine operations across features.
5. **No action without trigger**: If no trigger matches, do nothing.

---

## API Reference

For detailed API specifications, see:
- [references/rsync-api.md](references/rsync-api.md) - Rsync backup API details
- [references/filesystem-snapshot-api.md](references/filesystem-snapshot-api.md) - Filesystem snapshot API details
- [references/timemachine-api.md](references/timemachine-api.md) - Time Machine API details

**User Password Verification:**

Some operations require password verification. Use `/v2/otp/verify_pwd` with RSA-encrypted password.

```json
POST /v2/otp/verify_pwd
{
  "password": "<RSA-encrypted-password>"
}
```