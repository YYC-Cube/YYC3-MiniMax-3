# Delete Volume

## Execution Steps

### Step 1: Check if Volume Exists

- **Interface**: `GET /v2/storage/list/volume?type=detail`
- Use `sort` field to locate target volume, record `uuid`
- Not found → Return "This volume does not exist. Please verify the volume name is correct."

### Step 2: Password Verification

- Ask user for password, encrypt with RSA and verify
- **Interface**: `POST /v2/otp/verify_pwd` (also carry `X-CurPass-Token` header)
- Verification failed → Return "Incorrect password! Please try again."

### Step 3: Delete Volume

- **Interface**: `DELETE /v2/storage/delete/volume/:uuid` (⚠️ HTTP method is DELETE, not POST)
- Carry `X-CurPass-Token` header

### Step 4: Verify Deletion

⚠️ Cannot judge success solely by delete API returning `code:true`! Must re-query to verify:

1. Call delete interface
2. Wait for operation to complete, then call `GET /v2/storage/list/volume?type=detail`
3. Check if target volume still exists in the list
4. No longer exists → deletion successful; still exists → deletion failed

## Output Rules

1. ✅ Success: Return "Volume deleted successfully."
2. ❌ Not found: Return "This volume does not exist. Please verify the volume name is correct."
3. ❌ Wrong password: Return "Incorrect password! Please try again."
4. ❌ Volume in use: Return "Volume is in use, deletion failed! Please follow these troubleshooting steps: 1. Disable Debug mode and restart the system. 2. Disable all applications and restart the system. 3. Ensure no file transfer tasks are running, disable all file services and restart the system."
