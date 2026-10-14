# 安装应用 - 接口详情

## Docker类型判断（最高优先级）

安装应用第一步必须检查 `application_type` 字段：
- 若 `application_type == "docker"` → **立即输出**"该Docker类应用建议前往应用中心手动安装。"并**终止流程**，不走后续任何步骤
- 若 `application_type != "docker"`（如 tpk/deb）→ 继续后续步骤

**Docker Manager 特殊处理**：Docker Manager（id=docker）的 application_type 为 tpk，但它依赖 Docker Engine。若 Docker Engine 未安装，输出"请先安装Docker Engine。"并终止；若已安装但未启用，先启用 Docker Engine。

---

## 依赖检查说明

对于非Docker类应用，安装前须检查 `depend` 字段。若依赖应用未安装或未启用，需先完成依赖的安装和启用，再继续安装目标应用。

**检查流程**：
1. 从 `/v2/app/list` 的 `online_list` 中获取目标应用的 `depend` 数组
2. 从 `install_list` 中查看每个依赖应用的 `install` 和 `is_running` 状态
3. 若依赖 `install != 1` → 先递归执行安装流程安装该依赖
4. 若依赖 `is_running != true` → 先调用 `PUT /v2/app/start/{id}` 启用该依赖
5. 所有依赖就绪后方可继续安装目标应用

---

## 接口0：查询存储卷列表

- **接口名称**: 查询存储卷列表
- **接口路径**: /v2/storage/list/volume
- **请求方法**: GET
- **接口描述**: 查询设备所有存储卷信息，用于安装应用时选择安装位置。需要用户登录认证。
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
          "device": { "type": "string", "description": "设备路径，如 /dev/mapper/vg0-lv0" },
          "mntpath": { "type": "string", "description": "挂载路径，如 /Volume1" },
          "filesystem": { "type": "string", "description": "文件系统类型，如 btrfs" },
          "total": {
            "type": "object",
            "description": "总容量",
            "properties": {
              "value": { "type": "number", "description": "容量数值" },
              "unit": { "type": "string", "description": "容量单位，如 KB" }
            }
          },
          "used": {
            "type": "object",
            "description": "已用容量",
            "properties": {
              "value": { "type": "number", "description": "容量数值" },
              "unit": { "type": "string", "description": "容量单位，如 KB" }
            }
          },
          "available": {
            "type": "object",
            "description": "可用容量",
            "properties": {
              "value": { "type": "number", "description": "容量数值" },
              "unit": { "type": "string", "description": "容量单位，如 KB" }
            }
          },
          "usage": { "type": "number", "description": "使用百分比，如 20.07" },
          "sort": { "type": "integer", "description": "排序序号" },
          "description": { "type": "string", "description": "描述" },
          "compression": { "type": "integer", "description": "压缩状态" },
          "raidname": { "type": "string", "description": "RAID名称，null表示无RAID" }
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
          "description": "已安装应用列表(ResAppInfo)，key为应用ID",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "id": { "type": "string", "description": "应用ID" },
              "name": { "type": "string", "description": "应用名称" },
              "auth": { "type": "string", "description": "作者" },
              "description": { "type": "string", "description": "简介" },
              "icon": { "type": "string", "description": "应用图片地址" },
              "version": { "type": "string", "description": "应用版本" },
              "local_version": { "type": "string", "description": "本地安装版本" },
              "type": { "type": "string", "description": "应用类型：tab/iframe/download" },
              "install": { "type": "integer", "description": "安装状态：0=未安装，1=已安装，2=有更新" },
              "installPath": { "type": "string", "description": "安装地址" },
              "is_running": { "type": "boolean", "description": "是否正在运行" },
              "size": { "type": "integer", "description": "应用大小（字节）" },
              "platform": { "type": "string", "description": "支持的CPU架构：x86_64/arrch64" },
              "application_type": { "type": "string", "description": "应用种类：tpk/docker/deb" },
              "application_source": { "type": "string", "description": "应用来源：official/docker/officialDocker/third/thirdDocker" },
              "category": { "type": "array", "items": { "type": "string" }, "description": "应用类别，如multimedia/backup/tool/network/office等" },
              "depend": { "type": "array", "items": { "type": "string" }, "description": "依赖的应用ID列表" },
              "low_version": { "type": "string", "description": "应用支持的最低系统版本" },
              "release_note": { "type": "string", "description": "更新内容" },
              "important": { "type": "string", "description": "重要提示" }
            },
            "required": ["id", "name", "version", "type", "install"]
          }
        },
        "online_list": {
          "type": "object",
          "description": "在线可获取应用列表(AppInfo)，key为应用ID",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "id": { "type": "string", "description": "应用ID" },
              "name": { "type": "string", "description": "应用名称" },
              "version": { "type": "string", "description": "应用版本" },
              "type": { "type": "string", "description": "应用类型：tab/iframe/download" },
              "install": { "type": "integer", "description": "安装状态：0=未安装，1=已安装，2=有更新" },
              "platform": { "type": "string", "description": "支持的CPU架构：x86_64/arrch64" },
              "application_type": { "type": "string", "description": "应用种类：tpk/docker/deb" },
              "application_source": { "type": "string", "description": "应用来源：official/docker/officialDocker/third/thirdDocker" },
              "size": { "type": "integer", "description": "应用大小（字节）" },
              "low_version": { "type": "string", "description": "应用支持的最低系统版本" },
              "depend": { "type": "array", "items": { "type": "string" }, "description": "依赖的应用ID列表" },
              "category": { "type": "array", "items": { "type": "string" }, "description": "应用类别" },
              "description": { "type": "string", "description": "简介" }
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

## 接口2：安装应用

- **接口名称**: 安装应用
- **接口路径**: /v2/app/install
- **请求方法**: POST
- **接口描述**: 应用中心安装应用，传入一个应用id进行安装，需要用户登录认证。
- **请求头**:
  - Content-Type: application/json (必填)
  - Cookie: 不可为空，用户认证所需 (必填)
  - X-Csrf-Token: 不可为空，用户认证所需 (必填)
- **请求体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "app_id": { "type": "string", "description": "应用ID，必填参数", "default": "iSCSIManager" },
    "install_path": { "type": "string", "description": "安装路径", "default": "/Volume1" },
    "docker_run_config": {
      "type": "object",
      "description": "Docker运行配置（Docker类应用时使用）",
      "properties": {
        "image": { "type": "string", "description": "Docker镜像名称", "default": "-" },
        "entrypoint": { "type": "string", "description": "容器入口点", "default": "-" },
        "user": { "type": "string", "description": "运行用户", "default": "-" },
        "webui": { "type": "string", "description": "Web UI地址", "default": "-" },
        "network_mode": { "type": "string", "description": "网络模式", "default": "-" },
        "ports": {
          "type": "array", "description": "端口映射列表",
          "items": {
            "type": "object",
            "properties": {
              "port_type": { "type": "string", "description": "端口类型" },
              "local_port": { "type": "string", "description": "本地端口" },
              "internal_port": { "type": "string", "description": "内部端口" },
              "protocol": { "type": "string", "description": "协议" }
            },
            "required": ["port_type", "local_port", "internal_port", "protocol"]
          }
        },
        "volumes": {
          "type": "array", "description": "卷挂载列表",
          "items": {
            "type": "object",
            "properties": {
              "mount_type": { "type": "string", "description": "挂载类型" },
              "src": { "type": "string", "description": "源路径" },
              "dst": { "type": "string", "description": "目标路径" },
              "read_only": { "type": "boolean", "description": "是否只读" }
            },
            "required": ["mount_type", "src", "dst", "read_only"]
          }
        },
        "envs": {
          "type": "array", "description": "环境变量列表",
          "items": {
            "type": "object",
            "properties": {
              "key": { "type": "string", "description": "环境变量名" },
              "value": { "type": "string", "description": "环境变量值" },
              "required": { "type": "boolean", "description": "是否必填" }
            },
            "required": ["key", "value", "required"]
          }
        },
        "restart_policy": { "type": "string", "description": "重启策略", "default": "-" },
        "privileged": { "type": "boolean", "description": "是否特权模式", "default": false },
        "cpu_shares": { "type": "string", "description": "CPU份额", "default": "-" },
        "memory": { "type": "string", "description": "内存限制", "default": "-" }
      }
    }
  },
  "required": ["app_id"]
}
```

- **响应体 (JSON)**:
```json
{
  "type": "object",
  "properties": {
    "code": { "type": "boolean", "description": "请求是否成功：true=成功，false=失败", "default": true },
    "msg": { "type": "string", "description": "错误响应消息，成功时为空字符串。", "default": "错误内容" },
    "data": {
      "type": "object",
      "description": "应用安装状态映射，key为应用ID，value为runstate.State对象",
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
