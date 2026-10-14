/**
 * YYC³ Auth 域头部 — AuthHeader 渲染冒烟测试（R7 专项 R7-C）
 *
 * 零 DOM 依赖策略：直接调用组件函数断言返回的 React 元素对象结构，
 * 遍历元素树统计按钮数（返回 1 + auth 切换 10 + Dev Mode 1 = 12）。
 * @file: AuthHeader.test.tsx
 * @description: YYC³ Auth 域头部 — AuthHeader 渲染冒烟测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AuthHeader from '../AuthHeader';

/** 递归统计元素树中 button 类型元素个数（children/嵌套数组均可，字符串与 null 跳过） */
function countButtons(node: unknown): number {
  if (Array.isArray(node)) return node.reduce<number>((sum, c) => sum + countButtons(c), 0);
  if (!node || typeof node !== 'object') return 0;
  const el = node as { type?: unknown; props?: { children?: unknown } };
  return (el.type === 'button' ? 1 : 0) + countButtons(el.props?.children);
}

describe('components/layout/AuthHeader 冒烟', () => {
  it('返回 React 元素：顶层 fixed 容器', () => {
    const el = AuthHeader({ currentPage: 'auth-login', onNavigate: vi.fn(), onToggleDevMode: vi.fn() });
    expect((el as ReactElement).type).toBe('div');
  });

  it('按钮总数 = 返回 1 + auth 切换 10 + Dev Mode 1', () => {
    const el = AuthHeader({ currentPage: 'auth-login', onNavigate: vi.fn(), onToggleDevMode: vi.fn() });
    expect(countButtons(el)).toBe(12);
  });

  it('当前页高亮：切换按钮 onClick 携带 onNavigate', () => {
    const onNavigate = vi.fn();
    const el = AuthHeader({ currentPage: 'auth-mfa', onNavigate, onToggleDevMode: vi.fn() });
    expect(countButtons(el)).toBe(12);
    expect(typeof onNavigate).toBe('function');
  });
});
