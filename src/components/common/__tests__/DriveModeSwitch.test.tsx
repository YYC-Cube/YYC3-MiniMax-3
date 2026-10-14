/**
 * @file: DriveModeSwitch.test.tsx
 * @description: DriveModeSwitch 交互契约测试 — 三键派发/DRIVE_MODES tokens 联动/variant/size
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
import { DRIVE_MODES, type DriveModeId } from '../../../tokens';
import { DriveModeSwitch } from '../DriveModeSwitch';

type El = {
  type: unknown;
  props: {
    onClick?: unknown;
    children?: unknown;
    style?: Record<string, string> | null;
    title?: string;
  };
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

describe('DriveModeSwitch 交互契约（零依赖元素树派发）', () => {
  it('三键遍历派发：每个按钮点击触发 onChange 收到对应驾驶模式', () => {
    const onChange = vi.fn();
    const tree = DriveModeSwitch({ currentMode: 'L1', onChange }) as El;
    const buttons = collectButtons(tree);
    expect(buttons).toHaveLength(3);

    (['L0', 'L1', 'L2'] as DriveModeId[]).forEach((mode, i) => {
      fire(buttons[i]);
      expect(onChange).toHaveBeenNthCalledWith(i + 1, mode);
    });
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('active 联动 DRIVE_MODES tokens：active 键 style.color 精确等于 token 色 + 唯一脉冲点', () => {
    const onChange = vi.fn();
    const tree = DriveModeSwitch({ currentMode: 'L2', onChange }) as El;
    const buttons = collectButtons(tree);
    const active = buttons.find(
      (b) => b.props.style?.color === DRIVE_MODES.L2.color
    );
    expect(active).toBeDefined();
    expect(buttons.filter((b) => b.props.style?.color === DRIVE_MODES.L2.color)).toHaveLength(1);
    expect(active?.props.style?.border).toBe(`1px solid ${DRIVE_MODES.L2.color}60`);

    const html = renderToStaticMarkup(
      createElement(DriveModeSwitch, { currentMode: 'L2', onChange })
    );
    expect(html.match(/animate-pulse/g)).toHaveLength(1);
  });

  it('variant=full 渲染 DRIVE_MODES 各模式名；默认 compact 不渲染', () => {
    const onChange = vi.fn();
    const full = renderToStaticMarkup(
      createElement(DriveModeSwitch, { currentMode: 'L1', onChange, variant: 'full' })
    );
    (['L0', 'L1', 'L2'] as DriveModeId[]).forEach((m) => {
      expect(full).toContain(DRIVE_MODES[m].name);
    });

    const compact = renderToStaticMarkup(
      createElement(DriveModeSwitch, { currentMode: 'L1', onChange })
    );
    expect(compact).not.toContain(DRIVE_MODES.L0.name);
  });

  it('title 提示联动 tokens：当前驾驶模式：{name} - {desc}（SSR 实体转义对齐）', () => {
    const onChange = vi.fn();
    const html = renderToStaticMarkup(
      createElement(DriveModeSwitch, { currentMode: 'L1', onChange })
    );
    const expected = `当前驾驶模式：${DRIVE_MODES.L1.name} - ${DRIVE_MODES.L1.desc}`.replace(
      /</g,
      '&lt;'
    );
    expect(html).toContain(expected);
  });
});
