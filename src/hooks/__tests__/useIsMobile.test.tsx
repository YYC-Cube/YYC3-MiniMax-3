// @vitest-environment jsdom
/**
 * @file: useIsMobile.test.tsx
 * @description: useIsMobile 断点 Hook 契约 — matchMedia 初始值/change 订阅/卸载清理
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MOBILE_QUERY, useIsMobile } from "../useIsMobile";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/** 最小 matchMedia mock：记录订阅者并可在测试中触发 change */
function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: initialMatches,
    media: MOBILE_QUERY,
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.delete(fn),
    dispatch(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((fn) => fn({ matches } as MediaQueryListEvent));
    },
  };
  window.matchMedia = vi.fn((query: string) => {
    mql.media = query;
    return mql as unknown as MediaQueryList;
  });
  return mql;
}

describe("hooks/useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("初始为桌面宽度时返回 false", () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("初始为移动宽度时返回 true", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("订阅 lg 断点 query 且响应 change 事件实时翻转", () => {
    const mql = installMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith(MOBILE_QUERY);

    act(() => mql.dispatch(true));
    expect(result.current).toBe(true);

    act(() => mql.dispatch(false));
    expect(result.current).toBe(false);
  });

  it("卸载后移除 change 监听（无泄漏）", () => {
    const mql = installMatchMedia(false);
    const removeSpy = vi.spyOn(mql, "removeEventListener");
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
