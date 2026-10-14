/**
 * @file: MetricCard.test.tsx
 * @description: 组件：MetricCard 指标卡渲染契约 — 涨跌分支与领域色单源联动
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
import { DOMAIN_COLORS, type DomainType } from '../../../tokens';
import MetricCard from '../MetricCard';

describe('components/common/MetricCard 渲染契约', () => {
  it('基础透传：label/value/unit 与领域色点 title 单源联动', () => {
    const domainKey = (Object.keys(DOMAIN_COLORS) as DomainType[])[0];
    const html = renderToStaticMarkup(<MetricCard label="完播率" value={92.4} unit="%" domain={domainKey} />);
    expect(html).toContain('完播率');
    expect(html).toContain('92.4');
    expect(html).toContain('%');
    expect(html).toContain(DOMAIN_COLORS[domainKey].label);
  });

  it('涨跌分支：正向 ↑ 绿 / 负向 ↓ 红 配色切换', () => {
    const up = renderToStaticMarkup(<MetricCard label="x" value="1" change="+2%" isPositive />);
    expect(up).toContain('↑');
    expect(up).toContain('#22C55E');
    const down = renderToStaticMarkup(<MetricCard label="x" value="1" change="-2%" isPositive={false} />);
    expect(down).toContain('↓');
    expect(down).toContain('#ff4422');
  });

  it('可选槽位：driveTag 与 subtext 按传入渲染', () => {
    const html = renderToStaticMarkup(<MetricCard label="成本" value="¥1.2k" driveTag="L1" subtext="今日合计" />);
    expect(html).toContain('L1');
    expect(html).toContain('今日合计');
  });
});
