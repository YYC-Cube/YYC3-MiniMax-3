/**
 * YYC³ App Shell — useDevModeMeta 装载生命周期测试（R7 专项 R7-B）
 *
 * 零 DOM 依赖策略：vi.mock('react') 最小 Hook 模拟栈 + vi.mock registry/telemetry 桩，
 * 覆盖 fallback 初始态、加载成功落位、失败记遥测三条路径。
 * @file: useDevModeMeta.test.ts
 * @description: YYC³ App Shell — useDevModeMeta 装载生命周期测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDevModeMeta } from '../useDevModeMeta';

const h = vi.hoisted(() => ({
  cells: [] as { value: unknown; set: (v: unknown) => void }[],
  cellIndex: 0,
  queuedEffects: [] as (() => void | (() => void))[],
  activeCleanups: [] as (() => void)[],
}));

vi.mock('react', () => ({
  useState: (initial: unknown) => {
    const i = h.cellIndex++;
    const existing = h.cells[i];
    if (existing) return [existing.value, existing.set] as const;
    const cell = {
      value: initial,
      set: (v: unknown) => {
        cell.value = v;
      },
    };
    h.cells[i] = cell;
    return [cell.value, cell.set] as const;
  },
  useEffect: (fn: () => void | (() => void)) => {
    h.queuedEffects.push(fn);
  },
}));

/** registry 桩：meta 装载行为由用例注入（键名与真实导出 DEV_META_FALLBACK 严格一致） */
const registryStub = vi.hoisted(() => ({
  DEV_META_FALLBACK: {
    apiEndpoint: 'stub-fallback-ep',
    stateSwitchConditions: { empty: 'e', loading: 'l', error: 'e', forbidden: 'f' },
  },
  getPageEntry: vi.fn(),
}));

vi.mock('../../navigation/registry', () => registryStub);

vi.mock('../../observability/telemetry', () => ({
  recordEvent: vi.fn(),
}));

import { recordEvent } from '../../observability/telemetry';
import type { DevModeMeta } from '../../types';

function renderHook(page: Parameters<typeof useDevModeMeta>[0]): DevModeMeta {
  h.cellIndex = 0;
  h.queuedEffects = [];
  return useDevModeMeta(page);
}

function flushEffects() {
  for (const cleanup of h.activeCleanups) cleanup();
  h.activeCleanups = [];
  for (const fn of h.queuedEffects) {
    const cleanup = fn();
    if (typeof cleanup === 'function') h.activeCleanups.push(cleanup);
  }
  h.queuedEffects = [];
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

/** 读取状态单元当前值 */
function state(): DevModeMeta {
  const cell = h.cells[0];
  if (!cell) throw new Error('Hook 尚未渲染');
  return cell.value as DevModeMeta;
}

const loadedMeta: DevModeMeta = {
  apiEndpoint: '/api/v2/factory/scripts',
  confidenceSource: 'test',
  memoryScope: 'session',
  driveModePolicy: 'test',
  stateSwitchConditions: { empty: 'e', loading: 'l', error: 'e', forbidden: 'f' },
};

beforeEach(() => {
  h.cells = [];
  h.cellIndex = 0;
  h.queuedEffects = [];
  h.activeCleanups = [];
  vi.mocked(recordEvent).mockClear();
  registryStub.getPageEntry.mockReset();
});

describe('useDevModeMeta — 元数据装载生命周期', () => {
  it('初始态：返回 fallback（页面 chunk 加载完成前）', () => {
    const meta = renderHook('dashboard');
    expect(meta).toEqual(registryStub.DEV_META_FALLBACK);
  });

  it('加载成功：meta 落位替换 fallback', async () => {
    registryStub.getPageEntry.mockReturnValue({ meta: () => Promise.resolve(loadedMeta) });
    renderHook('dashboard');
    flushEffects();
    await flushMicrotasks();
    expect(state()).toEqual(loadedMeta);
  });

  it('加载失败：保持 fallback 并记录 error 遥测（不静默）', async () => {
    registryStub.getPageEntry.mockReturnValue({ meta: () => Promise.reject(new Error('chunk boom')) });
    renderHook('script');
    flushEffects();
    await flushMicrotasks();
    expect(state()).toEqual(registryStub.DEV_META_FALLBACK);
    expect(recordEvent).toHaveBeenCalledWith(
      'error',
      'useDevModeMeta',
      'DevMode 元数据加载失败',
      expect.stringContaining('script'),
    );
  });
});
