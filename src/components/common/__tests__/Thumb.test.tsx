/**
 * @file: Thumb.test.tsx
 * @description: 组件：Thumb 缩略图双分支渲染契约 — 无 src 确定性占位降级 / 有 src lazy 透传
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
import Thumb from '../Thumb';

describe('components/common/Thumb 渲染契约', () => {
  it('无 src：确定性渐变占位（降级标记 + 无障碍标签 + 4 字符截断）', () => {
    const html = renderToStaticMarkup(<Thumb label="镜头-018" />);
    expect(html).toContain('data-degraded="true"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="镜头-018"');
    expect(html).toContain('镜头-0');
    expect(html).toContain('linear-gradient');
    expect(html).not.toContain('<img');
  });

  it('有 src：lazy img 全量透传且不降级', () => {
    const html = renderToStaticMarkup(<Thumb src="/demo/shot-018.webp" alt="分镜 18" label="镜头-018" />);
    expect(html).toContain('<img');
    expect(html).toContain('src="/demo/shot-018.webp"');
    expect(html).toContain('alt="分镜 18"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain('data-degraded');
  });
});
