// @vitest-environment jsdom
/**
 * @file: MobileBottomNav.test.tsx
 * @description: MobileBottomNav jsdom 契约 — 四分组 Tab 直达组首页/当前组 aria-current/
 *               中央 AI FAB 打开 W1/family 中枢页归生产组高亮
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PageId } from "../../../types";
import MobileBottomNav from "../MobileBottomNav";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function renderNav(overrides: { currentPage?: PageId } = {}) {
  const props = {
    currentPage: "dashboard" as PageId,
    onNavigate: vi.fn(),
    onOpenFamilyWidget: vi.fn(),
    ...overrides,
  };
  const utils = render(createElement(MobileBottomNav, props));
  return { props, ...utils };
}

afterEach(() => cleanup());

describe("components/layout/MobileBottomNav 移动端底栏契约", () => {
  it("渲染四个业务分组 Tab（生产/剪辑/管理/推送）与中央 AI FAB", () => {
    const { getByLabelText, getByText } = renderNav();
    expect(getByText("生产全链")).toBeTruthy();
    expect(getByText("剪辑合并")).toBeTruthy();
    expect(getByText("平台管理")).toBeTruthy();
    expect(getByText("一键推送")).toBeTruthy();
    expect(getByLabelText("打开 AI Family 协同浮窗")).toBeTruthy();
  });

  it("点击分组 Tab 直达该组注册首页（dashboard/video/project/publish）", () => {
    const { props, getByText } = renderNav();
    fireEvent.click(getByText("剪辑合并"));
    expect(props.onNavigate).toHaveBeenCalledWith("video");
    fireEvent.click(getByText("平台管理"));
    expect(props.onNavigate).toHaveBeenCalledWith("project");
    fireEvent.click(getByText("一键推送"));
    expect(props.onNavigate).toHaveBeenCalledWith("publish");
    fireEvent.click(getByText("生产全链"));
    expect(props.onNavigate).toHaveBeenCalledWith("dashboard");
  });

  it("中央 FAB 点击触发 onOpenFamilyWidget 而非导航", () => {
    const { props, getByLabelText } = renderNav();
    fireEvent.click(getByLabelText("打开 AI Family 协同浮窗"));
    expect(props.onOpenFamilyWidget).toHaveBeenCalledTimes(1);
    expect(props.onNavigate).not.toHaveBeenCalled();
  });

  it("当前页所属分组标记 aria-current=page；中枢页 family 归生产组高亮", () => {
    const { getByLabelText } = renderNav({ currentPage: "family" });
    const prodTab = getByLabelText("生产全链路");
    expect(prodTab.getAttribute("aria-current")).toBe("page");
  });

  it("剪辑域页面仅剪辑组高亮，其余组无 aria-current", () => {
    const { getByLabelText } = renderNav({ currentPage: "music" });
    expect(getByLabelText("剪辑合并").getAttribute("aria-current")).toBe("page");
    expect(getByLabelText("生产全链路").getAttribute("aria-current")).toBeNull();
    expect(getByLabelText("一键推送").getAttribute("aria-current")).toBeNull();
  });
});
