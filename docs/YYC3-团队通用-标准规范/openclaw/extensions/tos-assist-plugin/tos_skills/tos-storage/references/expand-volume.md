# Expand Volume

## Execution Steps

### Step 1: Get Volume Info and Storage Pool Available Capacity

- **Interface**: `GET /v2/storage/edit/volume/:uuid`
- Get `poolinfo.free.value` (storage pool available capacity)
- ⚠️ **Must record the volume's `description` field value**; it must be passed in Step 3 to prevent description from being overwritten with empty value!
- No available capacity → Return "Insufficient allocatable space in the storage pool."

### Step 2: Let User Enter Volume Capacity

- `capacity` (Number)
- Volume capacity ≤ `poolinfo.free.value + total.value` (max allocatable = available space + original volume capacity)

### Step 3: Complete Expansion

- **Interface**: `POST /v2/storage/edit/volume/:uuid`
- ⚠️ Must pass the original `description` recorded in Step 1!
- **Request Body**:
```json
{
  "capacity": Volume capacity (GB),
  "quota_flag": 0,
  "description": "Original volume description from Step 1"
}
```

## Output Rules

1. ✅ Success: Return "Volume expanded successfully." with volume name, capacity
2. ❌ Insufficient space: Return "Insufficient allocatable space in the storage pool."
3. ❌ Failure: Return "Volume expansion failed!"
