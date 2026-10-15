/**
 * @file: pwa-sw.test.mjs
 * @description: Service Worker 生成插件纯函数测试 — 预缓存收集/去重/全量离线、
 *               版本哈希稳定性、模板注入无残留占位符。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildPrecacheList,
  collectPrecacheUrls,
  hashVersion,
  injectSw,
} from "./pwa-sw.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = readFileSync(join(HERE, "sw-template.js"), "utf8");

const fixtureManifest = {
  "src/main.tsx": {
    file: "assets/index-abc.js",
    isEntry: true,
    css: ["assets/index-def.css"],
  },
  "src/pages/Foo.tsx": { file: "assets/Foo-111.js" },
  "src/pages/Bar.tsx": { file: "assets/Bar-222.js", css: ["assets/bar.css"] },
  // 重复 chunk（被多页共享）：必须去重
  "src/pages/Baz.tsx": { file: "assets/Foo-111.js" },
};

describe("collectPrecacheUrls", () => {
  it("收集全部 js/css chunk（全量离线）并去重排序", () => {
    const urls = collectPrecacheUrls(fixtureManifest);
    expect(urls).toEqual([
      "/assets/Bar-222.js",
      "/assets/Foo-111.js",
      "/assets/bar.css",
      "/assets/index-abc.js",
      "/assets/index-def.css",
    ]);
  });

  it("忽略非 js/css 资产（字体/图片不预缓存，走运行时 SWR）", () => {
    const urls = collectPrecacheUrls({ x: { file: "assets/logo.png" } });
    expect(urls).toEqual([]);
  });
});

describe("buildPrecacheList", () => {
  it("App Shell(/) 与图标在清单最前，保证离线开屏", () => {
    const list = buildPrecacheList(["/assets/a.js"], {
      pwa192: "/icons/icon-192.png",
      pwa512: "/icons/icon-512.png",
      maskable512: "/icons/icon-maskable-512.png",
    });
    expect(list[0]).toBe("/");
    expect(list).toContain("/icons/icon-192.png");
    expect(list).toContain("/assets/a.js");
  });
});

describe("hashVersion", () => {
  it("同内容同版本、变内容变版本", () => {
    expect(hashVersion(["a", "b"])).toBe(hashVersion(["a", "b"]));
    expect(hashVersion(["a", "b"])).not.toBe(hashVersion(["a", "c"]));
    expect(hashVersion(["a"])).toMatch(/^[0-9a-f]{10}$/);
  });
});

describe("injectSw", () => {
  it("注入版本与清单后无占位符残留，且含离线/更新关键逻辑", () => {
    const urls = buildPrecacheList(["/assets/a.js"], {
      pwa192: "/icons/icon-192.png",
      pwa512: "/icons/icon-512.png",
      maskable512: "/icons/icon-maskable-512.png",
    });
    const sw = injectSw(TEMPLATE, { version: "abc1234567", urls });
    expect(sw).not.toContain("__PRECACHE_URLS__");
    expect(sw).not.toContain("__CACHE_VERSION__");
    expect(sw).toContain('const CACHE_VERSION = "abc1234567"');
    expect(sw).toContain("yyc3-static-${CACHE_VERSION}");
    expect(sw).toContain('"/"');
    expect(sw).toContain("mode === \"navigate\"");
    expect(sw).toContain("SKIP_WAITING");
    // 回归：Vary: Origin 会让 addAll 预缓存与 crossorigin 模块请求匹配失败，必须 ignoreVary
    expect(sw).toContain("ignoreVary: true");
    // 回归：离线时 cache-only 短路，不发起必败的 revalidation
    expect(sw).toContain("!self.navigator.onLine");
  });
});
