# 卸载应用 - 接口详情

## 卸载Docker Engine/Docker Manager时的依赖检查

若卸载的是 Docker Engine（id=DockerEngine）或 Docker Manager（id=docker），必须执行以下步骤：
1. 遍历 `/v2/app/list` 返回的 `install_list`，找出所有满足以下条件的应用：
   - `depend` 字段包含 `DockerEngine`（依赖Docker Engine运行）
   - 无论 `is_running` 是否为 true，都需列举（包括已安装但未运行的Docker类应用）
2. 将这些应用名称列举出来，向用户确认："卸载XX将同时停用其关联应用：1.YY；2.ZZ；...，您确定要继续吗？"
3. 用户确认后，先逐一停用正在运行的关联应用（`PUT /v2/app/stop/{id}`）
4. 全部停用后，再执行卸载操作
5. 返回结果时列举所有被停用的关联应用名称

---

## 接口1：获取应用列表

- **接口名称**: 获取应用列表
- **接口路径**: /v2/app/list
- **请求方法**: GET
- **接口描述**: 获取应用商店的应用列表，包含已安装应用和在线可获取的应用。需要用户登录认证。
- **请求头**:
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求参数 (Query)**:
  - `refresh`: 是否刷新应用列表缓存。传入任意值即表示刷新，不传则使用缓存 (可选)

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": {
      "type": "object",
      "properties": {
        "install_list": {
          "type": "object",
          "description": "已安装应用列表，key为应用ID",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "id": { "type": "string", "description": "应用ID" },
              "name": { "type": "string", "description": "应用名称" },
              "install": { "type": "integer", "description": "安装状态：0=未安装，1=已安装，2=有更新" },
              "is_running": { "type": "boolean", "description": "是否正在运行" }
            },
            "required": ["id", "name", "version", "type", "install"]
          }
        },
        "online_list": {
          "type": "object",
          "description": "在线可获取应用列表，key为应用ID",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "id": { "type": "string", "description": "应用ID" },
              "name": { "type": "string", "description": "应用名称" },
              "install": { "type": "integer", "description": "安装状态：0=未安装，1=已安装，2=有更新" }
            },
            "required": ["id", "name", "version", "type", "install"]
          }
        }
      },
      "required": ["install_list", "online_list"]
    },
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["code", "msg", "data", "is_login", "time", "code_num", "code_msg"]
}
```

---

## 接口2：卸载应用

- **接口名称**: 卸载应用
- **接口路径**: /v2/app/remove
- **请求方法**: DELETE
- **接口描述**: 用于卸载已安装的应用
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "app_id": { "type": "string", "description": "应用ID，必填参数", "default": "ISCSIManager" },
    "clean": { "type": "boolean", "description": "是否清除残留数据（必填参数）", "default": false }
  },
  "required": ["app_id", "clean"]
}
```

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": {
      "type": "object",
      "description": "应用卸载状态映射，key为应用ID，value为runstate.State对象",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "process": { "type": "integer", "description": "操作进度百分比。-1=安装失败，-2=解析失败，-3=版本不匹配，-4=空间不足，-5=网络错误，0-100=进度百分比" },
          "operate": { "type": "string", "description": "当前操作类型：install=安装，uninstall=卸载，update=更新，wait=等待" },
          "debug": { "type": "string", "description": "错误信息，正常状态为空字符串" },
          "ErrorState": { "type": "integer", "description": "错误状态码：0=无错误，1=Panic，2=安装错误，3=更新错误，4=卸载错误，5=网络错误，6=空间不足，7=Docker解析错误，8=Docker创建网络错误，9=Docker创建卷错误，10=Docker构建镜像错误，11=Docker创建容器错误，12=下载哈希校验错误，13=解析应用信息错误，14=解压应用错误，15=处理文件错误，16=ZIP文件MD5错误，17=安装文件错误，18=移除容器错误，19=移除镜像错误" }
        }
      }
    },
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["code", "msg", "data", "is_login", "time", "code_num", "code_msg"]
}
```

---

## 接口3：获取安全应用列表（SPC检查）

- **接口名称**: 获取安全应用列表
- **接口路径**: /v2/app/activeSafetyList
- **请求方法**: GET
- **接口描述**: 获取当前用户已安装应用的安全配置列表，包含网络和存储权限信息。需要用户登录认证。
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "description": "应用id" },
          "name": { "type": "string", "description": "应用名称" },
          "net": { "type": "boolean", "description": "网络权限" },
          "storage": { "type": "boolean", "description": "存储权限" },
          "install_path": { "type": "string", "description": "安装地址" },
          "is_deb": { "type": "boolean", "description": "是否为DEB应用" },
          "package": { "type": "string", "description": "DEB包名" }
        },
        "required": ["id", "name", "net", "storage", "install_path", "is_deb", "package"]
      }
    },
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```

---

## 接口4：设置应用安全配置（SPC授权）

- **接口名称**: 设置应用安全配置
- **接口路径**: /v2/app/setAppSecurity
- **请求方法**: POST
- **接口描述**: 设置应用安全配置
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "应用ID，必填参数", "default": "" },
    "net": { "type": "boolean", "description": "是否允许网络访问，必填参数", "default": false },
    "storage": { "type": "boolean", "description": "是否允许存储访问，必填参数", "default": false }
  },
  "required": ["id", "net", "storage"]
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
    "data": { "type": "boolean", "description": "返回的数据" },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```

---

## 接口5：查询SPC开启状态

- **接口名称**: 查询SPC开启状态
- **接口路径**: /v2/security/sad/state
- **请求方法**: GET
- **接口描述**: 查询TOS系统SPC（安全应用控制）是否开启。需要用户登录认证。
- **请求头**:
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
        "state": { "type": "boolean", "description": "SPC是否开启：true=已开启，false=未开启" },
        "set_default": { "type": "boolean", "description": "是否已设置默认策略" },
        "tag": { "type": "string", "description": "SPC标签/标识符" }
      },
      "required": ["state", "set_default", "tag"]
    },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```

---

## 接口6：校验用户密码

- **接口名称**: 校验用户密码
- **接口路径**: /v2/otp/verify_pwd
- **请求方法**: POST
- **接口描述**: 校验用户当前登录密码，用于SPC授权时验证身份。需要用户登录认证。
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
  - **X-CurPass-Token**: RSA加密后的用户密码，Base64编码 (必填)
    - 加密方式：使用 `/v2/login/state` 响应头 `X-Rsa-Token` 中的RSA公钥（Base64解码后得到PEM格式公钥），对用户明文密码进行 PKCS1v15 加密，再 Base64 编码

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "is_login": { "type": "boolean", "description": "登录状态", "default": true },
    "code": { "type": "boolean", "description": "校验结果：true=密码正确，false=密码错误", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。" },
    "data": { "type": "boolean", "description": "校验结果数据" },
    "time": { "type": "number", "description": "处理时间", "default": 0 },
    "code_num": { "type": "integer", "description": "gerror错误码", "default": 0 },
    "code_msg": { "type": "string", "description": "gerror错误内容" }
  },
  "required": ["is_login", "code", "msg", "data", "time", "code_num", "code_msg"]
}
```
