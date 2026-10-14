/**
 * YYC³ 渲染域降级单点 — RouteErrorBoundary 测试（R10 专项 R10-A）
 *
 * 零 DOM 依赖策略：静态方法直调 + 实例方法模拟 + PageSlot 元素结构断言（遥测走 vi.mock 桩）。
 * @file: RouteErrorBoundary.test.tsx
 * @description: YYC³ 渲染域降级单点 — RouteErrorBoundary 测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../observability/telemetry', () => ({
  recordEvent: vi.fn(),
}));

import { recordEvent } from '../../../observability/telemetry';
import RouteErrorBoundary, { PageSlot } from '../RouteErrorBoundary';

describe('components/common/RouteErrorBoundary', () => {
  it('getDerivedStateFromError：错误 → 降级态（含原始 error）', () => {
    const boom = new Error('chunk boom');
    expect(RouteErrorBoundary.getDerivedStateFromError(boom)).toEqual({ hasError: true, error: boom });
  });

  it('componentDidCatch：渲染异常记录 error 遥测（进本地环形缓冲链路）', () => {
    const inst = Object.create(RouteErrorBoundary.prototype) as {
      componentDidCatch: (e: Error, info: { componentStack: string }) => void;
    };
    inst.componentDidCatch(new Error('render boom'), { componentStack: '\n    at DashboardPage' });
    expect(recordEvent).toHaveBeenCalledWith(
      'error',
      'RouteBoundary',
      'render boom',
      expect.stringContaining('at DashboardPage'),
    );
  });

  it('PageSlot：无错误时以边界组件为根透传 children（Boundary ⊃ Suspense ⊃ 页面）', () => {
    const navigate = vi.fn();
    const el = PageSlot({ navigate, children: 'PAGE_RENDER_RESULT' });
    expect(el.type).toBe(RouteErrorBoundary);
    expect(el.props.children.type).toBe(Suspense); // React 19：Suspense type 为内部 symbol，用同一性比较
    expect(el.props.children.props.children).toBe('PAGE_RENDER_RESULT');
  });
});
