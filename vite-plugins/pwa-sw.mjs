/**
 * @file: pwa-sw.mjs
 * @description: 零依赖 Vite 插件 — 构建后生成 dist/sw.js：
 *               读取 .vite/manifest.json 收集全部 js/css chunk 实现「装完即全量离线」，
 *               加上 App Shell("/") 与 PWA 图标；版本号取清单内容短哈希，内容不变则版本稳定。
 *               纯函数 collectPrecacheUrls/injectSw 导出供单测。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * 从 Vite manifest 收集待预缓存 URL（去重、仅 js/css，前缀 /assets/）。
 * @param {Record<string, {file: string; css?: string[]}>} manifest
 * @returns {string[]}
 */
export function collectPrecacheUrls(manifest) {
  const urls = new Set();
  for (const entry of Object.values(manifest)) {
    if (!entry || typeof entry.file !== "string") continue;
    // Vite manifest 的 file/css 已含 "assets/" 前缀，直接以根路径拼接，避免双前缀
    if (/\.(js|css)$/.test(entry.file)) urls.add(`/${entry.file}`);
    for (const cssFile of entry.css ?? []) urls.add(`/${cssFile}`);
  }
  return [...urls].sort();
}

/**
 * 组装完整预缓存清单（App Shell + 图标 + chunks）。
 * @param {string[]} chunkUrls
 * @param {{pwa192:string;pwa512:string;maskable512:string}} iconMap
 * @returns {string[]}
 */
export function buildPrecacheList(chunkUrls, iconMap) {
  return ["/", ...Object.values(iconMap), ...chunkUrls];
}

/** 清单内容短哈希：同构建产物 → 同版本（避免无谓 SW 更新） */
export function hashVersion(urls) {
  return createHash("sha256").update(urls.join("\n")).digest("hex").slice(0, 10);
}

/** 注入版本与清单到 SW 模板 */
export function injectSw(template, { version, urls }) {
  const json = JSON.stringify(urls, null, 2);
  return template
    .replace('"__CACHE_VERSION__"', JSON.stringify(version))
    .replace("__PRECACHE_URLS__", json);
}

/** Vite 插件：构建后写出 dist/sw.js（模板不进 public，避免未处理 SW 被直接服务） */
export function pwaSwPlugin() {
  return {
    name: "yyc3-pwa-sw",
    apply: "build",
    closeBundle() {
      const root = join(HERE, "..");
      const distDir = join(root, "dist");
      const manifestPath = join(distDir, ".vite", "manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      const brand = JSON.parse(readFileSync(join(HERE, "pwa.brand.json"), "utf8"));
      const template = readFileSync(join(HERE, "sw-template.js"), "utf8");

      const chunkUrls = collectPrecacheUrls(manifest);
      const urls = buildPrecacheList(chunkUrls, brand.icons);
      const version = hashVersion(urls);
      const sw = injectSw(template, { version, urls });

      writeFileSync(join(distDir, "sw.js"), sw, "utf8");
      console.log(
        `  SW 生成: sw.js 版本 yyc3-static-${version}，预缓存 ${urls.length} 项（含 ${chunkUrls.length} chunks）`
      );
    },
  };
}

export default pwaSwPlugin;
