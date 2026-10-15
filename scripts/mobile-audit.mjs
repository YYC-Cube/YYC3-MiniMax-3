#!/usr/bin/env node
/**
 * @file mobile-audit.mjs
 * @description 移动端 390×844 全量页面横向溢出审计（Playwright）
 *   - PageId 列表从 src/types/core.ts 联合类型实时解析（单源，新增页面自动纳入）
 *   - 经 ?p=<pageId> 深链逐页打开，测量 documentElement/body 横向溢出
 *   - 定位首个越界元素（right > innerWidth）输出可定位类名
 *   - 越界页与关键页全屏截图至 .tmp/mobile-shots/
 *   - 附加：抽屉开合、底栏存在、AI FAB 全屏化三项壳层交互断言
 * 用法：pnpm exec node scripts/mobile-audit.mjs [baseUrl]
 * @created 2026-10-15
 */

import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:3030";
const SHOT_DIR = join(ROOT, ".tmp", `mobile-shots-${process.env.VW ?? 390}`);
const VIEWPORT = {
  width: Number(process.env.VW ?? 390),
  height: Number(process.env.VH ?? 844),
};
const KEY_PAGES = new Set(["auth-login", "auth-register", "family", "dashboard"]);

function loadPageIds() {
  const src = readFileSync(join(ROOT, "src", "types", "core.ts"), "utf8");
  const block = src.slice(src.indexOf("PageId ="), src.indexOf(";", src.indexOf("PageId =")));
  const ids = [...block.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

async function auditPage(page, id) {
  const errors = [];
  page.removeAllListeners("pageerror");
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

  await page.goto(`${BASE}/?p=${id}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const vw = window.innerWidth;
    const doc = document.documentElement;
    const offenders = [];
    let checked = 0;
    for (const el of document.querySelectorAll("body *")) {
      checked += 1;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.display === "none") continue;
      // 仅报真正越右界的可见元素（容忍 1px 亚像素）
      if (r.right > vw + 1 && r.left >= -1) {
        const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 4).join(".") : "";
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: `.${cls}`,
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
        if (offenders.length >= 5) break;
      }
    }
    // 内容逃逸检测：scrollWidth 明显大于 clientWidth，且 overflow-x=visible
    // （内容真实外溢、用户不可达）。hidden/clip 视为有意裁切不报；
    // auto/scroll 为有意横滑容器不报。最终仅保留「最深层」外溢元素（祖先折叠）。
    const allClipped = [];
    const clipCandidates = document.querySelectorAll(
      "table, [class*='grid'], [class*='flex'], h1, h2, h3, p, span, div, input"
    );
    for (const el of clipCandidates) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (cs.position === "fixed") continue; // 固定层（顶栏/抽屉/浮窗）独立于文档流
      const rect = el.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 16) continue;
      const extra = el.scrollWidth - el.clientWidth;
      if (extra <= 4) continue;
      if (cs.overflowX !== "visible") continue;
      if (el === document.body || el === doc) continue;
      allClipped.push(el);
    }
    const deepest = allClipped.filter((el) => !allClipped.some((other) => other !== el && el.contains(other)));
    const clipped = deepest.slice(0, 6).map((el) => {
      const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 3).join(".") : "";
      return {
        tag: el.tagName.toLowerCase(),
        cls: `.${cls}`,
        extra: el.scrollWidth - el.clientWidth,
        text: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 28),
      };
    });
    return {
      vw,
      docScrollW: doc.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      offenders,
      clipped,
      checked,
    };
  });

  const overflow = Math.max(metrics.docScrollW, metrics.bodyScrollW) - VIEWPORT.width;
  if (process.env.SHOTS_ALL || overflow > 1 || metrics.clipped.length || KEY_PAGES.has(id)) {
    await page.screenshot({ path: join(SHOT_DIR, `${id}.png`), fullPage: true });
  }
  return { id, overflow, ...metrics, errors };
}

async function auditShell(page) {
  const checks = [];
  await page.goto(`${BASE}/?p=dashboard`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  // 1) 底栏存在且可见（5 槽位导航）
  const bottomNav = page.locator('nav[aria-label="移动端主导航"]');
  checks.push(["底栏可见", await bottomNav.isVisible().catch(() => false)]);
  checks.push(["底栏 5 槽位", (await bottomNav.locator("button").count().catch(() => 0)) === 5]);

  // 2) 汉堡键打开抽屉（aside 贴左可见）
  await page.getByRole("button", { name: "打开导航菜单" }).click();
  await page.waitForTimeout(300);
  const drawerVisible = await page.locator("aside").first().evaluate((el) => {
    const t = el.getBoundingClientRect();
    return t.left === 0 && t.width > 200;
  }).catch(() => false);
  checks.push(["汉堡键打开抽屉", drawerVisible]);
  await page.screenshot({ path: join(SHOT_DIR, "shell-drawer.png") });

  // 3) 点遮罩关闭 → aside 滑出视口
  await page.getByRole("button", { name: "关闭导航菜单" }).click({ force: true }).catch(() => { });
  await page.waitForTimeout(350);
  const drawerClosed = await page.locator("aside").first().evaluate((el) => {
    return el.getBoundingClientRect().right <= 1;
  }).catch(() => false);
  checks.push(["遮罩点击关闭抽屉", drawerClosed]);

  // 4) 底栏中央 FAB 打开 W1，移动端为全屏（重新导航确保无遮罩残留）
  await page.goto(`${BASE}/?p=dashboard`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.locator('nav[aria-label="移动端主导航"] button[aria-label="打开 AI Family 协同浮窗"]').click();
  await page.waitForTimeout(400);
  const fabFull = await page.evaluate(() => {
    // W1 展开容器：fixed inset-0 宽高≈视口（lg:inset-auto 类仍保留但匹配 fixed+inset-0）
    const panels = [...document.querySelectorAll(".fixed")].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.position === "fixed";
    });
    const full = panels.find((el) => {
      const r = el.getBoundingClientRect();
      return r.width >= window.innerWidth - 1 && r.height >= window.innerHeight - 1;
    });
    return !!full;
  }).catch((e) => `ERR:${String(e).slice(0, 80)}`);
  checks.push(["W1 浮窗移动端全屏", fabFull === true]);
  await page.screenshot({ path: join(SHOT_DIR, "shell-w1-fullscreen.png") });

  return checks;
}

const run = async () => {
  mkdirSync(SHOT_DIR, { recursive: true });
  const ids = loadPageIds();
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const results = [];
  const shellOnly = process.argv.includes("--shell");
  for (const id of shellOnly ? [] : ids) {
    try {
      results.push(await auditPage(page, id));
    } catch (e) {
      results.push({ id, error: String(e).slice(0, 200) });
    }
  }

  let shellChecks = [];
  if (VIEWPORT.width < 1024) {
    // 移动壳层（底栏/汉堡抽屉/FAB）仅在 lg 断点以下存在
    try {
      shellChecks = await auditShell(page);
    } catch (e) {
      shellChecks = [["壳层审计异常", String(e).slice(0, 200)]];
    }
  } else {
    shellChecks = [["桌面视口(≥1024)跳过移动壳层检查", true]];
  }

  await browser.close();

  const bad = results.filter((r) => typeof r.overflow === "number" && r.overflow > 1);
  const errored = results.filter((r) => (r.errors?.length ?? 0) > 0 || r.error);

  console.log(`\n=== ${VIEWPORT.width}×${VIEWPORT.height} 横向溢出/裁切审计（${results.length} 页） ===`);
  for (const r of results) {
    if (r.error) { console.log(`  ⚠ ${r.id.padEnd(22)} 导航失败: ${r.error}`); continue; }
    const mark = r.overflow > 1 || r.clipped.length ? "✗" : "✓";
    const tail = r.overflow > 1
      ? ` 溢出 ${r.overflow}px → ${r.offenders.map((o) => `${o.tag}${o.cls}(right=${o.right})`).join(" | ")}`
      : "";
    const clipTail = r.clipped.length
      ? `\n        裁切×${r.clipped.length} → ${r.clipped.map((c) => `${c.tag}${c.cls}(+${c.extra}px)"${c.text}"`).join(" | ")}`
      : "";
    console.log(`  ${mark} ${r.id.padEnd(22)} scrollW=${r.docScrollW}${tail}${clipTail}`);
  }
  console.log("\n=== 壳层交互 ===");
  for (const [name, ok] of shellChecks) console.log(`  ${ok === true ? "✓" : "✗"} ${name}: ${String(ok)}`);
  if (errored.length) {
    console.log("\n=== 页面运行时错误 ===");
    for (const r of errored) console.log(`  ! ${r.id}: ${(r.error ?? r.errors?.[0])}`);
  }
  console.log(`\n截图目录: ${SHOT_DIR}`);
  const shellBad = shellChecks.some(([, ok]) => ok !== true);
  process.exit(bad.length || shellBad ? 1 : 0);
};

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
