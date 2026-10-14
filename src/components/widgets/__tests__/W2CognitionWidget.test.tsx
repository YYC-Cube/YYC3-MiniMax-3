// @vitest-environment jsdom
/**
 * @file: W2CognitionWidget.test.tsx
 * @description: W2CognitionWidget jsdom 交互契约 — 门卫 null/Step 6 初始态/Enter 注入/空注入守卫与按钮同效（含 useState 禁直调）
 * @author: AI Tutor <minimax>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { W2CognitionWidget } from '../W2CognitionWidget';

// React 19 act 环境标志：RTL render/fireEvent/act 依赖此全局开关
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function widgetProps(overrides: Record<string, unknown> = {}) {
  return {
    isOpen: true,
    onClose: vi.fn(),
    onSwitchToW1: vi.fn(),
    driveMode: 'L1' as const,
    ...overrides,
  };
}

describe('W2CognitionWidget jsdom 交互契约（R16-B：人工指令热注入）', () => {
  afterEach(cleanup);

  it('isOpen=false 门卫：渲染 null 无任何标记', () => {
    const { container } = render(
      createElement(W2CognitionWidget, widgetProps({ isOpen: false }))
    );
    expect(container.innerHTML).toBe('');
  });

  it('isOpen=true 初始契约：标题/Step 6/9 当前步/未干预无提示', () => {
    const { container, getByText, queryByText } = render(
      createElement(W2CognitionWidget, widgetProps())
    );

    expect(getByText('W2 认知增强浮窗 · ReAct-C 轨迹复盘')).toBeTruthy();
    expect(container.textContent).toMatch(/Step\s*6\/9/);
    expect(queryByText(/已成功向/)).toBeNull();
  });

  it('Enter 注入：干预提示出现于 Step 6 且输入框清空', () => {
    const { getByPlaceholderText, getByText } = render(
      createElement(W2CognitionWidget, widgetProps())
    );

    const input = getByPlaceholderText('在当前推理步骤注入干预约束...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '约束叶凌霄剑气扩散半径' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(getByText(/已成功向 Step 6 注入干预/)).toBeTruthy();
    expect(input.value).toBe('');
  });

  it('空注入守卫与按钮同效：纯空格不提示不清空；有效输入点击「注入」按钮同样触发', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      createElement(W2CognitionWidget, widgetProps())
    );

    const input = getByPlaceholderText('在当前推理步骤注入干预约束...') as HTMLInputElement;

    // 空注入守卫：trim 后提前 return，提示不出现、输入保留
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(queryByText(/已成功向/)).toBeNull();
    expect(input.value).toBe('   ');

    // 「注入」按钮与 Enter 同效
    fireEvent.change(input, { target: { value: '限制镜头时长 8.2s' } });
    fireEvent.click(getByText('注入'));
    expect(getByText(/已成功向 Step 6 注入干预/)).toBeTruthy();
    expect(input.value).toBe('');
  });
});
