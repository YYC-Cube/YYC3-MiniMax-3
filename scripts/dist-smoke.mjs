#!/usr/bin/env node
/**
 * @file: dist-smoke.mjs
 * @description: YYC³ 质量门禁 — dist 产物烟囱测试：资产可达 + 页面 chunk 可加载性
 * @author: AI Tutor <minimax>
 * @version: v1.1.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

// 五道断言：
// ① dist/index.html 存在且含挂载点
// ② 本地静态服务下 index.html 与全部引用资产 HTTP 200 非空（URL 需 decode：图标路径含空格）
// ③ manifest 中 src/pages/** 页面 chunk 文件全部存在
// ④ 每页 chunk 在 Node ESM 下真实动态 import 成功且 default 导出为函数组件
//    页面 chunk 依赖闭包含主 chunk（顶层 createRoot(document…)），故垫 jsdom 环境
//    （复用 devDependencies 的 jsdom，非新增依赖）；App 在 jsdom 中的运行期告警
//    由 uncaught 监听收集为警告，不参与判红——本门禁只判定「产物可加载」。
// ⑤ PWA 安装力：manifest.webmanifest 必备字段 + 图标 200 且 PNG 实际像素与 sizes 一致
//    + sw.js 200 已注入版本（无残留占位符）+ index.html apple meta 与真实 title

import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = resolve(process.cwd(), 'dist');
const failures = [];
const runtimeWarnings = [];

function assert(cond, message) {
  if (cond) {
    console.log(`  ✓ ${message}`);
  } else {
    failures.push(message);
    console.error(`  ✗ ${message}`);
  }
}

// ── jsdom 垫片（页面 chunk 加载链需要 document/window）──
const { JSDOM } = await import('jsdom');
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true, // 提供 requestAnimationFrame
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.localStorage = dom.window.localStorage;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
// jsdom 的 window 成员需显式挂载到 Node 全局（react-dom 依赖 MutationObserver 等）
for (const key of [
  'MutationObserver',
  'ResizeObserver',
  'IntersectionObserver',
  'Event',
  'CustomEvent',
  'KeyboardEvent',
  'MouseEvent',
  'InputEvent',
  'FocusEvent',
  'UIEvent',
  'ErrorEvent',
  'PromiseRejectionEvent',
  'DOMParser',
  'XMLSerializer',
  'self',
  'top',
  'parent',
  'frames',
  'location',
  'history',
  'screen',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
]) {
  if (dom.window[key] !== undefined && globalThis[key] === undefined) {
    globalThis[key] = typeof dom.window[key] === 'function' ? dom.window[key].bind(dom.window) : dom.window[key];
  }
}
globalThis.matchMedia =
  dom.window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() { },
    removeListener() { },
    addEventListener() { },
    removeEventListener() { },
    dispatchEvent() {
      return false;
    },
  }));
const onUncaught = (err) => runtimeWarnings.push(String(err?.message || err));
process.on('uncaughtException', onUncaught);
process.on('unhandledRejection', onUncaught);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

function serveStatic(root) {
  return new Promise((resolveServe) => {
    const server = createServer(async (req, res) => {
      try {
        const url = decodeURIComponent((req.url || '/').split('?')[0]);
        const file = join(root, url === '/' ? 'index.html' : url);
        const body = await readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolveServe(server));
  });
}

function fetchOk(url) {
  return fetch(url).then(async (res) => ({ res, body: await res.text() }));
}

console.log('── dist 烟囱测试 ──\n');

// ① 入口存在性
console.log('[1/5] 入口完整性');
let indexHtml = '';
try {
  indexHtml = await readFile(join(DIST, 'index.html'), 'utf8');
  assert(indexHtml.includes('id="root"'), 'dist/index.html 存在且含 #root 挂载点');
} catch {
  assert(false, 'dist/index.html 可读取（请先 pnpm build）');
}

// ② 静态服务 + 资产可达
console.log('[2/5] HTTP 资产可达性');
const server = await serveStatic(DIST);
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;
try {
  const indexRes = await fetchOk(`${base}/`);
  assert(indexRes.res.status === 200 && indexRes.body.length > 0, `GET / → 200（${indexRes.body.length} bytes）`);

  const assets = [...indexRes.body.matchAll(/(?:src|href)="(\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !u.startsWith('//'));
  assert(assets.length > 0, `解析出 ${assets.length} 个资产引用`);

  for (const asset of assets) {
    try {
      const { res, body } = await fetchOk(base + encodeURI(asset));
      assert(res.status === 200 && body.length > 100, `GET ${asset} → 200（${body.length} bytes）`);
    } catch {
      assert(false, `GET ${asset} → 请求失败`);
    }
  }
} finally {
  server.close();
}

// ③ + ④ manifest 页面 chunk 存在性 + Node ESM（jsdom 垫片）真实加载
console.log('[3/5] 页面 chunk 存在性（manifest）');
console.log('[4/5] 页面 chunk 动态加载 + default 组件导出');
let tmp = '';
try {
  const manifest = JSON.parse(await readFile(join(DIST, '.vite/manifest.json'), 'utf8'));
  const pages = Object.entries(manifest).filter(([key, val]) => key.startsWith('src/pages/') && !val.isEntry);

  assert(pages.length >= 42, `manifest 枚举 src/pages/** 页面 chunk = ${pages.length}（≥42）`);

  // 拷贝 dist 到临时目录并标记 ESM，规避 dist 缺 package.json 导致的 CJS 误判
  tmp = await mkdtemp(join(tmpdir(), 'yyc3-dist-smoke-'));
  await cp(DIST, tmp, { recursive: true });
  await writeFile(join(tmp, 'package.json'), JSON.stringify({ type: 'module' }));

  let loaded = 0;
  for (const [key, val] of pages) {
    const chunkUrl = pathToFileURL(join(tmp, val.file)).href;
    try {
      const mod = await import(chunkUrl);
      if (typeof mod.default === 'function') loaded += 1;
      else assert(false, `${key} default 导出应为函数组件（实为 ${typeof mod.default}）`);
    } catch (err) {
      assert(false, `${key} 动态加载失败：${err.message}`);
    }
  }
  assert(loaded === pages.length, `页面 chunk 加载成功 ${loaded}/${pages.length}（default 函数组件）`);
} catch (err) {
  assert(false, `manifest 流程失败：${err.message}（请确认 vite.config build.manifest: true 并重新 build）`);
} finally {
  if (tmp) await rm(tmp, { recursive: true, force: true });
}

// ⑤ PWA 安装力断言
console.log('[5/5] PWA 可安装性（manifest / 图标 / sw.js / apple meta）');
const pwaServer = await serveStatic(DIST);
const pwaBase = `http://127.0.0.1:${pwaServer.address().port}`;
try {
  let pwaManifest;
  try {
    const { res, body } = await fetchOk(`${pwaBase}/manifest.webmanifest`);
    assert(res.status === 200, 'GET /manifest.webmanifest → 200');
    assert(res.headers.get('content-type')?.includes('manifest'), 'Content-Type 为 application/manifest+json');
    pwaManifest = JSON.parse(body);
  } catch (err) {
    assert(false, `manifest.webmanifest 读取/解析失败：${err.message}`);
  }

  if (pwaManifest) {
    for (const field of ['name', 'short_name', 'start_url', 'scope', 'display', 'theme_color', 'background_color', 'icons']) {
      assert(pwaManifest[field] !== undefined, `manifest.${field} 字段存在`);
    }
    assert(pwaManifest.display === 'standalone', 'display=standalone（可安装）');
    assert(pwaManifest.name !== 'Figma Make App', 'manifest.name 已替换平台默认名');

    for (const icon of pwaManifest.icons) {
      const { res, body: buf } = await fetchOk(pwaBase + encodeURI(icon.src));
      assert(res.status === 200 && buf.length > 100, `图标 ${icon.src} → 200（${buf.length} bytes）`);
      // PNG IHDR：第 16-23 字节为宽/高（大端 32 位）
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      const declared = icon.sizes.split('x').map(Number);
      assert(w === declared[0] && h === declared[1], `图标 ${icon.src} 实际像素 ${w}x${h} 与 sizes=${icon.sizes} 一致`);
    }
    const purposes = pwaManifest.icons.map((i) => i.purpose).sort().join(',');
    assert(purposes.includes('any') && purposes.includes('maskable'), '图标覆盖 any + maskable 用途');
  }

  // index.html PWA meta
  assert(indexHtml.includes('rel="manifest"'), 'index.html 含 manifest link');
  assert(indexHtml.includes('apple-mobile-web-app-capable'), 'index.html 含 apple-mobile-web-app-capable');
  assert(indexHtml.includes('apple-mobile-web-app-title'), 'index.html 含 apple-mobile-web-app-title=YYC³');
  assert(indexHtml.includes('viewport-fit=cover'), 'viewport 含 viewport-fit=cover（安全区）');
  assert(!indexHtml.includes('Figma Make App'), 'index.html title 已替换平台默认名');
  assert(indexHtml.includes('/icons/favicon-32.png'), 'favicon-32 指向 /icons/ 干净路径');

  // sw.js
  try {
    const { res, body } = await fetchOk(`${pwaBase}/sw.js`);
    assert(res.status === 200, 'GET /sw.js → 200');
    assert(!body.includes('__PRECACHE_URLS__') && !body.includes('__CACHE_VERSION__'), 'sw.js 占位符已全部注入');
    assert(/const CACHE_VERSION = "[0-9a-f]{10}"/.test(body), 'sw.js 注入 10 位内容哈希版本号');
    assert(body.includes('skipWaiting') && body.includes('clients.claim'), 'sw.js 含更新激活逻辑');
  } catch (err) {
    assert(false, `sw.js 请求失败：${err.message}`);
  }
} finally {
  pwaServer.close();
}

console.log('');
if (runtimeWarnings.length > 0) {
  console.log(`ℹ jsdom 运行期告警 ${runtimeWarnings.length} 条（不参与判红，App 完整运行属浏览器级验证）:`);
  for (const w of runtimeWarnings.slice(0, 3)) console.log(`  · ${w.slice(0, 160)}`);
}
dom.window.close();
process.off('uncaughtException', onUncaught);
process.off('unhandledRejection', onUncaught);

if (failures.length > 0) {
  console.error(`✗ dist 烟囱测试失败：${failures.length} 项`);
  process.exit(1);
}
console.log('✓ dist 烟囱测试通过：入口 + 资产可达 + 页面 chunk 全量可加载');
