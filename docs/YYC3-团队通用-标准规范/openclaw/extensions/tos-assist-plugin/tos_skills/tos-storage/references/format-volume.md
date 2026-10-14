# Format Volume

## Execution Steps

### Step 1: Check if Volume Exists

- **Interface**: `GET /v2/storage/list/volume?type=detail`
- Use `sort` to locate target, record `uuid`
- Not found → Return "This volume does not exist. Please verify the volume name is correct."

### Step 2: Password Verification

- Ask user for password, encrypt with RSA and verify
- **Interface**: `POST /v2/otp/verify_pwd` (carry `X-CurPass-Token` header)
- Verification failed → Return "Incorrect password! Please try again."

### Step 3: Select File System

- Options: ext4, btrfs
- Record selection with `fileSystem`

### Step 4: Format Volume

- **Interface**: `POST /v2/storage/volumeFormatting`
- Parameters: `uuid` + `fileSystem`
- Carry `X-CurPass-Token` header

### Step 5: Determine Result

- Judge formatting success based on interface return status

## Output Rules

1. ✅ Success: Return "Volume formatted successfully."
2. ❌ Not found: Return "This volume does not exist. Please verify the volume name is correct."
3. ❌ Wrong password: Return "Incorrect password! Please try again."
4. ❌ Failure: Return "Volume formatting failed. Please try again later."
