/**
 * @file: pwa-manifest.test.mjs
 * @description: manifest.webmanifest 构建插件纯函数测试 — 可安装必备字段、
 *               图标 any/maskable 双用途、shortcuts 深链、品牌数据真实加载。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from "vitest";
import { buildManifest, loadBrandConfig } from "./pwa-manifest.mjs";

const brand = loadBrandConfig();
const manifest = buildManifest(brand);

describe("buildManifest Web App Manifest", () => {
  it("可安装必备字段齐全", () => {
    expect(manifest.name).toBe("YYC³ AI Family · Comic Drama");
    expect(manifest.short_name).toBe("YYC³");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0a1628");
    expect(manifest.background_color).toBe("#0a1628");
    expect(manifest.lang).toBe("zh-CN");
    expect(manifest.description.length).toBeGreaterThan(0);
  });

  it("图标含 192/512 any 与 512 maskable 三类", () => {
    const purposes = manifest.icons.map((i) => i.purpose).sort();
    expect(purposes).toEqual(["any", "any", "maskable"]);
    for (const icon of manifest.icons) {
      expect(icon.src).toMatch(/^\/icons\/.+\.png$/);
      expect(icon.type).toBe("image/png");
      expect(icon.sizes).toMatch(/^\d+x\d+$/);
    }
  });

  it("shortcuts 深链指向已注册的内部 pageId", () => {
    const pages = manifest.shortcuts.map((s) => s.url);
    expect(pages).toContain("/?p=dashboard");
    expect(pages).toContain("/?p=tasks");
    expect(pages).toContain("/?p=family");
    expect(pages).toContain("/?p=auth-login");
  });

  it("display_override 与 orientation 提供更接近原生体验", () => {
    expect(manifest.display_override).toContain("standalone");
    expect(manifest.orientation).toBe("any");
  });
});
