/**
 * @file: BatchActionBar.test.tsx
 * @description: BatchActionBar 交互契约测试 — 门卫/计数展示/动作派发/onClear/变体样式
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
import { BatchActionBar } from '../BatchActionBar';

function makeProps() {
  return {
    selectedCount: 3,
    totalCount: 10,
    onClear: vi.fn(),
    actions: [
      { label: '批量发布', variant: 'primary' as const, onClick: vi.fn() },
      { label: '加入队列', variant: 'secondary' as const, onClick: vi.fn() },
      { label: '批量下线', variant: 'danger' as const, onClick: vi.fn() },
    ],
  };
}

type El = {
  type: unknown;
  props: { onClick?: unknown; children?: unknown; className?: string; title?: string };
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

describe('BatchActionBar 交互契约（零依赖元素树派发）', () => {
  it('selectedCount=0 门卫契约：直接返回 null', () => {
    expect(BatchActionBar({ ...makeProps(), selectedCount: 0 })).toBeNull();
  });

  it('计数展示：已选择 N 与 totalCount 分母', () => {
    const html = renderToStaticMarkup(createElement(BatchActionBar, makeProps()));
    expect(html).toContain('已选择');
    expect(html).toContain('3');
    expect(html).toContain('/ 10');
  });

  it('动作按钮派发：N 个动作依次触发对应 onClick', () => {
    const props = makeProps();
    const tree = BatchActionBar(props) as El;
    const buttons = collectButtons(tree);
    expect(buttons).toHaveLength(4);

    fire(buttons[0]);
    expect(props.actions[0].onClick).toHaveBeenCalledTimes(1);
    expect(props.actions[1].onClick).not.toHaveBeenCalled();

    fire(buttons[1]);
    fire(buttons[2]);
    expect(props.actions[1].onClick).toHaveBeenCalledTimes(1);
    expect(props.actions[2].onClick).toHaveBeenCalledTimes(1);
    expect(props.onClear).not.toHaveBeenCalled();
  });

  it('onClear 派发：title=取消全部选择 的清空按钮独立于动作按钮', () => {
    const props = makeProps();
    const tree = BatchActionBar(props) as El;
    const clear = collectButtons(tree).find(
      (b) => b.props.title === '取消全部选择'
    );
    expect(clear).toBeDefined();
    fire(clear as El);
    expect(props.onClear).toHaveBeenCalledTimes(1);
  });

  it('变体样式契约：primary 主色、danger 红色、按钮总数 = 动作数 + 1', () => {
    const html = renderToStaticMarkup(createElement(BatchActionBar, makeProps()));
    expect(html).toContain('批量发布');
    expect(html).toContain('批量下线');
    expect(html).toContain('bg-[#00e0b8]');
    expect(html).toContain('text-[#ff4422]');
  });
});
