---
file: CONTRIBUTING.md
description: 贡献指南 / Contributing Guide
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.1
created: 2026-10-11
updated: 2026-10-11
status: stable
tags: [文档]
category: doc
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 贡献指南 / Contributing Guide

> 「**YanYuCloudCube**」言启象限 | 语枢未来
> 「**Words Initiate Quadrants, Language Serves as Core for the Future**」
> 「**All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**」

感谢你对 YYC³ AI Family · Comic Drama 平台的贡献兴趣！本文档指导你如何高效参与协作。

---

## 环境准备 / Prerequisites

| 工具 | 版本要求 | 说明 |
| ---- | -------- | ---- |
| Node.js | ≥ 22 | 推荐 `.mise.toml` 锁定版本 |
| pnpm | ≥ 10 | 包管理器（本项目使用 pnpm workspaces 规范） |
| Git | 最新版 | 版本控制 |

### 快速启动

```bash
# 1. 克隆仓库
git clone <repository-url>
cd YYC3-MiniMax-3

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器（端口 3030 起，被占用则顺延）
PORT=3030 pnpm dev

# 4. 生产构建
pnpm build

# 5. 代码格式化
pnpm format
```

---

## 开发循环 / PDCA+ Workflow

本项目遵循 YYC³ 标准开发循环（Plan → Do → Check → Act → Archive）：

### Plan（规划）

- 明确任务目标与验收标准
- 分析影响范围与依赖关系
- 复杂任务先在 `docs/` 创建任务规划文档

### Do（执行）

- 按规范编码（见下方「代码规范」）
- 遵循现有目录结构与组件模式
- 新增页面需同步更新 `types/index.ts` 的 `PageId`、`App.tsx` 路由与 `DEV_META_REGISTRY`

### Check（质量门禁）

提交前必须全部通过：

```bash
# 1. 类型检查（0 errors）
npx tsc --noEmit

# 2. 生产构建（构建成功，主 chunk < 500KB）
pnpm build

# 3. 单元测试 + 覆盖率门禁（tokens/data/api ≥ 80%）
pnpm test:coverage

# 4. 安全审计（无高危漏洞）
pnpm audit

# 5. 格式检查
pnpm format
```

### Act & Archive（处理与归档）

- 通过 → 标记完成，更新任务状态
- 不通过 → 分析原因，制定修复方案
- 会话结束前更新 `docs/` 下的执行日志与总结文档

---

## 代码规范 / Code Standards

### 通用规则

| 规范 | 要求 |
| ---- | ---- |
| 引号 | 含撇号的字符串用双引号，或转义 |
| JSX | 标签必须闭合、括号必须配对 |
| 组件导出 | 默认导出（default export） |
| 命名 | PascalCase 组件 / camelCase 变量与函数 |
| 状态标记 | 所有任务必须有明确状态（⬜/🔄/✅/❌） |

### 设计令牌（Design Tokens）红线

> 全局设计基座定义于 [src/tokens/index.ts](src/tokens/index.ts) 与 [src/index.css](src/index.css)，**禁止绕过令牌硬编码任意颜色**。

- **四大功能域色**：仅允许以「顶边 3px 色条 / 16×16 圆角标 / 图表系列」形式出现，禁止大面积铺色
  - 生产域 `#00e0b8` · 剪辑域 `#9d7cd8` · 管理域 `#00b4d8` · 推送域 `#FF7A5C`
- **认知语义色**：只允许以「左侧 3px 认知条 / 16×16 认知圆点 / 图表辅助线」形式出现
- **AI Family 8 成员专属色**：头像尺寸一致、亮度一致，仅靠专属色区分角色（视觉平等红线）

### 页面开发模式

每个页面组件遵循统一契约：

```tsx
// 1. 页面组件接收统一 Props
interface PageProps {
  onNavigate: (page: PageId) => void;
  viewState: ViewState; // 'normal' | 'empty' | 'loading' | 'error' | 'forced'
}

// 2. 导出 DevMode 元数据（五态切换条件说明）
export const DEV_META_XXX: DevModeMeta = {
  apiEndpoint: '/api/v2/...',
  confidenceSource: '...',
  memoryScope: 'session' | 'project' | 'global',
  driveModePolicy: '...',
  stateSwitchConditions: { empty: '...', loading: '...', error: '...', forbidden: '...' },
};

// 3. 默认导出组件
export default function XxxPage({ onNavigate, viewState }: PageProps) { ... }
```

### 多端适配

遵循 [docs/YYC3-团队通用-标规文档/YYC3-多端适配-规范文档.md](docs/YYC3-团队通用-标规文档/YYC3-多端适配-规范文档.md)。

---

## 提交规范 / Commit Convention

采用 Conventional Commits：

```
<type>(<scope>): <subject>

feat(production): 新增分镜 3D 预览视图
fix(auth): 修复登录页密码强度条颜色令牌偏移
docs(readme): 补全快速开始章节
refactor(tokens): 抽取认知语义色常量
perf(editing): 时间轴裁剪虚拟滚动优化
chore(deps): 升级 vite 至 8.0.5
```

| Type | 用途 |
| ---- | ---- |
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `refactor` | 重构（不改功能） |
| `perf` | 性能优化 |
| `chore` | 构建/依赖/工具链 |

---

## 提交 PR 流程 / Pull Request Process

1. **Fork / 拉分支**：从 `main` 创建功能分支

   ```bash
   git checkout -b feat/your-feature
   ```

2. **开发并自检**：完成质量门禁四项检查
3. **提交**：遵循 Conventional Commits
4. **PR 描述**：包含变更摘要、验收标准对照、截图（UI 变更必附）
5. **Review**：至少 1 位维护者批准；CI 全绿
6. **合并**：Squash Merge 至 `main`

### PR 检查清单

- [ ] `npx tsc --noEmit` 0 errors
- [ ] `pnpm build` 成功
- [ ] 无硬编码密钥 / 敏感信息
- [ ] 新页面已注册 `PageId` + 路由 + DEV_META
- [ ] UI 变更遵循设计令牌红线
- [ ] 文档已同步更新

---

## 文档协作 / Documentation

项目文档体系位于 `docs/`，遵循 YYC³ 文档闭环规范：

- 会话产出存档至 `docs/{项目名}-{导师标识}-{YYYYMMDD}/`
- 文档必须包含 YAML Front Matter（file/description/author/version/status/tags）
- 上下文衔接使用 `CONTEXT_LINK` 标注格式

详见 [docs/YYC3-团队通用-标规文档/YYC3-团队规范-文档闭环.md](docs/YYC3-团队通用-标规文档/YYC3-团队规范-文档闭环.md)。

---

## 社区 / Community

- 行为准则：[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- 安全问题：[SECURITY.md](SECURITY.md)（请勿公开披露）
- 联系邮箱：[admin@0379.email](mailto:admin@0379.email)

---

**© 2025-2026 YanYuCloudCube™. All Rights Reserved.**

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YanYuCloudCube™. All Rights Reserved.**
