# Disk S.M.A.R.T. Test

## Execution Steps

### Step ①: Build Disk Name to Device Path Mapping

- **Interface**: `GET /v2/disk/GetDiskListData`
- `name` = display name, `device` = device path
- e.g.: HDD1 → /dev/sda

### Step ②: List All Disks, Let User Select

- Via `GET /v2/disk/GetDiskListData`

### Step ③: Select Test Type

- `test_type`: 0=Quick Test, 1=Advanced Test (Number type)

### Step ④: Check if Disk Supports SMART

- Check via `smart.enabled` field
- Not supported → Return "Disk name does not support S.M.A.R.T. testing."

### Step ⑤: Check/Create Test Task

- **Get existing tasks**: `GET /v2/disk/smart_test/schedule`
- Determine if target disk has an existing task and if test mode matches
- **Exists and mode matches** → Use this task ID directly
- **Exists but mode doesn't match** → Edit task: `POST /v2/disk/smart_test/schedule/:id/edit` (⚠️ Not PUT, `test_type` must be Number type!)
- **Not created** → Create task: `POST /v2/disk/smart_test/schedule`

**Create/Edit Task Request Body**:
```json
{
  "id": 0,
  "name": "Disk model",
  "serial": "Disk serial number",
  "test_type": 0,
  "test_range": 1,
  "disks": "Disk device path (multiple separated by colons)",
  "enabled": true,
  "exception_warn": true,
  "schedule": {
    "cycle_type": "day",
    "cycle_weeks_range": "",
    "cycle_date": "",
    "frequency_type": "day",
    "frequency_value": 1,
    "hour": 0,
    "minute": 0,
    "schedule_time": ""
  }
}
```

⚠️ Note: `schedule` cannot be an empty object `{}`, otherwise it will report `frequency_value be greater than 0` error (task will still be created but returns code:false). Recommend passing a default daily schedule.

### Step ⑥: Execute Test

- **Interface**: `POST /v2/disk/smart_test/schedule/:id/exec`
- Quick test success → Return "Disk name started S.M.A.R.T. quick test." with name, test result
- Advanced test success → Return "Disk name started S.M.A.R.T. advanced test. Due to the long test duration, please go to Storage Management > Disk > S.M.A.R.T. to view the test results."
- Failure → Return "Disk name S.M.A.R.T. test execution failed."

## Output Rules

1. ✅ Quick test: Return "Disk name started S.M.A.R.T. quick test." with name, test result
2. ✅ Advanced test: Return "Disk name started S.M.A.R.T. advanced test. Due to the long test duration, please go to Storage Management > Disk > S.M.A.R.T. to view the test results."
3. ❌ Not supported: Return "Disk name does not support S.M.A.R.T. testing."
4. ❌ Execution failed: Return "Disk name S.M.A.R.T. test execution failed."

## ⚠️ Notes

- Edit interface is `POST /v2/disk/smart_test/schedule/:id/edit`, not PUT
- `test_type` must be Number type (0 or 1), do not pass string, otherwise it reports `cannot unmarshal string into Go struct field` error
