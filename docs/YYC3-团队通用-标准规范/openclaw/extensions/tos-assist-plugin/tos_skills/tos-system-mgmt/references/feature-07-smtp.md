# Feature 7: SMTP Mail Server Configuration

## Trigger Conditions

- Configure TNAS mail notification server
- Set up custom SMTP mail sending
- TNAS cannot send email, configure SMTP

## Step 1: Get Current SMTP Config

### GET /smtp/GetSmtpConfig

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "notice": {
      "is_enable": true,
      "is_cc": false,
      "email": []
    },
    "service": {
      "config": {
        "smtp_auth": "LOGIN",
        "smtp_auth_user": "string",
        "smtp_auth_pass": "",
        "smtp_server": "string",
        "smtp_port": "string",
        "my_name": "string",
        "my_email": "string"
      },
      "is_user_config": true
    }
  },
  "code_num": 0
}
```

Note: `smtp_auth_pass` is empty on GET responses (encrypted in transit).

## Step 2: Confirm SMTP Settings

Ask user for:
- `smtp_server`: SMTP server address
- `smtp_port`: SMTP server port
- `smtp_auth_user`: Username/email address
- `smtp_auth_pass`: Authorization code/password
- `my_name`: Sender name
- `my_email`: Sender email address

## Step 3: Apply SMTP Config

### POST /smtp/SetSmtpConfig

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "notice": {
    "is_enable": true,
    "is_cc": false,
    "email": []
  },
  "service": {
    "config": {
      "smtp_auth": "LOGIN",
      "smtp_auth_user": "string",
      "smtp_auth_pass": "string",
      "smtp_server": "string",
      "smtp_port": "string",
      "my_name": "string",
      "my_email": "string"
    },
    "is_user_config": true
  }
}
```

Required fields: `notice`, `service`.

## Step 4: Send Test Email

### 4a. GET /person/list/user

Fetch admin user email addresses.

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "code": true,
  "data": [
    { "name": "admin", "email": "admin@example.com" }
  ]
}
```

### 4b. POST /smtp/SendEmail

Send test email using the admin email(s).

**Headers**: Content-Type: application/json

**Request Body**:
```json
{
  "is_enable": true,
  "email": ["admin@example.com"]
}
```

- `is_enable`: Required. Whether to enable email notification.
- `email`: Array of email addresses to receive test email.
