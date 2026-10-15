/**
 * @file: pwa-manifest.mjs
 * @description: 零依赖 Vite 插件 — 构建期生成 manifest.webmanifest。
 *               数据源 vite-plugins/pwa.brand.json（与 src/config/brand.ts 由
 *               一致性测试强制同值），消除「JSON 与代码常量双源」。
 *               同时导出 buildManifest() 供单测做纯函数断言。
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

const HERE = dirname(fileURLToPath(import.meta.url));

/** 读取受控品牌数据（pwa.brand.json） */
export function loadBrandConfig() {
  return JSON.parse(readFileSync(join(HERE, "pwa.brand.json"), "utf-8"));
}

/**
 * 纯函数：品牌配置 → Web App Manifest 对象。
 * 可安装必备字段齐全；icons 提供 any + maskable 两类。
 */
export function buildManifest(brand) {
  return {
    id: "/",
    name: brand.name,
    short_name: brand.shortName,
    description: brand.description,
    lang: brand.lang,
    dir: "ltr",
    scope: "/",
    start_url: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    theme_color: brand.themeColor,
    background_color: brand.backgroundColor,
    categories: ["productivity", "entertainment"],
    icons: [
      { src: brand.icons.pwa192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: brand.icons.pwa512, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: brand.icons.maskable512, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "工作台", short_name: "工作台", url: "/?p=dashboard" },
      { name: "任务队列", short_name: "任务", url: "/?p=tasks" },
      { name: "AI Family 时钟环", short_name: "时钟环", url: "/?p=family" },
      { name: "A01 登录", short_name: "登录", url: "/?p=auth-login" },
    ],
  };
}

/** Vite 插件：emit manifest.webmanifest 到产物根 */
export function pwaManifestPlugin() {
  return {
    name: "yyc3-pwa-manifest",
    apply: "build",
    generateBundle() {
      const manifest = buildManifest(loadBrandConfig());
      this.emitFile({
        type: "asset",
        fileName: "manifest.webmanifest",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

export default pwaManifestPlugin;
