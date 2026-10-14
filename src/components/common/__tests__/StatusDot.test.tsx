/**
 * @file: StatusDot.test.tsx
 * @description: 组件：StatusDot 状态点渲染契约 — 脉冲双层/静止单层与尺寸映射
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
import StatusDot from '../StatusDot';

describe('components/common/StatusDot 渲染契约', () => {
  it('默认脉冲：外 ping + 内核双层渲染，颜色/尺寸/标题透传', () => {
    const html = renderToStaticMarkup(<StatusDot title="运行中" size="md" color="#00e0b8" />);
    expect(html).toContain('animate-ping');
    expect(html).toContain('title="运行中"');
    expect(html.match(/#00e0b8/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(html).toContain('w-2.5 h-2.5');
  });

  it('pulse=false：仅内核单层静止渲染', () => {
    const html = renderToStaticMarkup(<StatusDot pulse={false} />);
    expect(html).not.toContain('animate-ping');
  });
});
