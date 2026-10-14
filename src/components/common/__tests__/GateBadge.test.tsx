/**
 * @file: GateBadge.test.tsx
 * @description: 组件：GateBadge 门禁徽章渲染契约 — 与 tokens 门禁阶梯单源联动
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GATE_CURRENT_ID, GATE_LEVELS } from '../../../tokens';
import { GateBadge } from '../GateBadge';

describe('components/common/GateBadge 渲染契约', () => {
  it('门禁徽章与 tokens 单源联动：id/名称/准入标准透传至正文与 title，passed 渲染 ✓', () => {
    const gate = GATE_LEVELS.find((g) => g.id === GATE_CURRENT_ID);
    expect(gate, 'GATE_CURRENT_ID 必须在门禁阶梯内').toBeDefined();
    const html = renderToStaticMarkup(<GateBadge level={GATE_CURRENT_ID} active passed />);
    expect(html).toContain(gate!.id);
    expect(html).toContain(gate!.name);
    expect(html).toContain('准入标准');
    expect(html).toContain('✓');
  });

  it('状态分层：默认灰无 ✓ 无脉冲；active 渲染脉冲点；passed 配色切换为通过绿', () => {
    const idle = renderToStaticMarkup(<GateBadge level={GATE_CURRENT_ID} />);
    expect(idle).not.toContain('✓');
    expect(idle).not.toContain('animate-pulse');
    const active = renderToStaticMarkup(<GateBadge level={GATE_CURRENT_ID} active />);
    expect(active).toContain('animate-pulse');
    const passed = renderToStaticMarkup(<GateBadge level={GATE_CURRENT_ID} passed />);
    expect(passed).toContain('#22C55E');
  });
});
