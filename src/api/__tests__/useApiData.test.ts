/**
 * YYC³ API 契约层 — useApiData Hook 测试
 *
 * 零 DOM 依赖策略：以 vi.mock('react') 提供与真实语义一致的
 * useState / useEffect 最小实现（状态单元跨渲染持久化、effect
 * 挂载后冲刷、cleanup 收集），在纯 Node 环境覆盖 Hook 的异步
 * 状态机与卸载防竞态逻辑，避免引入 jsdom 测试栈。
 * @file: useApiData.test.ts
 * @description: YYC³ API 契约层 — useApiData Hook 测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../client';
import type { ApiDataState, ApiEventLevel, ApiEventSink, SnapshotStore } from '../useApiData';
import { setApiEventSink, useApiData } from '../useApiData';

interface HarnessCell {
  value: unknown;
  set: (v: unknown) => void;
}
type EffectFn = () => void | (() => void);

/** React Hook 语义的最小模拟状态（vi.hoisted 供 mock 工厂安全引用） */
const h = vi.hoisted(() => ({
  cells: [] as { value: unknown; set: (v: unknown) => void }[],
  cellIndex: 0,
  queuedEffects: [] as (() => void | (() => void))[],
  activeCleanups: [] as (() => void)[],
}));

vi.mock('react', () => ({
  // 与真实语义一致：重渲染时按调用序复用既有状态单元（state 持久化）
  useState: (initial: unknown) => {
    const i = h.cellIndex++;
    const existing = h.cells[i];
    if (existing) return [existing.value, existing.set] as const;
    const cell: HarnessCell = {
      value: initial,
      set: (v: unknown) => {
        cell.value = v;
      },
    };
    h.cells[i] = cell;
    return [cell.value, cell.set] as const;
  },
  // 声明期仅排队 effect，由 flushEffects 模拟 React 提交阶段执行
  useEffect: (fn: EffectFn) => {
    h.queuedEffects.push(fn);
  },
}));

/** 渲染一轮 Hook（模拟 re-render：hook 体重新求值，state 单元保留） */
function render(
  loader: () => Promise<unknown>,
  options?: { snapshotKey?: string; snapshotStore?: SnapshotStore },
): ApiDataState<unknown> {
  h.cellIndex = 0;
  h.queuedEffects = [];
  return useApiData(loader, options);
}

/** 提交阶段冲刷：先执行上一轮 cleanup（依赖变化/卸载），再运行本轮 effect */
function flushEffects() {
  for (const cleanup of h.activeCleanups) cleanup();
  h.activeCleanups = [];
  for (const fn of h.queuedEffects) {
    const cleanup = fn();
    if (typeof cleanup === 'function') h.activeCleanups.push(cleanup);
  }
  h.queuedEffects = [];
}

/** 模拟组件卸载：仅执行清理，不再运行 effect */
function unmount() {
  for (const cleanup of h.activeCleanups) cleanup();
  h.activeCleanups = [];
}

/** 读取第一个状态单元的当前值（setState 后通过重读获取新对象） */
function state(): ApiDataState<unknown> {
  const cell = h.cells[0];
  if (!cell) throw new Error('Hook 尚未渲染');
  return cell.value as ApiDataState<unknown>;
}

/** 微任务冲刷：确保 Hook 挂在 promise 上的 then 回调已执行 */
async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

function createDeferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** 遥测收集器 — 注入 ApiEventSink 端口，断言与全局环形缓冲解耦 */
const sinkEvents: Array<{ level: ApiEventLevel; source: string; message: string; detail?: string }> = [];
const findEvent = (level: ApiEventLevel) => sinkEvents.find((e) => e.level === level);

beforeEach(() => {
  h.cells = [];
  h.cellIndex = 0;
  h.queuedEffects = [];
  h.activeCleanups = [];
  sinkEvents.length = 0;
  setApiEventSink((level, source, message, detail) => sinkEvents.push({ level, source, message, detail }));
});

/** 内存快照存储（测试专用 SnapshotPort 适配器） */
function createMemoryStore(initial: Record<string, string> = {}): SnapshotStore & { data: Record<string, string> } {
  const data: Record<string, string> = { ...initial };
  return {
    data,
    get: (k) => (k in data ? data[k] : null),
    set: (k, v) => {
      data[k] = v;
    },
  };
}

describe('useApiData — Mock 优先数据装载 Hook', () => {
  it('装载成功：loading → data 落位且 error 清空', async () => {
    const deferred = createDeferred<string[]>();
    const initial = render(() => deferred.promise);

    expect(initial).toEqual({ data: null, loading: true, error: null, degraded: false });

    flushEffects();
    deferred.resolve(['脚本A', '脚本B']);
    await deferred.promise;
    await flushMicrotasks();

    expect(state()).toEqual({ data: ['脚本A', '脚本B'], loading: false, error: null, degraded: false });
  });

  it('装载失败：error 落位并退出 loading', async () => {
    const deferred = createDeferred<never>();
    render(() => deferred.promise);
    flushEffects();

    deferred.reject(new ApiError('/scripts', 'NETWORK', '网络异常'));
    await deferred.promise.catch(() => { });
    await flushMicrotasks();

    expect(state().data).toBeNull();
    expect(state().loading).toBe(false);
    expect(state().error).toBeInstanceOf(ApiError);
    expect(state().error?.code).toBe('NETWORK');
  });

  it('卸载防竞态：resolve 落在卸载之后被丢弃', async () => {
    const deferred = createDeferred<string>();
    render(() => deferred.promise);
    flushEffects();
    unmount();

    deferred.resolve('迟到的数据');
    await deferred.promise;
    await flushMicrotasks();

    expect(state()).toEqual({ data: null, loading: true, error: null, degraded: false });
  });

  it('卸载防竞态：reject 落在卸载之后同样被丢弃', async () => {
    const deferred = createDeferred<never>();
    render(() => deferred.promise);
    flushEffects();
    unmount();

    deferred.reject(new ApiError('/tasks', 'TIMEOUT', '请求超时'));
    await deferred.promise.catch(() => { });
    await flushMicrotasks();

    expect(state().loading).toBe(true);
    expect(state().error).toBeNull();
  });

  it('loader 标识变化：清理旧任务并重跑新任务，旧结果不串扰', async () => {
    const first = createDeferred<string>();
    const second = createDeferred<string>();

    render(() => first.promise);
    flushEffects();

    // loader 引用变化触发 effect 重跑：cleanup 旧任务 → 执行新任务
    render(() => second.promise);
    flushEffects();

    first.resolve('过期结果');
    await first.promise;
    await flushMicrotasks();
    expect(state().data).toBeNull();

    second.resolve('新结果');
    await second.promise;
    await flushMicrotasks();
    expect(state()).toEqual({ data: '新结果', loading: false, error: null, degraded: false });
  });
});

describe('useApiData — 快照降级（断网可读）', () => {
  it('成功即写快照：store 落位且响应不降级', async () => {
    const store = createMemoryStore();
    const deferred = createDeferred<{ id: string }[]>();

    render(() => deferred.promise, { snapshotKey: '/api/v2/factory/tasks', snapshotStore: store });
    flushEffects();
    deferred.resolve([{ id: 't-1' }]);
    await deferred.promise;
    await flushMicrotasks();

    expect(state()).toEqual({ data: [{ id: 't-1' }], loading: false, error: null, degraded: false });
    const key = 'yyc3:snapshot:/api/v2/factory/tasks';
    expect(JSON.parse(store.data[key])).toEqual([{ id: 't-1' }]);
  });

  it('网络失败 → 命中快照降级：degraded=true、error 清空、遥测记 warn', async () => {
    const store = createMemoryStore({ 'yyc3:snapshot:/api/v2/factory/tasks': JSON.stringify([{ id: 'snap-1' }]) });
    const deferred = createDeferred<never>();

    render(() => deferred.promise, { snapshotKey: '/api/v2/factory/tasks', snapshotStore: store });
    flushEffects();
    deferred.reject(new ApiError('/api/v2/factory/tasks', 'NETWORK', '网络异常'));
    await deferred.promise.catch(() => { });
    await flushMicrotasks();

    expect(state()).toEqual({ data: [{ id: 'snap-1' }], loading: false, error: null, degraded: true });
    const warn = findEvent('warn');
    expect(warn?.source).toBe('useApiData');
    expect(warn?.detail).toContain('NETWORK');
  });

  it('网络失败且无快照：正常落 error 并记遥测', async () => {
    const store = createMemoryStore();
    const deferred = createDeferred<never>();

    render(() => deferred.promise, { snapshotKey: '/api/v2/factory/tasks', snapshotStore: store });
    flushEffects();
    deferred.reject(new ApiError('/api/v2/factory/tasks', 'TIMEOUT', '请求超时'));
    await deferred.promise.catch(() => { });
    await flushMicrotasks();

    expect(state().degraded).toBe(false);
    expect(state().error?.code).toBe('TIMEOUT');
    expect(sinkEvents.some((e) => e.level === 'error')).toBe(true);
  });

  it('快照损坏（非法 JSON）：回落 error 态不崩溃', async () => {
    const store = createMemoryStore({ 'yyc3:snapshot:/api/v2/factory/tasks': '{broken-json' });
    const deferred = createDeferred<never>();

    render(() => deferred.promise, { snapshotKey: '/api/v2/factory/tasks', snapshotStore: store });
    flushEffects();
    deferred.reject(new ApiError('/api/v2/factory/tasks', 'NETWORK', '网络异常'));
    await deferred.promise.catch(() => { });
    await flushMicrotasks();

    expect(state().data).toBeNull();
    expect(state().error).toBeInstanceOf(ApiError);
    expect(state().degraded).toBe(false);
  });

  it('快照写入失败（配额）：成功主流程不受影响，仅记 warn', async () => {
    const failingStore: SnapshotStore = {
      get: () => null,
      set: () => {
        throw new Error('QuotaExceededError');
      },
    };
    const deferred = createDeferred<string>();

    render(() => deferred.promise, { snapshotKey: '/api/v2/factory/tasks', snapshotStore: failingStore });
    flushEffects();
    deferred.resolve('ok');
    await deferred.promise;
    await flushMicrotasks();

    expect(state()).toEqual({ data: 'ok', loading: false, error: null, degraded: false });
    expect(sinkEvents.some((e) => e.level === 'warn' && e.message.includes('快照写入失败'))).toBe(true);
  });
});
