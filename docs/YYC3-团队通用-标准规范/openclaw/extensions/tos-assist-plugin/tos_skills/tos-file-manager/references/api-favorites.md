# TOS fileManage API - Favorites Management

All endpoints are under `/v2/fileManage/`. Requires authentication (see `auth.md`).

---

## Add to Favorites

`POST /fileManage/AddCollect`

Add files/folders to favorites.

### Request Body

```json
{"paths": ["/Volume2/222"]}
```

| Field | Type | Description |
|-------|------|-------------|
| `paths` | `[]string` | **Required.** Array of file/folder paths to add to favorites |

### Response

```json
{"is_login": true, "code": true, "msg": "", "data": true}
```

### Document Error Corrected

- ❌ Original doc says `paths` is `string` type
- ✅ Actual type: `[]string` array. Sending a string causes error: "json: cannot unmarshal string into Go struct field .paths of type []string"

---

## List Favorites

`GET /fileManage/collect/list?page={page}&limit={limit}`

Get paginated list of favorited items.

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | `int` | Page number (1-based) |
| `limit` | `int` | Items per page |

### Response

```json
{
  "is_login": true,
  "code": true,
  "data": [
    {
      "name": "222",
      "path": "/Volume2/222",
      "f_type": "folder",
      "size": 0,
      "size_friendly": "",
      "owner": "xia",
      "permission": "LADRWacdprwx",
      "is_collect": true,
      "is_share": false,
      "is_exist": true,
      "a_time": "2026/04/30 09:24:18",
      "m_time": "2026/04/30 09:24:20",
      "c_time": "2026/04/30 16:51:59"
    }
  ]
}
```

---

## Remove from Favorites

`DELETE /fileManage/DelCollect?paths={path}`

Remove files/folders from favorites.

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `paths` | `string` | **Required.** Folder/file path to remove |

### Example

```
DELETE /v2/fileManage/DelCollect?paths=/Volume2/222
```

### Response

```json
{"is_login": true, "code": true, "msg": "", "data": true}
```

### Important

- Method is **DELETE**, not POST
- `paths` is a **query parameter** (not in request body)
- For multiple paths, make separate DELETE requests

### Document Error Corrected

- ❌ Original doc says `POST /fileManage/v2/DelCollect`
- ✅ Actual: `DELETE /fileManage/DelCollect?paths=/path` (no `/v2/` prefix in path, paths as query param)
