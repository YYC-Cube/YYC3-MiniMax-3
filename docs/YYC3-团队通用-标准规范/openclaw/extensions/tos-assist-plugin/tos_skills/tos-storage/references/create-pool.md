# Create Storage Pool

## Execution Steps

### Step 1: Query Free Disks

- **Interface**: `GET /v2/storage/create/pool`
- No free disks → Return "No free disks available for storage pool creation."

### Step 2: Let User Select Disks

- If free disks available, let user select

### Step 3: Check Disk Type Consistency

- Three types: HDD, SSD, USB
- User-selected disks must be of the same type
- Mixed types → Return "To ensure storage pool stability and data security, disks of different types and sources (external vs internal) cannot be mixed in the same storage pool. Please select disks of the same type and try again."

### Step 4: Select RAID Type

Based on number of disks, return available RAID types:
- 1 disk: TRAID / Single Disk
- 2 disks: TRAID / RAID 0 / RAID 1
- 3 disks: TRAID / RAID 0 / RAID 1 / RAID 5
- 4 disks: TRAID / TRAID+ / RAID 0 / RAID 1 / RAID 5 / RAID 6
- 6 disks: TRAID / TRAID+ / RAID 0 / RAID 1 / RAID 5 / RAID 6 / RAID 10

### Step 5: Confirm Creation Info

**Must return all three**: Available space, Redundant space, Wasted space

**Capacity Calculation Rules** (disk capacity from `bytes.value`):
- **Single Disk**: Available=min disk capacity, Redundant=0, Wasted=total-available
- **TRAID**: Available≈sum of all disk capacities, Redundant=0, Wasted≈0
- **RAID 0**: Available=sum of all disk capacities, Redundant=0, Wasted=total-available
- **RAID 1**: Available=min disk capacity, Redundant=min disk capacity, Wasted=total-available-redundant
- **RAID 5**: Available=(disk count-1)×min disk capacity, Redundant=min disk capacity, Wasted=total-available-redundant
- **RAID 6**: Available=(disk count-2)×min disk capacity, Redundant=2×min disk capacity, Wasted=total-available-redundant
- **RAID 10**: Available=min disk capacity×(disk count/2), Redundant=available, Wasted=total-available-redundant
- **TRAID+**: Available≈total capacity×0.95, Redundant≈0, Wasted≈total capacity×0.05

Ask user to confirm creation

### Step 6: Password Verification

- Ask user for password, encrypt with RSA and verify
- Verification failed → Return "Incorrect password! Please try again."

### Step 7: Create Storage Pool

- **Interface**: `POST /v2/storage/create/pool`
- `level` = RAID type, `disks` = disk device path list
- Carry `X-CurPass-Token` header

## Output Rules

1. ✅ Success: Return "Storage pool created successfully." with pool name, capacity, RAID type, disk info
2. ❌ No free disks: Return "No free disks available for storage pool creation."
3. ❌ Type mismatch: Return "To ensure storage pool stability and data security, disks of different types and sources (external vs internal) cannot be mixed in the same storage pool. Please select disks of the same type and try again."
4. ❌ Wrong password: Return "Incorrect password! Please try again."
5. ❌ Creation failed: Return "Storage pool creation failed!"
