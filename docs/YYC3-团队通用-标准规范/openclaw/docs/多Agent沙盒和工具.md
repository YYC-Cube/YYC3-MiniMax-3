# 多 Agent 沙盒和工具

多智能体设置中的每个智能体都可以覆盖全局沙箱和工具策略。本页介绍按智能体配置、优先级规则和示例。

> **相关链接**：[Sandboxing](/zh-CN/gateway/sandboxing) | [Sandbox vs tool policy vs elevated](/zh-CN/gateway/sandbox-vs-tool-policy-vs-elevated) | [Elevated mode](/zh-CN/tools/elevated)

> **注意**：身份验证按智能体划分作用域：每个智能体在 `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite` 中都有自己的 `agentDir` 身份验证存储。绝不要在多个智能体之间复用 `agentDir`。当智能体没有本地配置资料时，可以读取默认/主智能体的身份验证配置资料，但 OAuth 刷新令牌不会克隆到辅助智能体的存储中。如果手动复制凭据，只复制可移植的静态 `api_key` 或 `token` 配置资料。

---

## 配置示例

### Example 1: Personal + restricted family agent

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "Personal Assistant",
        "workspace": "~/.openclaw/workspace",
        "sandbox": { "mode": "off" }
      },
      {
        "id": "family",
        "name": "Family Bot",
        "workspace": "~/.openclaw/workspace-family",
        "sandbox": {
          "mode": "all",
          "scope": "agent"
        },
        "tools": {
          "allow": ["read", "message"],
          "deny": ["exec", "write", "edit", "apply_patch", "process", "browser"],
          "message": {
            "crossContext": {
              "allowWithinProvider": false,
              "allowAcrossProviders": false
            }
          }
        }
      }
    ]
  },
  "bindings": [
    {
      "agentId": "family",
      "match": {
        "provider": "whatsapp",
        "accountId": "*",
        "peer": {
          "kind": "group",
          "id": "120363424282127706@g.us"
        }
      }
    }
  ]
}
```

**结果：**

- `main` 智能体：在主机上运行，可使用全部工具。
- `family` 智能体：在 Docker 中运行（每个智能体一个容器），只能使用 `read` 并向当前对话发送消息。

### Example 2: Work agent with shared sandbox

```json
{
  "agents": {
    "list": [
      {
        "id": "personal",
        "workspace": "~/.openclaw/workspace-personal",
        "sandbox": { "mode": "off" }
      },
      {
        "id": "work",
        "workspace": "~/.openclaw/workspace-work",
        "sandbox": {
          "mode": "all",
          "scope": "shared",
          "workspaceRoot": "/tmp/work-sandboxes"
        },
        "tools": {
          "allow": ["read", "write", "apply_patch", "exec"],
          "deny": ["browser", "gateway", "discord"]
        }
      }
    ]
  }
}
```

### Example 2b: Global coding profile + messaging-only agent

```json
{
  "tools": { "profile": "coding" },
  "agents": {
    "list": [
      {
        "id": "support",
        "tools": { "profile": "messaging", "allow": ["slack"] }
      }
    ]
  }
}
```
