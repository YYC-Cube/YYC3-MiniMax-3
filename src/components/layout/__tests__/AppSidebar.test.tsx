/**
 * @file: AppSidebar.test.tsx
 * @description: 组件：AppSidebar 渲染契约 — NAV_GROUPS 单源 ↔ 渲染 DOM 39+5 项对账（R11 完备性门禁的 DOM 级验证）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { NAV_GROUPS } from '../../../navigation/registry';
import { AppSidebar } from '../AppSidebar';

/** 递归收集元素树中 button 类型元素（children/嵌套数组均可，字符串与 null 跳过） */
function collectButtons(node: unknown): ReactElement[] {
  if (Array.isArray(node)) return node.flatMap((c) => collectButtons(c));
  if (!node || typeof node !== 'object') return [];
  const el = node as { type?: unknown; props?: { children?: unknown } };
  return (el.type === 'button' ? [el as ReactElement] : []).concat(collectButtons(el.props?.children));
}

describe('components/layout/AppSidebar 渲染契约', () => {
  it('NAV_GROUPS 单源对账：5 组名 + 39 项 label 全部出现在侧栏 DOM（改清单不同步渲染 = 红）', () => {
    const html = renderToStaticMarkup(<AppSidebar currentPage="dashboard" onNavigate={() => {}} />);
    for (const group of NAV_GROUPS) {
      expect(html).toContain(group.name);
      for (const item of group.items) {
        expect(html).toContain(item.label);
      }
    }
  });

  it('结构契约：特殊区 3 + 导航 39 = 42 按钮', () => {
    const el = AppSidebar({ currentPage: 'dashboard', onNavigate: () => {} }) as ReactElement;
    expect(collectButtons(el)).toHaveLength(42);
  });

  it('active 高亮唯一：当前页独享 border-l-2 且左边框色取所在组单源色值', () => {
    const html = renderToStaticMarkup(<AppSidebar currentPage="dashboard" onNavigate={vi.fn()} />);
    expect(html.match(/border-l-2/g)).toHaveLength(1);
    const group = NAV_GROUPS.find((g) => g.items.some((i) => i.id === 'dashboard'));
    expect(group, 'dashboard 必须在侧栏清单内').toBeDefined();
    expect(html).toContain(`border-left-color:${group!.color}`);
  });
});
