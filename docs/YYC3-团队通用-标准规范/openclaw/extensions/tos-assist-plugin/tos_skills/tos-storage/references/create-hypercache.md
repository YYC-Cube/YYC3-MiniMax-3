# Create Hyper Cache

## Execution Steps

### ① Get Volumes Without Hyper Cache

- **Interface**: `GET /v2/lvmCache/GetVolumeList`
- Let user select target volume
- Record target volume's `device` (logical volume device path), `name`, `uuid` etc.

### ② Query Free SSD Disks

- **Interface**: `GET /v2/lvmCache/FreeSSDs`
- No free SSDs → Return "No free SSD disks available for Hyper Cache creation."

### ③ Let User Select SSD Disks

- Record disk device paths

### ④ Select RAID Type Based on Disk Count

- 1 disk → Single Disk
- 2 disks → RAID 0 / RAID 1
- 3 disks → RAID 0 / RAID 1 / RAID 5
- 4 disks → RAID 0 / RAID 1 / RAID 5
- 6 disks → RAID 0 / RAID 1 / RAID 5

### ⑤ Calculate and Confirm Capacity Info

Return Hyper Cache available space, redundant space, wasted space, ask user to confirm

### ⑥ Password Verification

- Ask user for password, encrypt with RSA and verify
- Verification failed → Return "Incorrect password! Please try again."

### ⑦ Select Cache Mode

- writeback = Read-Write mode
- writethrough = Balanced mode

### ⑧ Create Hyper Cache

- **Interface**: `POST /v2/lvmCache/CreateCacheLv`
- Carry `X-CurPass-Token` header
- **Request Body**:
```json
{
  "raid_level": 0,
  "cache_mode": "writeback | writethrough",
  "cache_size": "Cache size (GB)",
  "main_lv": "Logical volume path to accelerate",
  "fast_devices": ["SSD device path list"]
}
```

**raid_level description**:
- 0 = RAID0
- 1 = RAID1 or single (backend auto-determines based on fast_devices count: 1=single, >1=raid1)
- 5 = RAID5

## Output Rules

1. ✅ Success: Return "Hyper Cache created successfully." with name, applied volume, cache mode, RAID type, disk info
2. ❌ No free SSD: Return "No free SSD disks available for Hyper Cache creation."
3. ❌ Wrong password: Return "Incorrect password! Please try again."
4. ❌ Creation failed: Return "Hyper Cache creation failed!"
