# Delete Storage Pool

## Execution Steps

### Step 1: Check if Storage Pool Exists

- **Interface**: `GET /v2/storage/list/storagePool`
- Use `sort` to assist query, record `uuid`
- Not found → Return "This storage pool does not exist. Please verify the storage pool name is correct."

### Step 2: Check if Storage Pool Has Volumes

- **Interface**: `GET /v2/storage/edit/pool/:uuid`
- Has volumes → Return "Please delete all volumes on this storage pool first before attempting to delete the storage pool. Ensure you have backed up important data before proceeding."
- No volumes → Continue

### Step 3: Password Verification

- Ask user for password, encrypt with RSA and verify
- Verification failed → Return "Incorrect password! Please try again."

### Step 4: Verify Deletion

⚠️ Cannot judge success solely by delete API returning `code:true`! Must re-query to verify:

1. Call delete interface `DELETE /v2/storage/delete/pool/:uuid` (carry `X-CurPass-Token`)
2. Wait for operation to complete, then call `GET /v2/storage/list/storagePool`
3. Check if target storage pool still exists in the list
4. No longer exists → deletion successful; still exists → deletion failed

## Output Rules

1. ✅ Success: Return "Storage pool deleted successfully."
2. ❌ Not found: Return "This storage pool does not exist. Please verify the storage pool name is correct."
3. ❌ Has volumes: Return "Please delete all volumes on this storage pool first before attempting to delete the storage pool. Ensure you have backed up important data before proceeding."
4. ❌ Wrong password: Return "Incorrect password! Please try again."
5. ❌ Deletion failed: Return "Storage pool deletion failed! Please try again later."
