/**
 * @file: telemetry.test.ts
 * @description: 本地遥测环形缓冲测试 — 容量淘汰/快照隔离/事件完整性
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearTelemetry,
  getRecentEvents,
  recordEvent,
  TELEMETRY_CAPACITY,
} from '../telemetry';

beforeEach(() => clearTelemetry());

describe('telemetry 环形缓冲', () => {
  it('记录事件：字段完整、detail 可选省略', () => {
    recordEvent('error', 'useApiData', '网络异常', 'NETWORK /api/v2/factory/scripts');
    recordEvent('warn', 'App', 'meta 加载失败');

    const events = getRecentEvents();
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      level: 'error',
      source: 'useApiData',
      message: '网络异常',
      detail: 'NETWORK /api/v2/factory/scripts',
    });
    expect(events[0].ts).toBeGreaterThan(0);
    expect('detail' in events[1]).toBe(false);
  });

  it('环形淘汰：超过容量丢弃最旧条目', () => {
    for (let i = 0; i < TELEMETRY_CAPACITY + 10; i++) {
      recordEvent('info', 'test', `event-${i}`);
    }
    const events = getRecentEvents();
    expect(events).toHaveLength(TELEMETRY_CAPACITY);
    expect(events[0].message).toBe('event-10');
    expect(events[events.length - 1].message).toBe(`event-${TELEMETRY_CAPACITY + 9}`);
  });

  it('快照隔离：外部修改返回数组不影响缓冲', () => {
    recordEvent('info', 'test', 'a');
    const snapshot = getRecentEvents();
    snapshot.push({ ts: 0, level: 'error', source: 'x', message: 'ghost' });
    expect(getRecentEvents()).toHaveLength(1);
  });

  it('clearTelemetry 清空缓冲', () => {
    recordEvent('info', 'test', 'a');
    clearTelemetry();
    expect(getRecentEvents()).toHaveLength(0);
  });
});
