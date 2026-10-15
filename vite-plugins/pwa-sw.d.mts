/**
 * @file: pwa-sw.d.mts
 * @description: pwa-sw.mjs 类型声明。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import type { Plugin } from "vite";

export interface ViteManifestEntry {
  file: string;
  css?: string[];
  isEntry?: boolean;
}

export function collectPrecacheUrls(manifest: Record<string, ViteManifestEntry>): string[];
export function buildPrecacheList(
  chunkUrls: string[],
  iconMap: Record<string, string>
): string[];
export function hashVersion(urls: string[]): string;
export function injectSw(
  template: string,
  payload: { version: string; urls: string[] }
): string;
export function pwaSwPlugin(): Plugin;
export default pwaSwPlugin;
