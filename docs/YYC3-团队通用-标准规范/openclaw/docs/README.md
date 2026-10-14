# OpenClaw 文档中心

> _OpenClaw — 开源 AI 智能体运行时，连接你的工具、渠道和模型_

---

## 📋 目录

- [快速开始](#-快速开始)
- [安装指南](#-安装指南)
- [核心概念](#-核心概念)
- [工具概览](#-工具概览)
- [模型提供商](#-模型提供商)
- [聊天渠道](#-聊天渠道)
- [平台支持](#-平台支持)
- [Gateway 网关](#-gateway-网关)
- [CLI 参考](#-cli-参考)
- [技能系统](#-技能系统)
- [插件生态](#-插件生态)
- [节点系统](#-节点系统)
- [语音与媒体](#-语音与媒体)
- [自动化](#-自动化)
- [开发者设置](#-开发者设置)
- [帮助与故障排查](#-帮助与故障排查)
- [环境变量](#-环境变量)
- [相关资源](#-相关资源)

---

## 🚀 快速开始

OpenClaw 是一个开源 AI 智能体运行时，你可以通过以下方式快速上手：

### 安装脚本（推荐）

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 验证安装

```bash
openclaw --version      # 确认 CLI 可用
openclaw doctor         # 检查配置问题
openclaw gateway status # 验证 Gateway 网关正在运行
```

### 系统要求

| 环境　　 | 版本要求　　　　　　　　　|
| ----------| ---------------------------|
| Node.js　| 22.22.3+ / 24.15+ / 25.9+ |
| Python　 | 3.10+（部分技能需要）　　 |
| pnpm　　 | 仅从源码构建时需要　　　　|
| 操作系统 | macOS、Linux、Windows　　 |

> 📖 详细安装说明请参阅：[安装指南](https://docs.openclaw.ai/zh-CN/install)
>
> 📖 Showcase 项目展示：[社区项目](https://docs.openclaw.ai/zh-CN/start/showcase)

---

## 📦 安装指南

### 安装方法

| 方法                  | 命令                                                              |
| --------------------- | ----------------------------------------------------------------- |
| **安装脚本（推荐）**  | `curl -fsSL https://openclaw.ai/install.sh \| bash`               |
| **本地前缀安装**      | `curl -fsSL https://openclaw.ai/install-cli.sh \| bash`           |
| **npm 全局安装**      | `npm install -g openclaw@latest && openclaw onboard --install-daemon` |
| **pnpm 全局安装**     | `pnpm add -g openclaw@latest && pnpm approve-builds -g && openclaw onboard --install-daemon` |
| **bun 全局安装**      | `bun add -g openclaw@latest && openclaw onboard --install-daemon` |
| **从源码安装**        | `git clone https://github.com/openclaw/openclaw.git && cd openclaw && pnpm install && pnpm build && pnpm ui:build && pnpm link --global` |

### 托管部署

| 平台              | 说明                             |
| ----------------- | -------------------------------- |
| **DigitalOcean**  | VPS 托管                         |
| **Hetzner**       | Docker 部署                      |
| **Fly.io**        | 无服务器容器                     |
| **GCP**           | Compute Engine                   |
| **Azure**         | Linux VM                         |
| **Raspberry Pi**  | 家庭服务器部署                   |

### 更新与迁移

```bash
openclaw update --channel stable   # 稳定版
openclaw update --channel dev      # 开发版
openclaw backup create             # 备份配置
openclaw migrate plan codex        # Codex 迁移计划
openclaw migrate codex             # 执行迁移
```

> 📖 完整安装参考：[安装指南](https://docs.openclaw.ai/zh-CN/install)

---

## 🏛️ 核心概念

### 架构概览

OpenClaw 采用 **Gateway 网关架构**，一个长期运行的 Gateway 守护进程负责所有消息传递界面：

```
┌─────────────────────────────────────────────────────────┐
│                    Gateway 网关（守护进程）                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ WhatsApp │ │ Telegram │ │  Discord │ │  更多渠道  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 模型提供商 │ │ 工具系统  │ │ 技能系统  │               │
│  └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
    ┌─────────┐        ┌──────────┐        ┌──────────┐
    │  CLI    │        │ macOS 应用│        │  节点设备  │
    └─────────┘        └──────────┘        └──────────┘
```

### 核心组件

| 组件 | 说明 |
|------|------|
| **Gateway 网关** | 长期运行的守护进程，维护提供商连接、管理渠道、路由消息 |
| **客户端** | Mac 应用、CLI、Web 管理界面 — 通过 WebSocket 连接 |
| **节点** | macOS/iOS/Android/无头设备 — 声明 `role: node` 并公开命令 |
| **WebChat** | 使用 Gateway WS API 的静态聊天界面 |
| **插件** | 扩展渠道、提供商、工具和运行时能力 |

### 连接生命周期

```
客户端 → Gateway: connect (设备身份 + 令牌)
Gateway → 客户端: hello-ok (健康/状态快照)
客户端 → Gateway: req:agent (智能体请求)
Gateway → 客户端: event:agent (流式响应)
Gateway → 客户端: res:agent (完成结果)
```

### 安全模型

- **设备配对**：新设备需配对批准，Gateway 签发令牌
- **本地信任**：Loopback 连接可自动获批
- **Tailnet/局域网**：仍需明确配对批准
- **挑战签名**：v3 签名绑定 platform 和 deviceFamily
- **身份验证模式**：`token` / `password` / `trusted-proxy` / `none`

> 📖 详细架构：[架构概览](https://docs.openclaw.ai/zh-CN/concepts/architecture)
>
> 📖 Gateway 协议：[Gateway 协议](https://docs.openclaw.ai/zh-CN/gateway/protocol)

---

## 🛠️ 工具概览

工具是智能体可调用的类型化函数。OpenClaw 提供丰富的内置工具类别：

### 内置工具类别

| 类别 | 代表性工具 | 用途 |
|------|-----------|------|
| **⚡ 运行时** | `exec`、`process`、`code_execution` | 运行命令、管理进程 |
| **📁 文件** | `read`、`write`、`edit`、`apply_patch` | 读取和更改文件 |
| **🌐 Web** | `web_search`、`x_search`、`web_fetch` | 搜索和获取网页 |
| **🧭 浏览器** | `browser` | 操作浏览器会话 |
| **💬 消息和渠道** | `message` | 发送回复 |
| **🧠 会话和智能体** | `sessions_*`、`subagents` | 检查会话、委派工作 |
| **⏰ 自动化** | `cron`、`heartbeat_respond` | 调度工作 |
| **🔗 Gateway** | `gateway`、`nodes` | 检查网关状态 |
| **🎨 媒体** | `image`、`tts`、`music_generate` | 分析、生成媒体 |
| **🔍 工具搜索** | `tool_search`、`tool_describe` | 搜索大型工具目录 |

### 选择工具、Skills 或插件

| 场景 | 选择 |
|------|------|
| 智能体需要执行操作 | **工具** — 如 `exec`、`browser`、`web_search` |
| 智能体需要指令 | **Skills** — 可复用的 `SKILL.md` 指令包 |
| OpenClaw 需要新能力 | **插件** — 添加工具、渠道、提供商等 |

### 工具配置

```json5
{
  tools: {
    profile: "coding",
    alsoAllow: ["browser"],
    elevated: {
      enabled: true,
      allowFrom: {
        discord: ["user-id-123"],
      },
    },
  },
}
```

> 📖 完整参考：[工具概览](https://docs.openclaw.ai/zh-CN/tools)
>
> 📖 工具策略：[工具和自定义提供商](https://docs.openclaw.ai/zh-CN/gateway/config-tools)

### 子智能体

子智能体是从现有智能体运行中生成的后台智能体运行，用于并行执行任务而不阻塞主运行。

| 特性 | 说明 |
|------|------|
| **隔离运行** | 默认在独立会话中运行 |
| **上下文模式** | `isolated`（默认）/ `fork`（分叉当前对话） |
| **完成通知** | 基于推送，自动通知请求者 |
| **成本控制** | 可为子智能体设置更低成本的模型 |

```bash
# 生成子智能体
openclaw agent --agent main --message "sessions_spawn: research topic X"

# 检查子智能体状态
/subagents list
/subagents log <id>
```

> 📖 详细文档：[子智能体](/zh-CN/tools/subagents)

---

## 🤖 模型提供商

OpenClaw 支持多种模型提供商，提供统一的推理接口。

### 支持的提供商

| 提供商 | 支持模型 | 说明 |
|--------|---------|------|
| **Anthropic** | Claude 系列 | 原生支持思考级别 |
| **OpenAI** | GPT 系列 | 支持 Responses API |
| **Google** | Gemini 系列 | 支持自适应思考 |
| **xAI** | Grok 系列 | 原生 Web 搜索集成 |
| **DeepSeek** | V4 系列 | 推理能力支持 |
| **MiniMax** | M2/M3 系列 | 语音/媒体能力 |
| **Ollama** | 本地模型 | 支持多种推理级别 |
| **OpenRouter** | 多种模型 | 统一接入多提供商 |
| **Moonshot** | Kimi 系列 | 中文优化 |
| **Z.AI** | GLM 系列 | 国内推理优化 |

### 思考级别

| 级别 | 说明 | 适用模型 |
|------|------|---------|
| `off` | 关闭思考 | 所有模型 |
| `minimal` | 最低思考 | 推理模型 |
| `low` | 低强度思考 | 推理模型 |
| `medium` | 中等强度（默认） | 推理模型 |
| `high` | 高强度思考 | 推理模型 |
| `xhigh` | 额外高强度 | GPT-5.2+、Claude Opus 4.7+ |
| `adaptive` | 自适应 | Claude 4.6+、Gemini |
| `max` | 最大强度 | Claude Opus 4.7+ |
| `ultra` | 极致强度 | GPT-5.6 Sol/Terra |

### 快速模式

```bash
# 在聊天中设置
/fast auto    # 自动模式（60秒内优先级处理）
/fast on      # 启用优先级处理
/fast off     # 禁用优先级处理

# 配置默认值
/fast default # 清除会话覆盖
```

> 📖 详见：[模型概览](https://docs.openclaw.ai/zh-CN/providers)

---

## 💬 聊天渠道

OpenClaw 可以通过你已在使用的任何聊天应用与你交流。

### 官方支持的渠道

| 渠道 | 类型 | 说明 |
|------|------|------|
| **Telegram** | 核心内置 | Bot API，通过 grammY |
| **WhatsApp** | 官方插件 | 使用 Baileys，需二维码配对 |
| **Discord** | 官方插件 | Bot API + Gateway |
| **iMessage** | 核心内置 | macOS 原生集成 |
| **Signal** | 官方插件 | signal-cli，注重隐私 |
| **Slack** | 官方插件 | Bolt SDK |
| **微信** | 外部插件 | 腾讯 iLink 机器人 |
| **QQ Bot** | 官方插件 | QQ Bot API |
| **飞书** | 官方插件 | Feishu/Lark 机器人 |
| **LINE** | 官方插件 | LINE Messaging API |
| **IRC** | 官方插件 | 经典 IRC 服务器 |
| **Matrix** | 官方插件 | Matrix 协议 |
| **Zalo** | 官方插件 | Zalo Bot API |
| **语音通话** | 官方插件 | Plivo/Telnyx/Twilio 支持 |
| **WebChat** | 核心内置 | 通过 Gateway WebSocket |

> 📖 详见：[聊天渠道](https://docs.openclaw.ai/zh-CN/channels)

---

## 💻 平台支持

### 操作系统

| 平台 | 状态 | 说明 |
|------|------|------|
| **macOS** | ✅ 完整支持 | 原生菜单栏应用 + 节点模式 |
| **iOS** | ✅ 完整支持 | 移动节点应用 |
| **Android** | ✅ 完整支持 | 移动节点应用 |
| **Linux** | ✅ 完整支持 | Gateway 网关 + CLI |
| **Windows** | ✅ 支持 | Hub 应用 / PowerShell / WSL2 |

### 服务管理

| 操作系统 | 服务管理器 |
|----------|-----------|
| macOS | LaunchAgent (`ai.openclaw.gateway`) |
| Linux | systemd 用户服务 |
| Windows | 计划任务 / 启动文件夹 |

```bash
# 安装 Gateway 网关服务
openclaw gateway install
openclaw gateway status
openclaw gateway restart
openclaw gateway stop
```

> 📖 详见：[平台概览](https://docs.openclaw.ai/zh-CN/platforms)

---

## 🔗 Gateway 网关

Gateway 是 OpenClaw 的核心守护进程，负责消息路由、控制平面和渠道连接。

### 启动 Gateway

```bash
# 前台启动
openclaw gateway --port 18789

# 调试模式
openclaw gateway --port 18789 --verbose

# 强制启动（终止冲突进程）
openclaw gateway --force
```

### 验证健康状态

```bash
openclaw gateway status
openclaw gateway status --deep
openclaw gateway status --json
openclaw status
openclaw logs --follow
```

### OpenAI 兼容端点

| 端点 | 用途 |
|------|------|
| `GET /v1/models` | 列出模型（以智能体为中心） |
| `POST /v1/chat/completions` | 聊天补全 |
| `POST /v1/responses` | Responses API |
| `POST /v1/embeddings` | 嵌入向量 |

### 端口与绑定

| 设置 | 解析顺序 |
|------|---------|
| Gateway 端口 | `--port` → `OPENCLAW_GATEWAY_PORT` → `gateway.port` → 18789 |
| 绑定模式 | CLI 覆盖值 → `gateway.bind` → loopback（容器中为 auto） |

### 远程访问

```bash
# 首选：Tailscale/VPN
# 备选：SSH 隧道
ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
```

> 📖 详见：[Gateway 运行手册](https://docs.openclaw.ai/zh-CN/gateway)

---

## ⌨️ CLI 参考

`openclaw` 是主要的 CLI 入口点，提供丰富的命令体系。

### 核心命令

| 领域 | 命令 |
|------|------|
| **设置与引导** | `setup`、`onboard`、`configure`、`config`、`doctor` |
| **消息与智能体** | `message`、`agent`、`agents`、`attach`、`acp`、`mcp` |
| **健康与会话** | `status`、`health`、`sessions`、`audit` |
| **Gateway** | `gateway`、`logs`、`system` |
| **模型与推理** | `models`、`promos`、`infer`、`memory` |
| **网络与节点** | `directory`、`nodes`、`devices`、`node` |
| **运行时** | `approvals`、`sandbox`、`tui`、`browser` |
| **自动化** | `cron`、`tasks`、`hooks`、`webhooks` |
| **安全与插件** | `security`、`secrets`、`skills`、`plugins` |
| **渠道** | `pairing`、`qr`、`channels` |

### 全局标志

| 标志 | 用途 |
|------|------|
| `--dev` | 隔离状态在 `~/.openclaw-dev`，端口 19001 |
| `--profile <name>` | 隔离状态在 `~/.openclaw-<name>` |
| `--log-level <level>` | 覆盖日志级别 |
| `--json` | JSON 格式输出 |
| `--no-color` | 禁用 ANSI 颜色 |

> 📖 完整 CLI 参考：[CLI 命令](https://docs.openclaw.ai/zh-CN/cli)

---

## 🎯 技能系统

Skills 是 Markdown 指令文件，用于教智能体如何以及何时使用工具。

### 技能结构

```markdown
---
name: hello-world
description: A simple skill that prints a greeting.
---

# Hello World

When the user asks for a greeting, use the `exec` tool to run:

```bash
echo "Hello from your custom skill!"
```

```

### 加载顺序

| 优先级 | 来源 | 路径 |
|--------|------|------|
| 1 — 最高 | 工作区 Skills | `<workspace>/skills` |
| 2 | 项目智能体 Skills | `<workspace>/.agents/skills` |
| 3 | 个人智能体 Skills | `~/.agents/skills` |
| 4 | 托管/本地 Skills | `~/.openclaw/skills` |
| 5 | 内置 Skills | 随安装包提供 |
| 6 — 最低 | 额外目录 | `skills.load.extraDirs` + 插件 Skills |

### 管理命令

```bash
openclaw skills list             # 列出所有技能
openclaw skills search "web"     # 搜索技能
openclaw skills install <name>   # 安装技能
openclaw skills verify           # 验证技能
```

> 📖 详见：[Skills](/zh-CN/tools/skills) | [创建技能](/zh-CN/tools/creating-skills) | [Skills 配置](/zh-CN/tools/skills-config)

---

## 🔌 插件生态

插件可通过渠道、模型提供商、工具、技能和其他运行时能力扩展 OpenClaw。

### 安装插件

```bash
# 从 ClawHub
openclaw plugins install clawhub:<package>

# 从 npm
openclaw plugins install npm:<package>

# 从 git
openclaw plugins install git:github.com/<owner>/<repo>@<ref>

# 从本地检出
openclaw plugins install ./my-plugin
openclaw plugins install --link ./my-plugin
```

### 管理插件

```bash
openclaw plugins list             # 列出已安装插件
openclaw plugins search "search"  # 搜索插件
openclaw plugins inspect <id>     # 查看插件详情
openclaw plugins enable <id>      # 启用插件
openclaw plugins disable <id>     # 禁用插件
openclaw plugins update <id>      # 更新插件
openclaw plugins doctor           # 插件健康检查
```

### 精选插件

| 插件 | 说明 |
|------|------|
| **Firecrawl** | 高级 Web 搜索与抓取 |
| **LLM 任务** | 仅 JSON 的工作流步骤 |
| **Lobster** | 类型化工作流流水线 |
| **OpenProse** | 可移植 Markdown 工作流 |
| **语音通话** | Plivo/Telnyx/Twilio 语音 |
| **Zalo Personal** | Zalo 个人账号自动化 |
| **浏览器** | Chrome CDP 集成 |

### 插件清单结构

每个 OpenClaw 原生插件**必须**在根目录提供 `openclaw.plugin.json`：

```json
{
  "id": "voice-call",
  "configSchema": {
    "type": "object",
    "properties": {}
  }
}
```

> 📖 详见：[插件](/zh-CN/tools/plugin) | [插件清单](/zh-CN/plugins/manifest) | [插件 SDK](/zh-CN/plugins/sdk-overview)

---

## 📡 节点系统

**节点**是连接到 Gateway 的配套设备（macOS/iOS/Android/无头设备）。

### 节点管理

```bash
openclaw nodes status              # 查看节点状态
openclaw nodes describe --node <id> # 查看节点详情
openclaw devices list              # 查看配对设备
openclaw devices approve <id>      # 批准配对请求
openclaw nodes pending             # 待处理配对
openclaw nodes approve <id>        # 批准节点
openclaw nodes reject <id>         # 拒绝节点
```

### 节点主机

**节点主机**允许 Gateway 转发 `exec` 调用到远程机器执行。

```bash
# 前台启动节点主机
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"

# 安装为服务
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
openclaw node start
```

### 节点命令集

| 能力 | iOS | Android | macOS |
|------|:---:|:-------:|:-----:|
| `camera.snap` | ✅ | ✅ | ✅ |
| `camera.clip` | ✅ | ✅ | ✅ |
| `screen.record` | ✅ | ✅ | ✅ |
| `computer.act` | ❌ | ❌ | ✅ |
| `location.get` | ✅ | ✅ | ✅ |
| `system.run` | ❌ | ❌ | ✅ |

### 远程节点主机

对于远程 Gateway，可通过 SSH 隧道连接节点：

```bash
# 终端 A：创建隧道
ssh -N -L 18790:127.0.0.1:18789 user@gateway-host

# 终端 B：通过隧道连接
export OPENCLAW_GATEWAY_TOKEN="<token>"
openclaw node run --host 127.0.0.1 --port 18790 --display-name "Build Node"
```

> 📖 详见：[节点](/zh-CN/nodes) | [节点故障排查](/zh-CN/nodes/troubleshooting)

---

## 🎤 语音与媒体

### Talk 模式

Talk 模式涵盖五种运行时形态，从原生语音到实时全双工通话。

| 模式 | 说明 |
|------|------|
| **原生 macOS/iOS/Android Talk** | 本地语音识别 + TTS |
| **iOS Talk（实时）** | WebRTC 传输 |
| **浏览器 Talk** | 客户端负责的 WebRTC |
| **Android Talk（实时）** | Gateway 中继 |
| **仅转录客户端** | 字幕或听写 |

```json5
{
  talk: {
    provider: "elevenlabs",
    providers: {
      elevenlabs: {
        voiceId: "elevenlabs_voice_id",
      },
    },
    silenceTimeoutMs: 1500,
    interruptOnSpeech: true,
    realtime: {
      provider: "openai",
      mode: "realtime",
      transport: "webrtc",
      brain: "agent-consult",
    },
  },
}
```

### 语音唤醒

唤醒词是由 Gateway 管理的全局列表，支持自定义路由。

```bash
# 管理唤醒词
openclaw configure --section voicewake
```

### 媒体理解

OpenClaw 可以在回复前自动汇总传入的媒体（图像/音频/视频）。

| 能力 | 默认模型 | 最大字节 |
|------|---------|---------|
| 图像 | 自动检测 | 10MB |
| 音频 | 自动检测 | 20MB |
| 视频 | 自动检测 | 50MB |

### 语音通话插件

通过插件为 OpenClaw 提供语音通话能力。

```bash
# 安装
openclaw plugins install @openclaw/voice-call

# 验证
openclaw voicecall setup
openclaw voicecall smoke --to "+15555550123"
```

> 📖 详见：[Talk 模式](/zh-CN/nodes/talk) | [媒体理解](/zh-CN/nodes/media-understanding) | [语音唤醒](/zh-CN/nodes/voicewake)

---

## ⏰ 自动化

### Cron 任务

Cron 是 Gateway 的内置调度器。

```bash
# 创建一次性任务
openclaw cron create "2027-02-01T16:00:00Z" \
  --name "Reminder" \
  --session main \
  --system-event "Reminder text" \
  --delete-after-run

# 创建定期任务
openclaw cron create --every 1h --name "Hourly Check" \
  --session main --system-event "Hourly status check"

# 管理任务
openclaw cron list          # 列出所有任务
openclaw cron get <job-id>  # 查看任务详情
openclaw cron runs --id <id> # 查看运行历史
openclaw cron rm <job-id>   # 删除任务
```

### 调度类型

| 类型 | 标志 | 说明 |
|------|------|------|
| `at` | `--at` | 一次性时间戳 |
| `every` | `--every` | 固定间隔（`10m`、`1h`、`1d`） |
| `cron` | `--cron` | 5/6 字段 cron 表达式 |
| `on-exit` | `--on-exit` | 命令退出时触发 |

### Hooks

Hooks 是在智能体事件触发时于 Gateway 内部运行的小型脚本。

```bash
openclaw hooks list          # 列出可用 Hooks
openclaw hooks enable <name> # 启用 Hook
openclaw hooks check         # 检查 Hook 状态
openclaw hooks info <name>   # Hook 详细信息
```

### Webhooks

允许外部系统在 OpenClaw 中触发工作。

```bash
openclaw webhooks gmail setup  # 设置 Gmail webhook
```

> 📖 详见：[自动化](/zh-CN/automation) | [Cron](/zh-CN/automation/cron-jobs) | [Hooks](/zh-CN/tools/hooks)

---

## 🔧 开发者设置

### 从源码运行

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build

# 运行
pnpm openclaw setup
pnpm gateway:watch   # 开发模式 Gateway，热重载
```

### 配置存储

| 内容 | 路径 |
|------|------|
| 主配置 | `~/.openclaw/openclaw.json` |
| 工作区 | `~/.openclaw/workspace/` |
| 凭据 | `~/.openclaw/credentials/` |
| 会话 | `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite` |
| 日志 | `/tmp/openclaw/` |

### 凭据存储

```bash
WhatsApp:    ~/.openclaw/credentials/whatsapp/<accountId>/creds.json
Telegram:    channels.telegram.tokenFile（仅普通文件）
Discord:     配置/环境变量或 SecretRef
Slack:       配置/环境变量
密钥文件:    ~/.openclaw/secrets.json
```

### 定制策略

不要将自定义配置放入 OpenClaw 仓库，而是保存在外部：

```bash
配置:   ~/.openclaw/openclaw.json
工作区:  ~/.openclaw/workspace/（建议设为私有 Git 仓库）
```

### 更新工作流

```bash
git pull && pnpm install                    # 更新源码
pnpm openclaw doctor --fix                  # 修复配置
pnpm gateway:watch                          # 继续开发
```

> 📖 详见：[开发者设置](https://docs.openclaw.ai/zh-CN/start/setup)

---

## ❓ 帮助与故障排查

### 快速诊断

```bash
openclaw doctor                           # 健康检查
openclaw gateway status --deep            # Gateway 深度状态
openclaw logs --follow                    # 实时日志
openclaw channels status --probe          # 渠道探测
openclaw gateway probe                    # Gateway 可达性
```

### 常见问题

- **找不到 `openclaw` 命令**: npm 全局二进制目录不在 PATH 中
- **Gateway 启动失败**: 端口冲突 / 身份验证配置问题
- **浏览器无法启动**: Snap Chromium 或 Chrome 未正确安装
- **节点连接失败**: 配对未批准 / 防火墙阻止

### 诊断资源

| 资源 | 说明 |
|------|------|
| **故障排查** | 症状驱动的决策树 |
| **Gateway 故障排查** | Gateway 特有故障 |
| **Doctor** | `openclaw doctor` 命令 |
| **诊断标志** | 运行时诊断和详细输出 |
| **环境变量** | 加载优先级和配置 |

> 📖 详见：[帮助中心](https://docs.openclaw.ai/zh-CN/help)

---

## 🌍 环境变量

### 加载优先级（从高到低）

1. **进程环境**（Shell/launchd/systemd 继承）
2. **当前目录 `.env`**
3. **全局 `.env`**（`~/.openclaw/.env`）
4. **配置 `env` 块**（`openclaw.json`）
5. **可选的登录 Shell 导入**

### 关键变量

| 变量 | 用途 |
|------|------|
| `OPENCLAW_HOME` | 覆盖 OpenClaw 主目录 |
| `OPENCLAW_STATE_DIR` | 覆盖状态目录 |
| `OPENCLAW_CONFIG_PATH` | 覆盖配置路径 |
| `OPENCLAW_LOG_LEVEL` | 日志级别 |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway 认证令牌 |
| `OPENCLAW_GATEWAY_PORT` | Gateway 端口 |
| `OPENCLAW_THEME` | TUI 主题（`light`/`dark`） |
| `OPENCLAW_LOAD_SHELL_ENV` | 启用 Shell 环境导入 |

### 提供商 API Key

不要在 workspace `.env` 中存储 API Key，应使用以下可信来源：

- Gateway 进程环境
- `~/.openclaw/.env`
- 配置中的 `env` 块
- Secret 管理（`secrets.json`）

> 📖 详见：[环境变量](https://docs.openclaw.ai/zh-CN/help/environment)

---

## 📚 相关资源

### 文档中心

| 类别 | 说明 |
|------|------|
| [文档中心](https://docs.openclaw.ai/zh-CN/start/hubs) | 文档组织方式 |
| [文档目录](https://docs.openclaw.ai/zh-CN/reference/session-management-compaction) | 会话管理深度解析 |
| 文档索引 | 完整文件地图 |

### 社区资源

- **Discord**: [OpenClaw Discord](https://discord.gg/openclaw) — 社区交流
- **X/Twitter**: [@openclaw](https://x.com/openclaw) — 官方动态
- **GitHub**: [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — 源码
- **ClawHub**: 插件和技能市场

### 精选社区项目

| 项目 | 说明 |
|------|------|
| Dropage | 即时 HTML 部署（无需服务器） |
| Anti-scam URL checker | 诈骗域名检测（38 个数据源） |
| PR Review to Telegram | 自动 PR 审查 + Telegram 通知 |
| Music Craft | 与提供商无关的歌曲生成 |
| ClawEval | 59 种角色的模型基准测试 |
| Agents UI | 跨平台技能管理桌面应用 |

### 协议和标准

- **Gateway 协议**: WebSocket JSON 协议
- **ACP**: 智能体间通信协议
- **MCP**: 模型上下文协议
- **SSE**: 流式传输标准

---

> 本文档基于 [OpenClaw 官方文档](https://docs.openclaw.ai/zh-CN/) 整理
>
> 最后更新：2026-07-24
