# 应用中心设置 - 接口详情

## 接口0：查询存储卷列表

- **接口名称**: 查询存储卷列表
- **接口路径**: /v2/storage/list/volume
- **请求方法**: GET
- **接口描述**: 查询设备所有存储卷信息，用于设置默认安装位置时确认可用卷。需要用户登录认证。
- **请求头**:
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求参数 (Query)**:
  - `type`: 查询类型，传 `brief` 获取简要信息 (可选)

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": {
      "type": "object",
      "description": "存储卷映射，key为卷UUID",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "uuid": { "type": "string", "description": "卷UUID" },
          "show_name": { "type": "string", "description": "显示名称" },
          "name": { "type": "string", "description": "卷名称，如 lv0" },
          "mntpath": { "type": "string", "description": "挂载路径，如 /Volume1" },
          "filesystem": { "type": "string", "description": "文件系统类型，如 btrfs" },
          "total": { "type": "object", "description": "总容量", "properties": { "value": { "type": "number" }, "unit": { "type": "string" } } },
          "used": { "type": "object", "description": "已用容量", "properties": { "value": { "type": "number" }, "unit": { "type": "string" } } },
          "available": { "type": "object", "description": "可用容量", "properties": { "value": { "type": "number" }, "unit": { "type": "string" } } },
          "usage": { "type": "number", "description": "使用百分比" }
        }
      }
    },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```

---

## 接口1：获取应用商店设置

- **接口名称**: 获取应用商店设置
- **接口路径**: /v2/app/setting
- **请求方法**: GET
- **接口描述**: 获取应用商店的全局配置信息，包括是否开启Beta应用和存储路径。需要用户登录认证。
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": {
      "type": "object",
      "properties": {
        "app_beta": { "type": "boolean", "description": "是否展示测试应用" },
        "app_storage_path": { "type": "string", "description": "应用安装默认卷" }
      },
      "required": ["app_beta", "app_storage_path"]
    },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```

---

## 接口2：保存应用商店设置

- **接口名称**: 保存应用商店设置
- **接口路径**: /v2/app/setting
- **请求方法**: POST
- **接口描述**: 保存应用商店设置
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "app_beta": { "type": "boolean", "description": "是否展示测试应用" },
    "app_storage_path": { "type": "string", "description": "默认应用安装地址" }
  },
  "required": ["app_beta", "app_storage_path"]
}
```

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": { "type": "boolean", "description": "返回数据" },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```
