// @vitest-environment jsdom
/**
 * @file: W1AIFamilyWidget.test.tsx
 * @description: W1AIFamilyWidget jsdom 交互契约 — 折叠 FAB/Enter 发送清空/600ms Agent 回复 fake timers/空输入守卫（含 useState 禁直调）
 * @author: AI Tutor <minimax>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { act, createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { W1AIFamilyWidget } from '../W1AIFamilyWidget';

// React 19 act 环境标志：RTL render/fireEvent/act 依赖此全局开关
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function widgetProps(overrides: Record<string, unknown> = {}) {
  return {
    isOpen: true,
    onToggle: vi.fn(),
    onOpenCognitionWidget: vi.fn(),
    onOpenCounsel: vi.fn(),
    onNavigate: vi.fn(),
    ...overrides,
  };
}

describe('W1AIFamilyWidget jsdom 交互契约（R16-B：发送链路与折叠态）', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('isOpen=false 折叠 FAB：渲染悬浮球而非面板，点击触发 onToggle', () => {
    const props = widgetProps({ isOpen: false });
    const { container, getByTitle, queryByText } = render(
      createElement(W1AIFamilyWidget, props)
    );

    // 折叠态不渲染展开面板
    expect(queryByText('YYC³ AI Family 协同中枢')).toBeNull();
    // 悬浮球存在且含 Sparkles 图标与角标
    expect(getByTitle('展开 AI Family 全局助手浮窗')).toBeTruthy();
    expect(container.querySelector('.lucide-sparkles')).toBeTruthy();

    fireEvent.click(getByTitle('展开 AI Family 全局助手浮窗'));
    expect(props.onToggle).toHaveBeenCalledTimes(1);
  });

  it('Enter 发送：用户消息入列且输入框清空（fake timers 消化模拟回复）', () => {
    vi.useFakeTimers();
    const props = widgetProps();
    const { getByPlaceholderText, getByText, queryByText } = render(
      createElement(W1AIFamilyWidget, props)
    );

    expect(queryByText('推进第三阶段')).toBeNull();

    const input = getByPlaceholderText(/指令发送至/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '推进第三阶段' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(getByText('推进第三阶段')).toBeTruthy();
    expect(input.value).toBe('');

    act(() => {
      vi.advanceTimersByTime(600);
    });
  });

  it('600ms Agent 回复：fake timers 推进后渲染 ReAct-C 回复消息', () => {
    vi.useFakeTimers();
    const props = widgetProps();
    const { getByPlaceholderText, queryByText } = render(
      createElement(W1AIFamilyWidget, props)
    );

    const input = getByPlaceholderText(/指令发送至/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '推进第三阶段' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(queryByText(/已收到您的指令/)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(queryByText(/已收到您的指令/)).toBeTruthy();
    expect(queryByText(/ReAct-C 九步机制/)).toBeTruthy();
  });

  it('空输入守卫：纯空格 Enter 不入列、不清空、600ms 后无模拟回复', () => {
    vi.useFakeTimers();
    const props = widgetProps();
    const { getByPlaceholderText, queryByText } = render(
      createElement(W1AIFamilyWidget, props)
    );

    const input = getByPlaceholderText(/指令发送至/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // handleSend 的 trim 守卫提前 return：输入未被清空，回复 timer 未注册
    expect(input.value).toBe('   ');
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(queryByText(/已收到您的指令/)).toBeNull();
  });
});
