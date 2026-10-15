/**
 * @file: useRealTimeClock.test.ts
 * @description: YYC³ 真实时钟 Hook 单测 — 三针角度公式、日期/周末判定、1s 走时与卸载清理。
 *               公式与 docs/AIFamilyPage.tsx 参考实现逐式对齐，防止大屏/认证页双源漂移。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLOCK_HUB_RATIO, formatDateInfo, getClockAngles, getHandLengths, useRealTimeClock } from '../useRealTimeClock';

describe('getClockAngles 三针角度公式', () => {
  it('00:00:00 三针指向 12 点方向（-90° 校正后）', () => {
    const a = getClockAngles(new Date(2026, 9, 15, 0, 0, 0));
    expect(a.hourAngle).toBe(-90);
    expect(a.minuteAngle).toBe(-90);
    expect(a.secondAngle).toBe(-90);
  });

  it('12:30:30 含分/秒补偿：时 -75°、分 93°、秒 90°', () => {
    const a = getClockAngles(new Date(2026, 9, 15, 12, 30, 30));
    expect(a.hourAngle).toBeCloseTo(-75, 5);  // 0*30 + 30*0.5 - 90（自 12 点偏转半格）
    expect(a.minuteAngle).toBeCloseTo(93, 5); // 30*6 + 30*0.1 - 90
    expect(a.secondAngle).toBe(90);           // 30*6 - 90 → 指向 6 点
  });

  it('21:00:00 12 小时制归一：时针指向 9 点（180°）', () => {
    const a = getClockAngles(new Date(2026, 9, 15, 21, 0, 0));
    expect(a.hourAngle).toBe(180);
  });
});

describe('formatDateInfo 日期与周末粉色判定', () => {
  it('2026-10-15 周四：yy/mm/dd 格式 + 非周末', () => {
    const d = formatDateInfo(new Date(2026, 9, 15, 9, 18, 11));
    expect(d.dateStr).toBe('26/10/15');
    expect(d.dayLabel).toBe('四');
    expect(d.isWeekend).toBe(false);
  });

  it('周六与周日标记 isWeekend（UI 着粉色）', () => {
    const sat = formatDateInfo(new Date(2026, 9, 17)); // 2026-10-17 周六
    const sun = formatDateInfo(new Date(2026, 9, 18)); // 2026-10-18 周日
    expect(sat.dayLabel).toBe('六');
    expect(sat.isWeekend).toBe(true);
    expect(sun.dayLabel).toBe('日');
    expect(sun.isWeekend).toBe(true);
  });

  it('单位数月/日补零', () => {
    expect(formatDateInfo(new Date(2026, 0, 5)).dateStr).toBe('26/01/05');
  });
});

describe('getHandLengths / CLOCK_HUB_RATIO 视觉规范', () => {
  it('三针严格递增（时<分<秒）且秒针不越节点轨道（≤0.68R，配重在 0.16R）', () => {
    const l = getHandLengths(220);
    expect(l.hour).toBeCloseTo(92.4, 5);
    expect(l.minute).toBeCloseTo(123.2, 5);
    expect(l.second).toBeCloseTo(149.6, 5);
    expect(l.tail).toBeCloseTo(35.2, 5);
    expect(l.hour).toBeLessThan(l.minute);
    expect(l.minute).toBeLessThan(l.second);
    expect(l.second).toBeLessThan(220);
  });

  it('枢纽比例 0.21（540 表盘 → 枢纽约 113，小于旧值 128）', () => {
    expect(Math.round(540 * CLOCK_HUB_RATIO)).toBe(113);
  });
});

describe('useRealTimeClock 走时', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('1 秒 setInterval 走时：推进 1s 后秒针前进 6°，卸载清除定时器', () => {
    const { result, unmount } = renderHook(() => useRealTimeClock());
    const before = result.current.angles.secondAngle;

    act(() => { vi.advanceTimersByTime(1000); });

    expect(result.current.angles.secondAngle).toBeCloseTo((before + 6) % 360, 5);
    expect(result.current.timeStr).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
