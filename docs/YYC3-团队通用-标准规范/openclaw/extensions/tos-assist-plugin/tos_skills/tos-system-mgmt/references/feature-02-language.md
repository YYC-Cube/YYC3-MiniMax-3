# Feature 2: Language Management

## Trigger Conditions

- Change TNAS interface language to Chinese/English/etc.
- Modify system notification language
- Interface language is unreadable, switch it

## Supported Language Codes

`en-us`, `de-de`, `fr-fr`, `es-es`, `it-it`, `hu-hu`, `pl-pl`, `tr-tr`, `ru-ru`, `pt-pt`, `zh-cn`, `zh-hk`, `ja-jp`, `ko-kr`

## Step 1: Get Current Language Config

### GET /timesetting/getlang

**Headers**: Cookie (required), X-Csrf-Token (required)

**Response**:
```json
{
  "is_login": true,
  "code": true,
  "data": {
    "tos_lang": "zh-cn",
    "notify_lang": "zh-cn"
  },
  "code_num": 0,
  "code_msg": ""
}
```

- `tos_lang`: System interface language code
- `notify_lang`: Notification language code

## Step 2: Confirm Target Language

Use `tos_lang` for interface language, `notify_lang` for notification language.

## Step 3 & 4: Set Language Config

### POST /timesetting/setlang

**Headers**: Content-Type: application/json, Cookie (required), X-Csrf-Token (required)

**Request Body**:
```json
{
  "tos_lang": "string - interface language code",
  "notify_lang": "string - notification language code"
}
```

Both fields are optional — include only the one(s) being changed.

## Step 5: Verify Changes

Call GET `/timesetting/getlang` again. Confirm both `tos_lang` and `notify_lang` match target values.
