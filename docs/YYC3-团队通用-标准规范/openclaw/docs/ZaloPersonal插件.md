# Zalo Personal 插件

通过使用原生 `zca-js` 的插件，为 OpenClaw 提供 Zalo Personal 支持，以自动操作普通 Zalo 用户账号。无需外部 `zca`/`openzca` CLI 二进制文件。

<Warning>
非官方自动化可能导致账号被停用或封禁。使用风险由你自行承担。
</Warning>

## 命名

渠道 ID 为 `zalouser`，以明确表示该渠道自动操作的是**个人 Zalo 用户账号**（非官方）。另一个 `zalo` 渠道 ID 用于官方内置的 Zalo Bot/webhook 集成，参见 [Zalo](/zh-CN/channels/zalo)。

## 运行位置

此插件在 **Gateway 网关进程内**运行。对于远程 Gateway 网关，请在该主机上安装并配置插件，然后重启 Gateway 网关。

## 安装

### 从 npm 安装

```bash
openclaw plugins install @openclaw/zalouser
```

使用不带版本号的软件包可跟随当前官方发布标签；仅在需要可复现安装时固定确切版本。之后重启 Gateway 网关。

### 从本地文件夹安装（开发）

```bash
PLUGIN_SRC=./path/to/local/zalouser-plugin
openclaw plugins install "$PLUGIN_SRC"
cd "$PLUGIN_SRC" && pnpm install
```

之后重启 Gateway 网关。

## 配置

渠道配置位于 `channels.zalouser` 下（而非 `plugins.entries.*`）：

```json5
{
  channels: {
    zalouser: {
      enabled: true,
      dmPolicy: "pairing",
    },
  },
}
```

有关私信/群组访问控制、多账号设置、环境变量和故障排查，请参阅 [Zalo 个人渠道配置](/zh-CN/channels/zalouser)。

## CLI

```bash
openclaw channels login --channel zalouser
openclaw channels login --channel zalouser --account <name>
openclaw channels logout --channel zalouser
openclaw channels status --probe
openclaw message send --channel zalouser --target <threadId> --message "Hello from OpenClaw"
openclaw directory self --channel zalouser
openclaw directory peers list --channel zalouser --query "name"
openclaw directory groups list --channel zalouser --query "name"
openclaw directory groups members --channel zalouser --group-id <id>
```

## 智能体工具

工具名称：`zalouser`

操作：`send`、`image`、`link`、`friends`、`groups`、`me`、`status`

渠道消息操作（并非智能体工具）还支持使用 `react` 添加消息表情回应。

## 相关内容

- [Zalo 个人渠道配置](/zh-CN/channels/zalouser)
- [Zalo（官方 Bot/webhook 渠道）](/zh-CN/channels/zalo)
- [构建插件](/zh-CN/plugins/building-plugins)
- [ClawHub](/clawhub)
