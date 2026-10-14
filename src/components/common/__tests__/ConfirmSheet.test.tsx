/**
 * @file: ConfirmSheet.test.tsx
 * @description: ConfirmSheet 交互契约测试 — 门卫/默认文案/三按钮派发/破坏性分支/children 槽
 * @author: AI Tutor <minimax>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmSheet } from '../ConfirmSheet';

const baseProps = {
  isOpen: true,
  title: '确认删除该资产？',
  description: '删除后不可恢复，将同步下线关联分发链路。',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

type El = {
  type: unknown;
  props: { onClick?: unknown; children?: unknown; className?: string };
};

function collectButtons(node: unknown): El[] {
  if (Array.isArray(node)) return node.flatMap((c) => collectButtons(c));
  if (!node || typeof node !== 'object') return [];
  const el = node as El;
  return (el.type === 'button' ? [el] : []).concat(collectButtons(el.props?.children));
}

function fire(el: El): void {
  (el.props.onClick as () => void)();
}

describe('ConfirmSheet 交互契约（零依赖元素树派发）', () => {
  it('isOpen=false 门卫契约：直接返回 null，不产生任何元素', () => {
    const tree = ConfirmSheet({ ...baseProps, isOpen: false });
    expect(tree).toBeNull();
  });

  it('默认渲染：标题、描述、二次风控提示与默认按钮文案', () => {
    const html = renderToStaticMarkup(createElement(ConfirmSheet, baseProps));
    expect(html).toContain('确认删除该资产？');
    expect(html).toContain('删除后不可恢复，将同步下线关联分发链路。');
    expect(html).toContain('二次风控审核机制');
    expect(html).toContain('确认执行');
    expect(html).toContain('取消');
  });

  it('三按钮派发：X 与取消触发 onCancel 且不动 onConfirm；确认触发 onConfirm', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const tree = ConfirmSheet({ ...baseProps, onConfirm, onCancel }) as El;
    const buttons = collectButtons(tree);
    expect(buttons).toHaveLength(3);

    fire(buttons[0]);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    fire(buttons[1]);
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();

    fire(buttons[2]);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('isDestructive 双分支样式 + 自定义按钮文案透传', () => {
    const safe = renderToStaticMarkup(createElement(ConfirmSheet, baseProps));
    expect(safe).toContain('bg-[#00e0b8]');
    expect(safe).not.toContain('bg-[#ff4422]');

    const danger = renderToStaticMarkup(
      createElement(ConfirmSheet, {
        ...baseProps,
        isDestructive: true,
        confirmText: '删除资产',
        cancelText: '再想想',
      })
    );
    expect(danger).toContain('bg-[#ff4422]');
    expect(danger).not.toContain('bg-[#00e0b8]');
    expect(danger).toContain('删除资产');
    expect(danger).toContain('再想想');
  });

  it('children 槽渲染：附加内容出现在面板内', () => {
    const html = renderToStaticMarkup(
      createElement(ConfirmSheet, {
        ...baseProps,
        children: createElement('div', null, '附加风控说明：需管理员复核'),
      })
    );
    expect(html).toContain('附加风控说明：需管理员复核');
  });
});
