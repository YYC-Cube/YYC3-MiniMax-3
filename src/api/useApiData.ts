/**
 * YYC³ API 契约层 — 域服务数据装载 Hook
 *
 * 统一「Mock 优先 + 快照降级」异步取数模式。页面用法：
 *
 *   const { data, loading, error } = useApiData(scriptService.list);
 *   // 断网可降级读快照（可选）：
 *   const { data, degraded } = useApiData(taskService.list, SNAPSHOT.taskList);
 *
 * 约定：
 * - loader 传模块级服务方法引用（稳定标识），卸载后自动丢弃结果防竞态。
 * - 未配置 VITE_API_BASE_URL 时服务层即时回退 mock 兜底；后端就绪后页面零改动。
 * - 提供 snapshotKey 时：成功即写快照；网络失败自动降级读最近成功快照（degraded=true），
 *   无快照才落 error。适配本地优先「断网可降级」目标。
 * @file: useApiData.ts
 * @description: YYC³ API 契约层 — 域服务数据装载 Hook
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v2.1.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { useEffect, useState } from 'react';
import type { ApiError } from './client';

export interface ApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  /** true 表示当前数据来自离线快照（网络失败降级），非实时结果 */
  degraded: boolean;
}

/** 快照存储端口 — 默认 localStorage 适配器，测试可注入内存实现 */
export interface SnapshotStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const browserSnapshotStore: SnapshotStore = {
  get: (key) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(key)),
  set: (key, value) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
};

const SNAPSHOT_KEY_PREFIX = 'yyc3:snapshot:';

/** 遥测事件端口 — api 层不直接依赖 observability，由组合根（main.tsx）注册桥接 */
export type ApiEventLevel = 'error' | 'warn' | 'info';
export type ApiEventSink = (level: ApiEventLevel, source: string, message: string, detail?: string) => void;

let apiEventSink: ApiEventSink = () => {}; // 默认 no-op：未注册时零副作用
export function setApiEventSink(sink: ApiEventSink) {
  apiEventSink = sink;
}

export interface UseApiDataOptions {
  /** 快照键（推荐传 ENDPOINTS 常量，天然版本化）；缺省则不启用快照降级 */
  snapshotKey?: string;
  /** 快照存储适配器（默认 localStorage；SSR/测试可注入） */
  snapshotStore?: SnapshotStore;
}

export function useApiData<T>(loader: () => Promise<T>, options: UseApiDataOptions = {}): ApiDataState<T> {
  const [state, setState] = useState<ApiDataState<T>>({ data: null, loading: true, error: null, degraded: false });

  useEffect(() => {
    let active = true;
    const store = options.snapshotStore ?? browserSnapshotStore;
    loader().then(
      (data) => {
        if (!active) return;
        setState({ data, loading: false, error: null, degraded: false });
        if (options.snapshotKey) {
          try {
            store.set(SNAPSHOT_KEY_PREFIX + options.snapshotKey, JSON.stringify(data));
          } catch {
            apiEventSink('warn', 'useApiData', '快照写入失败（存储配额或隐私模式）', options.snapshotKey);
          }
        }
      },
      (error: ApiError) => {
        if (!active) return;
        if (options.snapshotKey) {
          const raw = store.get(SNAPSHOT_KEY_PREFIX + options.snapshotKey);
          if (raw !== null) {
            try {
              const snapshot = JSON.parse(raw) as T;
              setState({ data: snapshot, loading: false, error: null, degraded: true });
              apiEventSink('warn', 'useApiData', '网络失败，已降级读离线快照', `${error.code} ${options.snapshotKey}`);
              return;
            } catch {
              apiEventSink('warn', 'useApiData', '快照解析失败，回落 error 态', options.snapshotKey);
            }
          }
        }
        setState({ data: null, loading: false, error, degraded: false });
        apiEventSink('error', 'useApiData', error.message, `${error.code} ${error.endpoint}`);
      },
    );
    return () => {
      active = false;
    };
    // 依赖显式列出快照端口字段（调用点均为字面量常量，语义稳定，无重复请求风险）
  }, [loader, options.snapshotKey, options.snapshotStore]);

  return state;
}
