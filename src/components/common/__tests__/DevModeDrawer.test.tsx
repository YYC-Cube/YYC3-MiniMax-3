// @vitest-environment jsdom
/**
 * @file: DevModeDrawer.test.tsx
 * @description: DevModeDrawer 渲染与交互契约 — SSR 门卫/调试面板/遥测环形缓冲 + jsdom 交互升级（clipboard 复制反馈与 2s 回落 fake timers；含 useState 禁直调）
 * @author: AI Tutor <minimax>
 * @version: v1.1.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { act, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearTelemetry, recordEvent, TELEMETRY_CAPACITY } from '../../../observability/telemetry';
import type { DevModeMeta, ViewState } from '../../../types';
import { DevModeDrawer } from '../DevModeDrawer';

// React 19 act 环境标志：RTL render/fireEvent/act 依赖此全局开关
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const meta: DevModeMeta = {
  apiEndpoint: 'GET /api/v1/dashboard/overview',
  confidenceSource: '本地置信度引擎 v2',
  memoryScope: 'project',
  driveModePolicy: 'L1 半自动策略：置信度不足时阻塞关键节点',
  stateSwitchConditions: {
    empty: '无任何产线数据',
    loading: '快照加载中',
    error: '端点超时',
    forbidden: '角色越权',
  },
};

function drawerProps(overrides: Record<string, unknown> = {}) {
  return {
    isOpen: true,
    onClose: () => { },
    pageTitle: '工作台首页',
    meta,
    currentState: 'error' as ViewState,
    onStateChange: () => { },
    driveMode: 'L1' as const,
    onDriveModeChange: () => { },
    ...overrides,
  };
}

/** SSR 渲染 helper：命名避开 RTL render，防遮蔽 */
function renderHtml(props: ReturnType<typeof drawerProps>): string {
  return renderToStaticMarkup(createElement(DevModeDrawer, props));
}

describe('DevModeDrawer SSR 渲染契约（含 useState，一律经渲染器）', () => {
  beforeEach(() => clearTelemetry());

  it('isOpen=false 门卫契约：不产生任何标记', () => {
    expect(renderHtml(drawerProps({ isOpen: false }))).toBe('');
  });

  it('isOpen=true 全量契约：标题/页名/meta 五区块/五态切换高亮当前态', () => {
    const html = renderHtml(drawerProps());
    expect(html).toContain('Dev Mode 架构标注与调试');
    expect(html).toContain('工作台首页');
    expect(html).toContain(meta.apiEndpoint);
    expect(html).toContain(meta.confidenceSource);
    expect(html).toContain('project');
    expect(html).toContain(meta.driveModePolicy);

    expect(html).toContain('正常态');
    expect(html).toContain('空态');
    expect(html).toContain('加载态');
    expect(html).toContain('错误态');
    expect(html).toContain('无权限态');
    expect(html).toContain('页面四态实时切换仿真');

    // 当前态 error 高亮：active 键边框色为 #ff442270（style 序列化精确匹配）
    expect(html).toContain('border:1px solid #ff442270');

    // 四态触发条件规格
    expect(html).toContain(meta.stateSwitchConditions.empty);
    expect(html).toContain(meta.stateSwitchConditions.loading);
    expect(html).toContain(meta.stateSwitchConditions.error);
    expect(html).toContain(meta.stateSwitchConditions.forbidden);
  });

  it('遥测环形缓冲两态：空缓冲提示；recordEvent 后展示 [ERROR] 行与容量计数', () => {
    const empty = renderHtml(drawerProps());
    expect(empty).toContain('暂无事件');

    recordEvent('error', 'api', '端点超时降级', 'detail-x');
    const html = renderHtml(drawerProps());
    expect(html).not.toContain('暂无事件');
    expect(html).toContain('[ERROR]');
    expect(html).toContain('api');
    expect(html).toContain('端点超时降级');
    expect(html).toContain('detail-x');
    expect(html).toContain(`1/${TELEMETRY_CAPACITY}`);
  });
});

describe('DevModeDrawer jsdom 交互升级（R16-B：复制反馈与回落）', () => {
  beforeEach(() => clearTelemetry());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  /** jsdom 无 clipboard 实现：以可配置属性桩注入 writeText 并返回 mock */
  function stubClipboard() {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    return writeText;
  }

  it('复制按钮：点击写入 meta JSON 至剪贴板并切换为 Check 反馈图标', () => {
    const writeText = stubClipboard();
    const props = drawerProps();
    const { container, getByTitle } = render(createElement(DevModeDrawer, props));

    fireEvent.click(getByTitle('复制 Dev Mode Schema'));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(meta, null, 2));
    expect(container.querySelector('.lucide-check')).toBeTruthy();
    expect(container.querySelector('.lucide-copy')).toBeNull();
  });

  it('复制反馈 2s 回落：fake timers 推进 2000ms 后 Check 还原为 Copy', () => {
    vi.useFakeTimers();
    stubClipboard();
    const props = drawerProps();
    const { container, getByTitle } = render(createElement(DevModeDrawer, props));

    fireEvent.click(getByTitle('复制 Dev Mode Schema'));
    expect(container.querySelector('.lucide-check')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(container.querySelector('.lucide-check')).toBeNull();
    expect(container.querySelector('.lucide-copy')).toBeTruthy();
  });
});
