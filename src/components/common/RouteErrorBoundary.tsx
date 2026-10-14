/**
 * YYC³ 渲染域降级单点（R10 专项 R10-A）— 路由错误边界 + 页面插槽
 *
 * RouteErrorBoundary：捕获页面 chunk 懒加载失败与渲染期异常 → 本地遥测 → 降级 UI（重试/返航）；
 * PageSlot：Boundary ⊃ Suspense ⊃ 页面渲染结果的唯一插槽（App auth/主分支共用）。
 * @file: RouteErrorBoundary.tsx
 * @description: YYC³ 渲染域降级单点 — 路由错误边界 + 页面插槽
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { Component, Suspense } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { recordEvent } from '../../observability/telemetry';
import type { PageId } from '../../types';

interface RouteErrorBoundaryProps {
  navigate: (page: PageId) => void;
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/** 页面 chunk 按需加载兜底（自 App 迁入，PageSlot 专属） */
function PageFallback() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[rgba(0,224,184,0.25)] border-t-[#00e0b8] animate-spin" />
      <span className="text-xs font-mono text-[#5c697a]">页面模块按需加载中...</span>
    </div>
  );
}

export default class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 渲染域异常进既有本地遥测链路（环形缓冲 → DevModeDrawer 面板）
    recordEvent('error', 'RouteBoundary', error.message, String(info.componentStack).slice(0, 200));
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleBackHome = () => {
    this.handleRetry();
    this.props.navigate('dashboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4" data-testid="route-fallback">
          <div className="text-3xl">🫧</div>
          <div className="text-sm font-bold text-[#e8f0f8]">页面加载异常，已安全降级</div>
          <div className="text-xs font-mono text-[#5c697a] max-w-md text-center break-all">
            {this.state.error?.message}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-1.5 rounded-lg bg-[#00e0b8] text-[#0a1628] text-xs font-bold cursor-pointer hover:bg-[#33e8cc] transition-colors"
            >
              重试加载
            </button>
            <button
              type="button"
              onClick={this.handleBackHome}
              className="px-4 py-1.5 rounded-lg bg-[#152640] border border-[rgba(0,224,184,0.3)] text-[#00e0b8] text-xs font-bold cursor-pointer hover:bg-[#1f3659] transition-colors"
            >
              返回工作台
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** 页面唯一插槽：错误边界 ⊃ Suspense ⊃ 页面渲染结果（App auth/主分支共用，消除双份样板） */
export function PageSlot({ navigate, children }: RouteErrorBoundaryProps) {
  return (
    <RouteErrorBoundary navigate={navigate}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </RouteErrorBoundary>
  );
}
