# Delete Hyper Cache

## Execution Steps

### Step 1: Check if Hyper Cache Exists

- **Interface**: `GET /v2/lvmCache/CacheLvsInfo`
- Use `sort` to assist query, record `uuid`
- Not found → Return "This Hyper Cache does not exist. Please verify the Hyper Cache name is correct."

### Step 2: Password Verification

- Ask user for password, encrypt with RSA and verify
- Verification failed → Return "Incorrect password! Please try again."

### Step 3: Verify Deletion

⚠️ Cannot judge success solely by delete API returning `code:true`! Must re-query to verify:

1. Call delete interface `POST /v2/lvmCache/DeleteCacheLv` (carry `X-CurPass-Token`), request body: `{"lv_uuid": "cache UUID"}` (⚠️ field name is `lv_uuid`, not `uuid`)
2. Wait for operation to complete, then call `GET /v2/lvmCache/CacheLvsInfo`
3. Check if target Hyper Cache still exists in the list
4. No longer exists → deletion successful; still exists → deletion failed

## Output Rules

1. ✅ Success: Return "Hyper Cache deleted successfully."
2. ❌ Not found: Return "This Hyper Cache does not exist. Please verify the Hyper Cache name is correct."
3. ❌ Wrong password: Return "Incorrect password! Please try again."
4. ❌ Deletion failed: Return "Hyper Cache deletion failed! Please try again later."
