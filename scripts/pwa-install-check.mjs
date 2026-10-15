#!/usr/bin/env node
/**
 * @file pwa-install-check.mjs
 * @description PWA 真实安装力/离线开屏实测（Playwright，针对 preview 构建产物）
 *   1) manifest.webmanifest 可访问且 display=standalone、icons/shortcuts 齐备
 *   2) Service Worker 成功注册并激活、静态缓存建立
 *   3) 切离线后重新导航，App Shell 仍可开屏（network-first 回退缓存）
 * 前置：pnpm build && pnpm preview --port 4173
 * 用法：node scripts/pwa-install-check.mjs [baseUrl]
 * @created 2026-10-15
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4173";
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const offlineErrors = [];
let offlinePhase = false;
page.on("console", (m) => {
  if (offlinePhase && m.type() === "error") offlineErrors.push(m.text());
});

await page.goto(BASE, { waitUntil: "domcontentloaded" });
// 等待 registerSW（window load 后注册）→ activated
await page.waitForTimeout(2500);

const sw = await page.evaluate(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  const r = regs[0];
  return {
    count: regs.length,
    script: r?.active?.scriptURL ?? r?.waiting?.scriptURL ?? "",
    state: r?.active?.state ?? r?.waiting?.state ?? "",
    cacheNames: await caches.keys(),
  };
});

const manifest = await page.evaluate(async () => {
  const res = await fetch("/manifest.webmanifest");
  const j = await res.json();
  return {
    status: res.status,
    display: j.display,
    name: j.name,
    short: j.short_name,
    icons: j.icons?.length,
    shortcuts: j.shortcuts?.length,
  };
});

// 离线开屏（深链 ?p=clock-hub 一并验证 SPA 离线回退）
await ctx.setOffline(true);
offlinePhase = true;
let offline = { ok: false, title: "", hasRoot: false };
try {
  const resp = await page.goto(`${BASE}/?p=clock-hub`, { waitUntil: "domcontentloaded" });
  offline.ok = resp === null || resp.status() === 200;
  // 轮询等待 React 挂载（SW 缓存命中后模块仍需解析执行），最多 5s
  for (let i = 0; i < 50; i++) {
    offline.hasRoot = await page.evaluate(
      () => !!document.querySelector("#root") && document.querySelector("#root").children.length > 0
    );
    if (offline.hasRoot) break;
    await page.waitForTimeout(100);
  }
  offline.title = await page.title();
  offline.consoleErrors = [...offlineErrors];
} catch (e) {
  offline.error = String(e).slice(0, 120);
}
offlinePhase = false;
await ctx.setOffline(false);

const result = { manifest, sw, offline };
console.log(JSON.stringify(result, null, 2));

const pass = manifest.status === 200 && manifest.display === "standalone"
  && sw.count >= 1 && sw.state === "activated"
  && sw.cacheNames.some((n) => n.startsWith("yyc3-static-"))
  && offline.ok && offline.hasRoot;
console.log(pass ? "\n✓ PWA 安装力/离线实测通过" : "\n✗ PWA 实测失败");
await browser.close();
process.exit(pass ? 0 : 1);
