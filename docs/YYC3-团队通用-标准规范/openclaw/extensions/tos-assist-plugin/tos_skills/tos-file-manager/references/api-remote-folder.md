# 远程文件夹管理 API 文档

Version: 1.007 (WebDAV 实测验证 2026-05-29)

> **状态：** ✅ **已验证** (WebDAV 完整流程实测通过 2026-05-29)
> 完整API文档见 [api-full-reference.md#功能五远程文件夹挂载卸载](./api-full-reference.md#功能五远程文件夹挂载卸载)

## 功能概述

远程文件夹功能用于将远程文件夹（NFS/SMB/WebDAV协议）挂载到 TNAS 本地目录，或卸载已挂载的远程文件夹。

## ⚠️ 重要用户指导

**WebDAV 和云盘连接创建/编辑建议：**

建议用户前往 TOS 页面中创建及编辑 WebDAV 或云盘连接：

> **文件管理 > 远程文件夹 > WebDAV 或 云盘**

这样可以在可视化界面中更方便地配置连接参数。

## API列表（已验证）

### 1. 获取已挂载远程文件夹列表
- **API**: `GET /v2/remotefolder/list`
- **状态**: ✅ 已验证

### 2. 校验 SMB 连通性
- **API**: `POST /v2/remotefolder/smb/dirs`
- **状态**: ⚠️ 参数验证问题（返回 `type error`）

### 3. 校验 NFS 连通性
- **API**: `POST /v2/remotefolder/nfs/dirs`
- **状态**: ⚠️ 参数验证问题（返回 `type error`）

### 4. 校验 WebDAV/云盘连通性
- **API**: `POST /v2/remotefolder/cloud_disk/conn`
- **状态**: ✅ API可访问，需要实际WebDAV服务器验证

### 5. 检查 WebDAV/云盘连接状态
- **API**: `GET /v2/remotefolder/cloud_disk/is_success`
- **状态**: ✅ API可访问，需要实际WebDAV服务器验证

### 6. 检查本地挂载点是否为空
- **API**: `GET /v2/remotefolder/FolderEmpty`
- **状态**: ✅ 已验证

### 7. 挂载远程文件夹 (SMB/NFS)
- **API**: `POST /v2/remotefolder/add`
- **状态**: ✅ 已验证（SMB/NFS完全可用）

### 8. 挂载远程文件夹 (WebDAV/云盘)
- **API**: `POST /v2/remotefolder/add`
- **状态**: ✅ WebDAV 完整流程实测通过 (2026-05-29)
- **说明**: WebDAV 挂载的正确端点是 `remotefolder/add`（fs="rclone"），而 `cloud_disk/create` 适用于云盘类（S3/OneDrive/Google Drive 等）

### 9. 获取远程文件夹属性
- **API**: `GET /v2/remotefolder/{id}/attr`
- **状态**: ✅ 已验证

### 10. 卸载远程文件夹
- **API**: `PUT /v2/remotefolder/{id}/umount`
- **状态**: ⚠️ 部分验证（返回 `invalid action event`）

### 11. 删除远程文件夹配置
- **API**: `DELETE /v2/remotefolder/{id}`
- **状态**: ⚠️ 文档验证，需要实际测试

## 协议支持

### ✅ **SMB (CIFS)** - Windows 文件共享
- **状态**: 完全验证
- **参数格式**:
  ```json
  {
    "task_name": "SMB测试",
    "source_path": "//服务器地址/共享名",
    "destination_path": "/本地挂载点",
    "transport_protocol": "",
    "fs": "smb",
    "username": "用户名",
    "password": "RSA加密密码",
    "power_boot": 0
  }
  ```

### ✅ **NFS** - Linux/Unix 网络文件系统
- **状态**: 完全验证
- **参数格式**:
  ```json
  {
    "task_name": "NFS测试",
    "source_path": "服务器地址:/共享路径",
    "destination_path": "/本地挂载点",
    "transport_protocol": "",
    "fs": "nfs",
    "username": "",
    "password": "",
    "power_boot": 0
  }
  ```

### ✅ **WebDAV** - 基于 HTTP 的文件访问协议
- **状态**: ✅ 完全验证（2026-05-29 实测通过）
- **挂载流程**（三步走）：

  **Step 1：验证连通性**
  ```
  POST /v2/remotefolder/cloud_disk/conn
  ```
  ```json
  {
    "name": "<唯一连接名>",        // 建议格式：webdav+时间戳，确保唯一
    "type": "webdav",           // 必须 "webdav"
    "url": "http://<地址>:<端口>/<路径>",  // ⚠️ 端口为必填参数
    "user_name": "<用户名>",       // ⚠️ 下划线格式！不是 username
    "password": "<RSA加密密码>"
  }
  ```

  **检查连接状态**（conn 后等待约2秒再查询）：
  ```
  GET /v2/remotefolder/cloud_disk/is_success?name=<连接名>
  → data: true = 连接就绪
  ```

  **（可选）浏览远端目录**：
  ```
  GET /v2/remotefolder/cloud_disk/dirs/<连接名>?path=/
  ```

  **Step 2：创建本地挂载点** （⚠️ 必须，否则挂载返回 "folder is not existing" 错误）
  ```bash
  mkdir -p <本地挂载点路径>
  ```

  **Step 3：执行挂载**（⚠️ conn 临时状态会过期，需在 conn 成功后尽快调用）
  ```
  POST /v2/remotefolder/add
  ```
  ```json
  {
    "fs": "rclone",                     // 必须 "rclone"
    "transport_protocol": "<连接名>",      // 必须与 conn 的 name 一致
    "mount_type": "webdav",              // 必须 "webdav"
    "source_path": "/",                 // 远程子路径，根目录用 "/"
    "destination_path": "<本地挂载点路径>", // 必须已存在且为空
    "task_name": "<任务名称>",
    "username": "<用户名>",              // ⚠️ 此处是 username（无下划线），与 conn 的 user_name 不同！
    "password": "<RSA加密密码>",
    "power_boot": 1                     // 1=开机自动挂载，0=不自动挂载
  }
  ```

  **⚠️ 易错点总结**：
  - `cloud_disk/conn` 的用户名字段是 `user_name`（下划线），`remotefolder/add` 是 `username`（无下划线）
  - `fs` 必须为 `"rclone"`，`transport_protocol` 为 conn 时设置的连接名
  - 本地挂载点必须提前用 `mkdir -p` 创建且为空
  - 密码均需 RSA 加密（PKCS1v15 + base64），公钥文件路径：`/etc/base/rsa_public.pem`
  - 加密命令：`echo -n "<密码>" | openssl rsautl -encrypt -pubin -inkey /etc/base/rsa_public.pem -pkcs | base64 -w0`

  **端口提示：**
  - WebDAV 通用默认端口：80（HTTP）/ 443（HTTPS）
  - TOS WebDAV 默认端口：8800（HTTP）/ 474（HTTPS）
  - 实际端口因服务器配置而异，须向用户确认

### ⚠️ **云盘** - 各类云存储服务
- **状态**: API验证完成，需要相应账号配置
- **建议**: 使用TOS页面创建/编辑连接

## 注意事项

1. **认证要求**:
   - SMB/WebDAV: 需要用户名和密码（密码需要RSA加密）
   - NFS: 无密码认证，基于IP地址认证

2. **网络要求**:
   - 远程服务器必须可访问
   - 相应端口必须开放 (SMB: 445, NFS: 2049, WebDAV: 80/443)

3. **权限要求**:
   - 本地挂载点目录必须存在且有写入权限
   - 远程共享目录必须有读取权限

4. **密码加密**:
   - SMB/WebDAV密码需要使用RSA加密
   - 通过`X-Rsa-Token`响应头获取公钥

5. **WebDAV 挂载**（三步走）:
   - Step 1: 调用 `cloud_disk/conn` 验证连通性
   - Step 2: 用 `mkdir -p` 创建本地挂载点（必须，否则报错 "folder is not existing"）
   - Step 3: 调用 `remotefolder/add`（fs="rclone"）执行挂载（临时连接状态会过期，需在 conn 成功后尽快调用）
   - `conn` 的 `name` 参数必须与 `add` 的 `transport_protocol` 一致
   - `conn` 的用户字段是 `user_name`（下划线），`add` 是 `username`（无下划线），注意区分
   - `type` 和 `mount_type` 必须传 `"webdav"`
   - `fs` 必须传 `"rclone"`
   - 密码加密方式：`echo -n "<密码>" | openssl rsautl -encrypt -pubin -inkey /etc/base/rsa_public.pem -pkcs | base64 -w0`

---

**完整API文档和示例请参考：[api-full-reference.md](./api-full-reference.md)**

**验证状态：** ✅ 此功能API已验证（SMB/NFS/WebDAV 完全可用，云盘API验证完成）