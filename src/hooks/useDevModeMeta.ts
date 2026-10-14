/**
 * YYC³ App Shell — DevMode 元数据装载 Hook（R7 专项 R7-B）
 *
 * 页面 chunk 元数据按需加载生命周期：fallback 复位 → registry 按页加载 → active 守卫 →
 * 失败记本地遥测（不再静默）。fallback 常量归位 navigation/registry（meta 知识单源）。
 * @file: useDevModeMeta.ts
 * @description: YYC³ App Shell — DevMode 元数据装载 Hook
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { useEffect, useState } from 'react';
import { DEV_META_FALLBACK, getPageEntry } from '../navigation/registry';
import { recordEvent } from '../observability/telemetry';
import type { DevModeMeta, PageId } from '../types';

export function useDevModeMeta(currentPage: PageId): DevModeMeta {
  const [meta, setMeta] = useState<DevModeMeta>(DEV_META_FALLBACK);

  useEffect(() => {
    let active = true;
    setMeta(DEV_META_FALLBACK);
    getPageEntry(currentPage)
      .meta()
      .then((loaded) => {
        if (active) setMeta(loaded);
      })
      .catch((err: unknown) => {
        recordEvent('error', 'useDevModeMeta', 'DevMode 元数据加载失败', `${currentPage}: ${String(err)}`);
      });
    return () => {
      active = false;
    };
  }, [currentPage]);

  return meta;
}
