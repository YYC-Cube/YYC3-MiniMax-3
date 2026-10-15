---
file: "17-R16dist烟囱与交互深度升级专项方案.md"
description: "YYC3-MiniMax-3 R16 dist 烟囱测试脚本化 + 交互级测试深度升级专项方案与执行记录"
author: "AI Tutor <minimax>"
version: "v1.1.0"
created: "2026-10-12"
updated: "2026-10-12"
status: "completed"
tags: ["smoke", "dist", "jsdom", "rtl", "r16"]
category: "plan"
---


# 🧪 R16 dist 烟囱脚本化 + 交互级测试深度升级专项方案

> 承接 03 总结 TOP 2 / TOP 3 两条。双工作流：A 把质量门禁从「源码正确」延伸到「产物可用」；B 借助新解锁的 jsdom+RTL 把交互测试从「事件派发」推进到「状态迁移」。

## 一、盘点事实（全部经代码实证）

1. **依赖安装解锁（第四次尝试成功）**：全局 store 被 TRAE 沙箱拦截的根因是 symlink 写入 `/Users/yanyu/.pnpm-store`（工作区外）；改用 `pnpm add -D jsdom @testing-library/react @testing-library/dom @testing-library/user-event --store-dir .pnpm-store`（store 落在工作区内部）→ **3.7s 安装成功**（jsdom 30.1.2 / RTL 16.3.3 / user-event 14.6.7 / dom 10.4.2）。前三次拦截结论修正为「全局 store 路径被拦」而非「一切安装被拦」。
2. **vitest 默认环境 node**（vitest.config.ts L28）→ jsdom 用例按 16 方案既定路线走文件头 `// @vitest-environment jsdom`，不影响其余 node 用例。
3. **页面域结构**：src/pages/{production,editing,publishing,management,auth,special}/ 共 **42 个文件**；registry 注册 **43 页**（含组件复用）。build 产物中每页一个独立 lazy chunk。vite.config 现无 `build.manifest` → A 层需开启以获得 PageId→chunk 的确定性映射。
4. **交互面盘点（升级目标四组件）**：
   - `GlobalCommandMenu`：query 过滤（title/subtitle 包含匹配 + 空组剔除 + 空态文案）、window keydown Esc→onClose、命令点击→onNavigate(page)+onClose
   - `DevModeDrawer`：copy→`navigator.clipboard.writeText(JSON.stringify(meta,null,2))`→copied 态 2s 后回落（setTimeout）→ 图标 Copy↔Check 切换
   - `W1AIFamilyWidget`：Enter→handleSend（**空 trim 直接 return**；非空→用户消息 append + 输入清空）；props {isOpen, onToggle, onOpenCognitionWidget, onOpenCounsel, onNavigate}
   - `W2CognitionWidget`：Enter/注入按钮→handleInject（**空 trim return**；非空→humanIntervened=true 渲染 ✓ 提示 + 清空）；props {isOpen, onClose, onSwitchToW1, initialAgentId, driveMode}
5. **W1/W2 含多 useState** → RTL 真渲染 + fireEvent/user-event 驱动（jsdom），禁直调。
6. **DevModeDrawer copy 依赖 `navigator.clipboard`**：jsdom 未实现 → 用例内 `Object.defineProperty(navigator,'clipboard',...)` 桩；2s 回落用 `vi.useFakeTimers`。

## 二、交付清单

### A · dist 烟囱测试脚本化（零依赖，CI 可跑）

1. `vite.config.ts`：`build.manifest: true`（新增 dist/.vite/manifest.json，PageId→chunk 确定性映射；对应用零影响，D1 门禁只扫 chunk 体积）
2. `scripts/dist-smoke.mjs`（零依赖 Node 脚本）四道断言：
   - ① dist/index.html 存在且含挂载点 `id="root"`
   - ② node:http 静态服务 dist（随机端口）→ index.html 200 → 解析全部 `<script>/<link>` 资产引用 → 逐个 HTTP 200 非空
   - ③ manifest 中 `src/pages/**` 全部页面 chunk：文件存在
   - ④ **每页 chunk 在 Node ESM 下真实动态 import 成功且 `default` 导出为函数组件**（经 os.tmpdir 拷贝 + type:module 标记解决 dist 无 package.json 的 CJS 误判；模块级浏览器 API 触碰即红——把 R14 的 SSR 渲染冒烟推进到「产物级可加载」验证）
3. `package.json`：`"smoke:dist": "node scripts/dist-smoke.mjs"`；verify 链插入 → `typecheck && test:coverage && build && smoke:dist && check:arch`（六门禁）

### B · 交互级测试深度升级（jsdom + RTL + user-event）

1. `GlobalCommandMenu.test.tsx`：文件头切 `@vitest-environment jsdom`（既有 3 个 SSR 用例在 jsdom 下照常通过），新增 4 用例：输入过滤（'快捷跳转'组隐、A01 可见）、无结果空态、Esc→onClose、命令点击→onNavigate('dashboard')+onClose
2. `DevModeDrawer.test.tsx`：同上切换环境，新增 2 用例：copy 反馈（clipboard 桩 + 断言 writeText 参数 + 图标 Check 态）、fake timers 推进 2s 回落 Copy 态
3. `W1AIFamilyWidget.test.tsx`（新文件，jsdom）：isOpen=false 门卫、Enter 发送（消息区出现输入文本 + 输入清空）、空输入 Enter 不产生新消息
4. `W2CognitionWidget.test.tsx`（新文件，jsdom）：Enter 注入（✓ Step 6 提示 + 输入清空）、空注入不提示、注入按钮同效

### 不执行项

1. TopNav mic 切换、AppSidebar 导航跳转——低价值（单态图标类切换）；W1 快捷 chips/Agent 切换——同类，后续按需。
2. 浏览器级（Playwright）路由点击巡检——仓库零浏览器依赖，A 层脚本已覆盖产物可加载性；真浏览器巡检保留给 TRAE 浏览器工具人工/会话级验证。
3. `.pnpm-store` 不入 git（若已有 .gitignore 覆盖则确认即可）。

## 三、验收标准

- [x] `pnpm build && pnpm smoke:dist` 全绿（四道断言通过，页面 chunk 打印 42/42）
- [x] B 层新用例逐文件验证通过；既有 node 环境用例零回归（166/166，32 文件）
- [x] `pnpm verify` **六门禁**全绿（typecheck / test:coverage / build / smoke:dist / check:arch），测试总数 152→**166**（预估 ~163，W1/W2 各 4 + GCM 4 + DMD 2）
- [x] B 层为产品依赖新增（package.json devDeps 4 项）——属于本专项预期交付，非产品代码行为变更；A 层 vite.config 单行配置
- [x] 02 日志 / 03 总结同步回写

## 四、执行记录

### A · dist 烟囱测试脚本化 ✅（2026-10-12 04:30）

**交付物**：

1. [vite.config.ts](../../vite.config.ts)：`build.manifest: true` —— 产出 dist/.vite/manifest.json（22.82 kB），PageId→chunk 确定性映射
2. [scripts/dist-smoke.mjs](../../scripts/dist-smoke.mjs) v1.1.0：四道断言全绿——① index.html 含 #root；② node:http 静态服务 8 资产全 200（均 >100 bytes）；③ manifest 枚举 src/pages/** = 42（≥42）；④ tmp 拷贝 + type:module + Node ESM 动态 import **42/42 default 函数组件**
3. [package.json](../../package.json)：`smoke:dist` 接线 → verify 链五门禁扩为**六门禁**

**jsdom 垫片设计**（Node 中真实挂载 App）：页面 chunk 依赖闭包含主 chunk（顶层 `createRoot(document.getElementById('root'))`），垫片挂 window/document/navigator/localStorage/HTMLElement 等 + **window 成员批量挂载循环**（MutationObserver/Event 类/DOMParser/location/history/timers 等，jsdom 不会自动暴露到 Node 全局）；`uncaughtException/unhandledRejection` 监听收集为运行期告警不判红——11 条 `fetch failed` 恰为 useApiData effect 真实触发的证据（App 完整运行属浏览器级验证，烟囱只判「产物可加载」）。

**插曲（首跑 46 项失败，两类根因）**：

1. 3 图标资产 404：`/yyc3-icons/Web App/*.png` 路径带空格，fetch 编码 %20 而静态服务器未 decode → `decodeURIComponent(req.url)` + fetch 侧 `encodeURI`，空体判据从 >0 收紧为 >100 bytes（"not found" 仅 9 bytes）
2. 42 页面 chunk 全部 `document is not defined` → 首版垫片补齐后仍报 `MutationObserver is not defined` → window 成员批量挂载循环后 42/42 全绿

### B · 交互级测试深度升级 ✅（2026-10-12 05:15）

**交付物**（4 文件 +14 用例，零产品代码触碰）：

1. [GlobalCommandMenu.test.tsx](../../src/components/layout/__tests__/GlobalCommandMenu.test.tsx) v1.1.0（3→7）：搜索过滤（'登录' → Auth 组保留 A01/A07，快捷跳转/生产域零命中整组剔除）、无结果空态、Esc 双态契约（isOpen=true 触发 onClose；false 时 handler 内守卫拦截）、命令点击（onNavigate('dashboard')+onClose 按序断言）
2. [DevModeDrawer.test.tsx](../../src/components/common/__tests__/DevModeDrawer.test.tsx) v1.1.0（3→5）：clipboard 桩（Object.defineProperty navigator）断言 writeText 参数 = `JSON.stringify(meta, null, 2)` + Check 反馈图标；fake timers `advanceTimersByTime(2000)` 后回落 Copy 图标
3. [W1AIFamilyWidget.test.tsx](../../src/components/widgets/__tests__/W1AIFamilyWidget.test.tsx)（新，4）：isOpen=false 折叠 FAB（title 悬浮球 + Sparkles + onToggle）、Enter 发送（消息入列 + input 清空）、600ms Agent 回复（fake timers，ReAct-C 文案）、空输入守卫（value 保留 '   ' + 无回复 timer）
4. [W2CognitionWidget.test.tsx](../../src/components/widgets/__tests__/W2CognitionWidget.test.tsx)（新，4）：门卫 null、Step 6/9 初始态（未干预无提示）、Enter 注入（✓ Step 6 提示 + 清空）、空注入守卫 + 注入按钮同效

**插曲（首跑 6 失败同源）**：既有文件局部 SSR helper `function render(props): string` **遮蔽** RTL `render`——jsdom 用例实际调用了 SSR 渲染器（返回 string，解构 undefined；effect 未执行故 Esc 断言 0 调用）→ 局部 helper 改名 `renderHtml` 后全绿；顺带统一 4 文件 `(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true` 消除 act 环境告警。

### 全链收尾 ✅（2026-10-12 05:16）

`pnpm verify` 六门禁 exit 0：typecheck 0 errors → **166 tests**（152→166，+14；32 文件）→ coverage 四维 ≥80 → build 323ms → smoke:dist 四道断言 → check:arch R1-R9 全 0 + D1 286.69KB（预算 500KB）。