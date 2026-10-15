/**
 * @file: brand.test.ts
 * @description: 品牌单源一致性：brand.ts ↔ site.json（figma 插件注入源）
 *               ↔ vite-plugins/pwa.brand.json（manifest 生成源）三处必须同值；
 *               所有声明的图标物理文件必须存在。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import siteJson from "../../../.figma/make/site.json";
import pwaBrand from "../../../vite-plugins/pwa.brand.json";
import {
  APP_BACKGROUND_COLOR,
  APP_BRAND_LINE,
  APP_DESCRIPTION,
  APP_ICONS,
  APP_LANG,
  APP_NAME,
  APP_SHORT_NAME,
  APP_THEME_COLOR,
} from "../brand";

describe("品牌三处单源一致", () => {
  it("site.json（→ document.title/og/favicon/lang）与 brand.ts 同值", () => {
    expect(siteJson.title).toBe(APP_NAME);
    expect(siteJson.language).toBe(APP_LANG);
    expect(siteJson.description).toBe(APP_DESCRIPTION);
    expect(siteJson.icons?.icon).toBe(APP_ICONS.favicon32);
  });

  it("pwa.brand.json（→ manifest.webmanifest）与 brand.ts 同值", () => {
    expect(pwaBrand.name).toBe(APP_NAME);
    expect(pwaBrand.shortName).toBe(APP_SHORT_NAME);
    expect(pwaBrand.description).toBe(APP_DESCRIPTION);
    expect(pwaBrand.lang).toBe(APP_LANG);
    expect(pwaBrand.themeColor).toBe(APP_THEME_COLOR);
    expect(pwaBrand.backgroundColor).toBe(APP_BACKGROUND_COLOR);
    expect(pwaBrand.icons.pwa192).toBe(APP_ICONS.pwa192);
    expect(pwaBrand.icons.pwa512).toBe(APP_ICONS.pwa512);
    expect(pwaBrand.icons.maskable512).toBe(APP_ICONS.maskable512);
  });

  it("名称规范：全名含短名与品牌行，短名适合桌面图标（≤12 字符）", () => {
    expect(APP_NAME).toContain(APP_SHORT_NAME);
    expect(APP_NAME).toContain(APP_BRAND_LINE);
    expect(APP_SHORT_NAME.length).toBeLessThanOrEqual(12);
  });
});

describe("多端图标物理资产", () => {
  const publicRoot = join(process.cwd(), "public");

  it.each(Object.entries(APP_ICONS))("%s 物理文件存在且文件名无空格", (_key, urlPath) => {
    expect(urlPath).not.toContain(" ");
    expect(urlPath.startsWith("/icons/")).toBe(true);
    expect(existsSync(join(publicRoot, urlPath))).toBe(true);
  });
});
