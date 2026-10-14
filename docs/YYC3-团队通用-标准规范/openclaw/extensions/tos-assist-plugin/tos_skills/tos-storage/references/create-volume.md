# Create Volume

## Execution Steps

### Step 1: Query Available Storage Pools

- **Interface**: `GET /v2/storage/create/volume`
- Returns `free_pool[index].free.value` for available capacity

### Step 2: Let User Select Storage Pool

- Only display pools with available space > 0 and normal status
- Display format: `Storage Pool N (vgN)`, e.g. "Storage Pool 3 (vg2)"
- Use `device` to record `free_pool[index].name` field
- No available pools → Return "No storage pools available for volume creation. Please create a new storage pool or expand an existing one."

### Step 3: Let User Enter Volume Description

- `description` records the content, can be empty

### Step 4: Let User Enter Volume Capacity

- `volume_size` (Number), 10GB ≤ volume capacity ≤ storage pool available capacity

### Step 5: Let User Select File System

- Options: ext4, btrfs, HyperLock-worm
- Selecting HyperLock-worm → Return "Creating a HyperLock-worm file system volume cannot be executed via OpenClaw. Please go to Storage Management > Volume to perform this operation manually."
- Record selection with `filesystem`

### Step 6: Create Volume

- **Interface**: `POST /v2/storage/create/volume`
- **Request Body**:
```json
{
  "mode": 1,
  "device": "Storage pool name, e.g. vg0",
  "filesystem": "ext4 | btrfs | xfs | HyperLock-worm",
  "pool_free_size": Storage pool available capacity (GB),
  "volume_size": Volume capacity (GB),
  "description": "Volume description, max 64 characters",
  "level": "single | raid0 | raid1 | raid5 | raid6 | raid10 | traid | traidPlus",
  "disks": ["Disk path list"],
  "hyper_lock_status": 0,
  "hyper_lock_day": 0,
  "hyper_lock_model": 0
}
```

## Output Rules

1. ✅ Success: Return "Volume created successfully." with volume name, description, storage pool, capacity, file system
2. ❌ No available pool: Return "No storage pools available for volume creation. Please create a new storage pool or expand an existing one."
3. ❌ HyperLock-worm: Return "Creating a HyperLock-worm file system volume cannot be executed via OpenClaw. Please go to Storage Management > Volume to perform this operation manually."
4. ❌ Failure: Return "Volume creation failed!"
