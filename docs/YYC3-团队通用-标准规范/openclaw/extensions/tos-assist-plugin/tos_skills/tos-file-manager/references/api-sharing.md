# TOS fileManage API - File Sharing

All endpoints are under `/v2/fileManage/`. Requires authentication (see `auth.md`).

---

## Create Share

`POST /fileManage/AddShareFile`

Create a share link for one or more files/folders.

### Request Body

```json
{
  "paths": ["/Volume2/222"],
  "title": "My Share",
  "sta_time": "2026-04-30 16:50:00",
  "exp_time": "2026-05-30 16:50:00",
  "password": "",
  "ban_download": false,
  "ban_delete": false,
  "ban_add": false,
  "allow_visit_num": -1
}
```

| Field | Type | Description |
|-------|------|-------------|
| `paths` | `[]string` | **Required.** Array of file/folder paths to share |
| `title` | `string` | Share title |
| `sta_time` | `string` | Start time, format `YYYY-MM-DD HH:mm:ss` |
| `exp_time` | `string` | Expiry time, format `YYYY-MM-DD HH:mm:ss` |
| `password` | `string` | Access password — **RSA-encrypted** (same as login password encryption, PKCS1v15 + base64). Empty string `""` = no password |
| `ban_download` | `bool` | Disable download |
| `ban_delete` | `bool` | Disable delete |
| `ban_add` | `bool` | Disable upload |
| `allow_visit_num` | `int` | Max visit count (-1 = unlimited) |

### Response

```json
{
  "is_login": true,
  "code": true,
  "data": {
    "id": 4,
    "close_status": false,
    "paths": ["/Volume2/222"],
    "title": "My Share",
    "sta_time": "2026-04-30 16:50:00",
    "exp_time": "2026-05-30 16:50:00",
    "sta_time_stamp": 1777539000,
    "exp_time_stamp": 1780131000,
    "password": "",
    "ban_download": false,
    "ban_delete": false,
    "ban_add": false,
    "allow_visit_num": -1,
    "view_count": 0,
    "local_share_link": "https://10.18.8.113:5443/share/0932",
    "remote_sharing_link": [],
    "remote_sharing_list": null,
    "query_string": "share_link=0932",
    "tag": "",
    "share_is_empty": false,
    "custom_domain": "",
    "owner": "xia",
    "status": 1
  }
}
```

### Remote Access Detection

Check `remote_sharing_link` in the response:
- `[]` (empty array) → remote access not enabled. Remind user to enable in **TOS Web UI > Control Panel > Remote Access**
- Non-empty array → remote sharing links available

### Important

- Same folder can have multiple share links (no need to delete old ones)
- Write JSON body to file and use `-d @file` to avoid session loss
- `password` field must be **RSA-encrypted** (same method as login password). Use:
  ```bash
  # Get RSA public key from any /v2/ response header X-Rsa-Token
  echo "$RSA_KEY" | base64 -d > /tmp/rsa_pub.pem
  ENCRYPTED=$(echo -n "YourPassword" | openssl rsautl -encrypt -pubin -inkey /tmp/rsa_pub.pem | base64 -w0)
  ```
- Sending plaintext password causes `crypto/rsa: decryption error` or gets stored as empty string

---

## Get Share List

`GET /fileManage/GetShareList`

List all share links created by the current user.

### Response

Returns array of share objects (same structure as Create Share response `data`).

### Note

- May timeout if filemanage service is unstable; retry after restart
- **Returns incomplete data**: `local_share_link` and `password` fields are empty in list response. Use `GetShareMsg` to get full details for each share

---

## Get Share Details

`GET /fileManage/GetShareMsg?id={id}`

Get details of a specific share link.

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | `int` | Share ID |

### Response

Returns a single share object (same structure as Create Share response `data`).

---

## Edit Share

`POST /fileManage/EditShare`

Edit an existing share's settings.

### Request Body

Same structure as Create Share, with `id` field added:

```json
{
  "id": 3,
  "paths": ["/Volume2/222"],
  "title": "Updated Title",
  "sta_time": "2026-04-30 16:40:00",
  "exp_time": "2026-06-30 16:40:00",
  "password": "1234",
  "ban_download": true,
  "ban_delete": false,
  "ban_add": false,
  "allow_visit_num": 100
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | **Required.** Share ID to edit |
| (other fields) | | Same as Create Share. **Note**: `password` field must be RSA-encrypted (PKCS1v15 + base64), NOT plaintext |

### Response

```json
{"is_login": true, "code": true, "msg": "", "data": true}
```

---

## Delete Share

`POST /fileManage/share/del`

Delete one or more share links.

### Request Body

```json
{"ids": [4, 5]}
```

| Field | Type | Description |
|-------|------|-------------|
| `ids` | `[]int` | **Required.** Array of share IDs to delete |

### Response

```json
{"is_login": true, "code": true, "msg": "", "data": null}
```

### Important

- This is **NOT** `DELETE /fileManage/DelShare` (that endpoint is wrong)
- Method is **POST**, not DELETE

---

## Clear Invalid Shares

`POST /fileManage/share/clear`

Remove share links that point to deleted/moved files.

### Request Body

None required (empty POST).

### Response

```json
{"is_login": true, "code": true, "msg": "", "data": true}
```

---

## Check File/Folder Exists

`POST /fileManage/file/exist`

Check whether files/folders exist before sharing.

### Request Body

**Important**: Body is an **array of objects**, NOT `{"paths":[]}`:

```json
[{"path": "/Volume2/222"}, {"path": "/Volume2/homes"}]
```

### Response

Returns existence info for each path.

### Document Error Corrected

- ❌ Original doc says `{"paths":[]}` format
- ✅ Actual format: `[{"path":"xxx"}]` (array of FileExist objects)

---

## Get Folder Info

`GET /fileManage/folderInfoAll?path={path}`

Get folder metadata (name, is_share, is_collect, permission, etc.).

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `path` | `string` | Full folder path |

---

## Error Handling

| Scenario | Solution |
|----------|----------|
| 502 Bad Gateway | `systemctl restart filemanage`, wait 15-25s |
| `parameter error` | Check request body format, use `-d @file` |
| `is_login: false` | Re-authenticate (re-login to TOS API) |
