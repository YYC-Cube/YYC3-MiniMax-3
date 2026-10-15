# YYC³ AI Family · Comic Drama — 移动端 & PWA 全量落地方案

## Context（为什么做）

当前应用是桌面单端 SPA：`document.title` 因 [site.json](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/.figma/make/site.json) 缺 `title` 而回退为 `"Figma Make App"`；应用名散落在 manifest/TopNav/W1/各页 15+ 处且措辞不一；全站 logo 均为文字或 lucide 图形，`public/yyc3-icons/` 母版资源（16/32/180/192/512，尺寸已核实）零引用；无 Service Worker，PWA 不可安装；布局壳固定 `w-60` 侧栏 + `w-[400px]` 浮窗，390px 宽下侧栏挤压、面板重叠（实测截图证实）。本次实现：**名称单源 → 图标全链路 → PWA 可安装可离线 → 移动壳层 → 43 页全部响应式精修 → 全维度测试**。

### 已确认决策
1. Service Worker：**零依赖手写**（自研 Vite 插件注入预缓存，沿用项目自定义插件先例，不引新依赖）。
2. 移动导航：**底部 5 分组 Tab 栏（中央 AI FAB）+ 汉堡抽屉**（<1024px）。
3. 页面适配：**43 页全部精修**（按 NAV_GROUPS 分批）。
4. 图标：**复制到 `public/icons/` 干净文件名**，`yyc3-icons/` 母版保留不动。

### 全端名称规范（单源产出，禁止再写字面量）
| 用途 | 取值 |
|---|---|
| 全名 / `document.title` / manifest.name | `YYC³ AI Family · Comic Drama` |
| 安装短名 / short_name / apple title | `YYC³` |
| UI 品牌行 | `AI Family · Comic Drama` |
| `lang` | `zh-CN` |
| theme/background | `#0a1628` |

---

## 一、品牌与名称单源（PR-R17 上半）

**新增 `src/config/brand.ts`**（零依赖纯常量 + 类型）：`APP_NAME / APP_SHORT_NAME / APP_BRAND_LINE / APP_DESCRIPTION / THEME_COLOR / BG_COLOR / ICONS`（favicon16/32、appleTouch180、pwa192、pwa512、maskable512、品牌 mark）。

消费方全部改为引用常量，禁止再写字面量：
- [TopNav.tsx](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/layout/TopNav.tsx#L64-L78)（品牌字 + 副标）
- [W1AIFamilyWidget.tsx](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/widgets/W1AIFamilyWidget.tsx#L162-L168)（`YYC³ AI Family 协同中枢`）
- [DashboardPage.tsx:80](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/production/DashboardPage.tsx#L80)、[LoginPage.tsx:116,132](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/auth/LoginPage.tsx#L116)、[RegisterPage.tsx:171](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/auth/RegisterPage.tsx#L171)、[InviteLandingPage.tsx:122](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/auth/InviteLandingPage.tsx#L122)、[OnboardingPage.tsx:120,398](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/auth/OnboardingPage.tsx#L120)（含英文长名统一）
- `.figma/make/site.json`：补 `title`=全名、`language: "zh-CN"`、`icons.icon` 指向新 `/icons/favicon-32.png`（[vite.config.ts:103](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/vite.config.ts#L103) 的 figma 插件负责注入 title/og/32px favicon）。
- 同步更新受影响测试：[TopNav.test.tsx:32](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/layout/__tests__/TopNav.test.tsx#L32)、[W1AIFamilyWidget.test.tsx:46](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/widgets/__tests__/W1AIFamilyWidget.test.tsx#L46)。

**manifest 改为构建期生成**（消除 JSON/常量双源）：新增 `vite-plugins/pwa-manifest.mjs`，在 `generateBundle` 用 `brand.ts` 同源数据（经 `site.json` 同值或独立 JSON 导入，插件为 .mjs 不引 TS——方案：brand 常量在 `src/config/brand.ts`，插件侧用一份受控的 `pwa.brand.json`，由一致性测试强制三处同值）emit `manifest.webmanifest`；删除 public 下静态版本。字段补齐：`id:"/"`、`name`、`short_name`、`description`、`lang:"zh-CN"`、`dir:"ltr"`、`dir`、`scope:"/"`、`start_url:"/"`、`display:"standalone"`、`display_override:["standalone","minimal-ui"]`、`orientation:"any"`、`theme_color/background_color`、`categories:["productivity","entertainment"]`、`shortcuts`（工作台/任务队列/Agent 时钟环/A01 登录）、icons 192/512（`purpose:"any"`；maskable 见下）。

## 二、多端图标全链路（PR-R17 下半）

**物理落位**（`cp` 复制，不改母版）：
```
public/icons/
├── favicon-16.png  favicon-32.png        ← yyc3-icons/Web App/
├── apple-touch-icon.png (180)
├── icon-192.png  icon-512.png
└── icon-maskable-512.png                 ← 需合成，见下
```
- `index.html`：favicon 16/32、apple-touch-icon 改指 `/icons/...`；新增 `apple-mobile-web-app-capable`、`mobile-web-app-capable`、`apple-mobile-web-app-status-bar-style=black-translucent`、`apple-mobile-web-app-title=YYC³`、`format-detection`。
- **新增 `src/components/common/BrandMark.tsx`**（默认导出，size/variant：`mark | mark-text | compact`）：`<img src={ICONS.mark} alt={APP_SHORT_NAME}>` + 文字组合，单一 logo 组件。
- 替换点：TopNav 渐变文字方块、W1 浮窗头部与 FAB（Sparkles 保留为辅助图标，品牌位用 mark）、W2 头部、A01/A02/A06/A07 品牌区、Dashboard、邀请落地/Onboarding 页脚。时钟枢纽内 `YYC³` 字体标识保留（表盘设计语言）。
- **maskable 合成**：现 512 图案满版出血、不满足 80% 安全区。实施时先探测 `python3 -c "import PIL"`：可用则脚本化合成（原图缩至 66%、铺 `#0a1628` 底、输出 512 maskable）；不可用则 manifest 只声明 `any`（不阻塞可安装性），maskable 列为待补设计资产并在 PR 说明。
- 不虚构 og-image / screenshots（无真实素材）。

## 三、零依赖 PWA（PR-R18）

- `public/sw.js`（模板源，带 `__PRECACHE__` 占位）+ `vite-plugins/pwa-sw.mjs`：`closeBundle` 读取 `dist/.vite/manifest.json`（[vite.config.ts:32](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/vite.config.ts#L32) 已开启 manifest）收集入口 js/css + icons，注入缓存版本 `yyc3-{timestamp/hash}` 写回 `dist/sw.js`。
- 策略：①预缓存 App Shell（index/主 js/css/icons）；②导航请求 network-first 回退缓存 index（SPA 可离线开屏）；③同源静态 GET 资源 stale-while-revalidate；④API、跨域、非 GET 一律直通不缓存；旧版本缓存 `activate` 清理。
- `src/pwa/registerSW.ts`：仅 `import.meta.env.PROD && 'serviceWorker' in navigator` 注册（dev 不装，保 HMR）；监听更新 → `useSyncExternalStore` 暴露更新态。
- `src/components/common/PwaUpdateToast.tsx`：轻量提示「发现新版本 → 立即刷新」（复用现有按钮/配色，不引依赖）。
- `main.tsx` 调 `registerSW()`。

## 四、移动响应式壳层（PR-R19）

- **新增 `src/hooks/useIsMobile.ts`**：`matchMedia('(max-width:1023px)')` + change 监听；jsdom 测试用 matchMedia mock。
- [App.tsx](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/App.tsx#L105-L134)：新增抽屉开关态；<lg 时 [AppSidebar](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/layout/AppSidebar.tsx#L118-L123) 变为 `fixed` 遮罩抽屉（滑入/滑出、点遮罩关闭、路由变化自动关闭），≥lg 维持现状；`<main>` 加 `px-3 lg:px-6 pb-24 lg:pb-5`。
- **新增 `src/components/layout/MobileBottomNav.tsx`**（`lg:hidden fixed bottom-0`，`env(safe-area-inset-bottom)` 适配）：消费 [NAV_GROUPS](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/navigation/registry.tsx#L325-L400) 渲染 5 分组 Tab + 中央 AI FAB（打开 W1），当前组高亮。
- [TopNav](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/layout/TopNav.tsx#L56-L100)：汉堡键 `lg:hidden`；品牌副标/badge `<md` 隐藏；搜索框 <md 折叠为图标（点击开 CommandMenu）；右侧集群态沿用 `hidden lg:flex`。
- GlobalCommandMenu：面板 `w-[min(560px,92vw)]`、移动端全宽底部贴边。
- `index.css` 加全局安全：`html,body{overflow-x:hidden; -webkit-text-size-adjust:100%}`、`100dvh` 工具习惯、触控目标 ≥36px。

## 五、浮窗 / 时钟 / Auth 域精修（PR-R20）

- **W1**：`w-[400px] h-[600px]` → 移动端全屏式抽屉 `max-lg:inset-x-2 max-lg:bottom-[calc(env(safe-area-inset-bottom)+76px)] max-lg:h-[min(600px,calc(100dvh-140px))]`，桌面端不变；FAB 移动端上移避让底栏。W2 同模式。
- **ClockHub**（[ClockHubPage.tsx:182](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/pages/special/ClockHubPage.tsx#L182)）：表盘高 `max-lg:h-[62svh] lg:h-[620px]`（短边缩放算法已存在，继续复用）；头部指标 pill 小屏 `flex-wrap`/精简；数字时间与 8 节点在 0.55× 下限不重叠。
- **A01–A09（9 页）**：双栏改单栏（时钟在上/先于表单），AuthBrandClock 直径 `useIsMobile ? 300/260 : 360/300`；[AuthHeader](file:///Users/yanyu/YYC-Cube/YYC3-MiniMax-3/src/components/layout/AuthHeader.tsx#L27-L60) tabs 已有 overflow-x，补居中与触控尺寸；表单 `w-full max-w-md mx-auto`，消除 Register/Login 中 8/6 处写死宽度。

## 六、业务页面 30 页精修（PR-R21，按分组批次）

统一模式（先在 PR-R19 沉淀 `src/components/common/PageContainer.tsx` 与文档约定，页面套用）：
- 卡片网格：`grid-cols-1 md:grid-cols-2 xl:grid-cols-N`；
- 表格：一律 `overflow-x-auto` 容器包裹（不缩字、不截列）；
- 写死 `w-[Npx]` → `w-full max-w-[Npx]`；工具条 `flex-wrap` 或 `overflow-x-auto`；
- 固定高度工作台（storyboard 12 列、video 4 轨、storyboard-3d）：小屏横向滚动的工作区 + 说明性提示，不强行重排专业面板。
- 批次：生产 12 页 → 剪辑 6 页 → 管理 9 页 → 推送 3 页；每批附 390px 无横向滚动浏览器证据（`document.documentElement.scrollWidth ≤ clientWidth`）。

## 七、全维度测试矩阵

| 层 | 内容 |
|---|---|
| 单测/Vitest | brand 三处同值（brand.ts ↔ site.json ↔ 构建产物 manifest）；useIsMobile 断点/监听；manifest 生成插件纯函数（fixture）；SW 模板注入版本与资源列表；MobileBottomNav 渲染+路由高亮；抽屉开关；W1/W2 移动端类名；AuthBrandClock 响应直径。既有 175 测试不回归 |
| 烟囱 dist-smoke.mjs | 扩展断言：`/manifest.webmanifest` 合法且含可安装必备字段；每个 icon URL HTTP 200 且 PNG IHDR 实际像素与 sizes 一致；`/sw.js` 200 且含注入版本；index.html 含 manifest link、apple meta、title ≠ Figma Make App |
| 边界 check-boundaries.mjs | 新规：R10 src 禁止出现产品名字面量（白名单 `src/config/brand.ts` 与其测试）；R11 禁止硬编码 `/yyc3-icons/` 带空格 URL（统一走 ICONS 常量） |
| 浏览器实测 | 390×844（iPhone）/ 768×1024（iPad）/ 1440 三视口：43 页逐页无横向滚动截图（390 为强制门禁证据）；壳层交互（抽屉/底栏/FAB/浮窗）；A01-A04 时钟三针走时回归 |
| PWA 验收 | Chrome DevTools Application：manifest 无警告、SW activated、offline 刷新可开屏、安装按钮出现、安装后名称=YYC³/图标正确/启动屏 theme 色正确 |

最终统一跑 `pnpm verify`（typecheck + coverage 80% 阈值 + build + smoke + R1-R11 门禁）。

## 八、PR 拆分与顺序

| PR | 目标 | 关键新增 |
|---|---|---|
| R17 | 名称+图标单源与全站替换 | `config/brand.ts`、manifest 生成插件、`public/icons/`、BrandMark、一致性测试 |
| R18 | PWA 可安装/离线 | sw.js 模板、pwa-sw 插件、registerSW、更新提示、smoke 安装力断言 |
| R19 | 移动壳层 | useIsMobile、抽屉、MobileBottomNav、TopNav/main、PageContainer |
| R20 | 浮窗+时钟+9 Auth 页 | W1/W2/ClockHub/A01-A09 响应式 |
| R21 | 30 业务页分组精修 + 43 页 390px 无横滚证据 | 按生产→剪辑→管理→推送批次 |

（注：此前架构讨论中拟议的 orchestrator 轨道请顺延使用 R22 起编号，避免与本轨道冲突。）

## 验证（端到端）
1. `pnpm verify` 全绿；`pnpm check:arch` R1-R11 零违规。
2. `pnpm build && pnpm preview` 后浏览器：Application 面板安装力清单全过；断网刷新仍开屏。
3. DevTools 移动模拟 390px：逐页（命令菜单直达 43 页）无横向滚动、无面板重叠；底部 Tab/抽屉/FAB/浮窗交互正常。
4. 三端名称目检：浏览器标签、安装后桌面名、iOS 主屏名、品牌浮窗、登录页、邀请/引导页全部一致。
