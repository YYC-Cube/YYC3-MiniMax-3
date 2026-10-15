/**
 * @file: pwa-manifest.d.mts
 * @description: pwa-manifest.mjs 的类型声明（供 vite.config.ts 类型检查）。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import type { Plugin } from "vite";

export interface PwaBrandConfig {
  name: string;
  shortName: string;
  description: string;
  lang: string;
  themeColor: string;
  backgroundColor: string;
  icons: {
    pwa192: string;
    pwa512: string;
    maskable512: string;
  };
}

export function loadBrandConfig(): PwaBrandConfig;
export function buildManifest(brand: PwaBrandConfig): Record<string, unknown>;
export function pwaManifestPlugin(): Plugin;
export default pwaManifestPlugin;
