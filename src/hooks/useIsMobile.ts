/**
 * @file: useIsMobile.ts
 * @description: 移动端断点 Hook（<1024px，lg 断点以下）。matchMedia 实时订阅；
 *               供布局壳（抽屉/底栏）与页面响应式分支（如时钟直径）使用。
 *               SSR/不支持环境安全降级为 false（桌面态）。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { useEffect, useState } from "react";

/** lg 断点（1024px）以下视为移动端，与 Tailwind lg: 前缀一致 */
export const MOBILE_QUERY = "(max-width: 1023px)";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
