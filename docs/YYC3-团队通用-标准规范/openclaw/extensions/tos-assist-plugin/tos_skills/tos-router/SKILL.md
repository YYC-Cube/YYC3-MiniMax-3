---
name: "tos-router"
description: "\"TOS skill 强制路由器。以下特定 TOS 领域的用户提问（注意：非全部 TOS 领域，仅限下列领域）必须先经过本路由器判断意图，再路由到正确 skill，严禁跳过路由器直接调用任何 TOS 操作 skill 或售后回答 skill。当前覆盖领域：加密共享文件夹、协议访问（SMB/NFS/WebDAV）、ACL 权限、AD 域、LDAP，应用安装/启用/禁用/卸载/默认安装位置，rsync 备份、BTRFS 快照、Time Machine，文件共享/分享链接、收藏夹、安全箱、回收站、远程文件夹挂载，WiFi、Telnet、媒体索引、端口、OVS Bond/PPTP/OpenVPN/L2TP/流量管理/DDNS，存储池/卷的创建/删除/扩展/格式化、S.M.A.R.T. 测试、Hyper Cache，时间/时区、语言、开关机计划、UPS、磁盘休眠、定时任务、SMTP、安全隔离、服务/进程管理、SPC、配置恢复/重置、恢复出厂、开发者模式。根据用户意图（提问 vs 执行）路由到正确的 skill：提问→tos-after-sale-support（仅回答），执行→对应操作 skill（仅执行）。\""
---


# TOS Skill Router

版本: 1.000

## 核心目标

当用户的问题落在集合 A（TOS 操作领域）内时，判断用户意图并路由到正确的 skill，避免"执行类 skill 被用来回答问题"或"回答类 skill 被用来执行操作"的错配。

## 集合 A：TOS 操作领域

以下领域的用户 query 会触发本路由器的判断逻辑：

| 领域 | 覆盖内容 | 对应操作 skill |
|------|---------|--------------|
| 访问权限 | 加密共享文件夹、协议访问（SMB/NFS/WebDAV）、ACL 权限、AD 域、LDAP | `tos-access-permissions` |
| 应用中心 | 应用安装、启用/禁用、卸载、默认安装位置 | `tos-app-center` |
| 备份中心 | rsync 备份、BTRFS 快照、Time Machine | `tos-backup-center` |
| 文件管理 | 文件共享/分享链接、收藏夹、安全箱、回收站、远程文件夹挂载 | `tos-file-manager` |
| 网络管理 | WiFi、Telnet、媒体索引、端口、OVS Bond/PPTP/OpenVPN/L2TP/流量管理/DDNS 等高风险网络操作 | `tos-network-manager` |
| 存储管理 | 存储池/卷的创建/删除/扩展/格式化、S.M.A.R.T. 测试、Hyper Cache | `tos-storage` |
| 系统管理 | 时间/时区、语言、开关机计划、UPS、磁盘休眠、定时任务、SMTP、安全隔离、服务/进程管理、SPC、配置恢复/重置、恢复出厂、开发者模式 | `tos-system-mgmt` |

## 路由逻辑

### 步骤 1：判断是否落在集合 A 内

扫描用户 query，判断是否涉及上述任一领域。如果完全不涉及，不做任何路由，按正常流程处理。

### 步骤 2：判断用户意图——提问 vs 执行

**执行意图**的判断标准（满足任一即判定为执行）：
- 用户明确要求执行某个操作动作（如"帮我创建…""开启…""删除…""安装…""恢复…""重置…""挂载…"等）
- 用户指令中包含祈使语气或动作动词，期望系统做出改变

**提问意图**的判断标准（满足任一即判定为提问）：
- 用户在询问"为什么""怎么操作""是什么""能不能""如何"等知识性问题
- 用户描述了一个问题/故障/现象，希望获得解释或解决方案
- 用户没有明确要求立即执行操作，只是在咨询

⚠️ **边界情况处理：**
- 用户既问了问题又要求执行 → 先通过 `tos-after-sale-support` 回答问题部分，再路由到对应操作 skill 执行操作部分
- 意图模糊，无法确定 → **默认按提问意图处理**，路由到 `tos-after-sale-support`，因为误把提问路由到执行 skill 会产生无用操作，而误把执行路由到回答 skill 最多只回答不操作，危害更小

### 步骤 3：路由

| 意图 | 路由目标 | 说明 |
|------|---------|------|
| 提问 | `tos-after-sale-support` | 仅回答，搜索官方文档给出带出处的解答 |
| 执行 | 对应的操作 skill | 仅执行，按照 skill 流程完成操作 |

### 步骤 4：执行路由

根据步骤 3 的结果，读取目标 skill 的 SKILL.md 并严格按照其流程执行。

## 输出规则

路由判断本身不需要输出任何内容。直接执行路由目标 skill 的流程，按该 skill 的输出规则输出结果即可。

## 示例

| 用户 query | 领域匹配 | 意图判断 | 路由目标 |
|-----------|---------|---------|---------|
| "数据删除了怎么恢复" | 文件管理（回收站） | 提问 | `tos-after-sale-support` |
| "帮我清空回收站" | 文件管理（回收站） | 执行 | `tos-file-manager` |
| "为什么删除文件没释放空间" | 文件管理 / 备份中心 | 提问 | `tos-after-sale-support` |
| "创建一个加密共享文件夹" | 访问权限 | 执行 | `tos-access-permissions` |
| "SMB 和 NFS 有什么区别" | 访问权限 | 提问 | `tos-after-sale-support` |
| "帮我装一下 Docker" | 应用中心 | 执行 | `tos-app-center` |
| "Docker 怎么用" | 应用中心 | 提问 | `tos-after-sale-support` |
| "拍一个快照" | 备份中心 | 执行 | `tos-backup-center` |
| "快照和备份有什么区别" | 备份中心 | 提问 | `tos-after-sale-support` |