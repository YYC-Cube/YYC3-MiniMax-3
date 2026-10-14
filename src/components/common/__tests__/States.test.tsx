/**
 * @file: States.test.tsx
 * @description: 组件：States 四态渲染契约 — ErrorState 零 prop 重试按钮锁定 R13 恢复动作单源
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
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../States';

/** button 元素窄化形态（React 19 ReactElement.props 为 unknown，断言 onClick 前需显式收窄） */
type ButtonEl = { type: unknown; props: { onClick?: unknown; children?: unknown } };

/** 递归收集元素树中 button 类型元素（children/嵌套数组均可，字符串与 null 跳过） */
function collectButtons(node: unknown): ButtonEl[] {
  if (Array.isArray(node)) return node.flatMap((c) => collectButtons(c));
  if (!node || typeof node !== 'object') return [];
  const el = node as { type?: unknown; props?: { children?: unknown } };
  return (el.type === 'button' ? [el as ButtonEl] : []).concat(collectButtons(el.props?.children));
}

describe('components/common/States 渲染契约', () => {
  it('ErrorState 零 prop：默认文案 + 错误码 + 降级路径 + 重试按钮齐备（R13 恢复动作单源行为契约）', () => {
    const html = renderToStaticMarkup(<ErrorState />);
    expect(html).toContain('算力节点通信超时或异常');
    expect(html).toContain('ERR_VLLM_SOCKET_TIMEOUT_504');
    expect(html).toContain('降级路径已激活');
    expect(html).toContain('重试当前链路');
    // 30 页调用点零 prop 后按钮仍渲染 —— 默认化不等于消失
    expect(collectButtons(ErrorState({}) as ReactElement)).toHaveLength(1);
  });

  it('ErrorState 自定义文案/错误码/降级路径全量透传且覆盖默认值', () => {
    const html = renderToStaticMarkup(
      <ErrorState
        title="平台分发网关超时"
        description="网关异常"
        errorCode="ERR_GW_504"
        fallbackManualPath="手动导出路径已开启"
      />,
    );
    expect(html).toContain('平台分发网关超时');
    expect(html).toContain('ERR_GW_504');
    expect(html).toContain('手动导出路径已开启');
    expect(html).not.toContain('ERR_VLLM_SOCKET_TIMEOUT_504');
  });

  it('ErrorState onAction 可注入：按钮 onClick 即传入回调（恢复动作替换点）', () => {
    const onAction = vi.fn();
    const buttons = collectButtons(ErrorState({ onAction }) as ReactElement);
    expect(buttons).toHaveLength(1);
    expect(buttons[0].props.onClick).toBe(onAction);
  });

  it('EmptyState 无 action 时零按钮（与 ErrorState 对照：默认化仅 ErrorState）', () => {
    const html = renderToStaticMarkup(<EmptyState />);
    expect(html).toContain('暂无产线数据');
    expect(html).not.toContain('创建第一项');
    expect(collectButtons(EmptyState({}) as ReactElement)).toHaveLength(0);
  });

  it('EmptyState 主/副双 action：按钮渲染且 onClick 逐一绑定传入回调', () => {
    const onAction = vi.fn();
    const onSecondaryAction = vi.fn();
    const buttons = collectButtons(EmptyState({ onAction, onSecondaryAction }) as ReactElement);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].props.onClick).toBe(onAction);
    expect(buttons[1].props.onClick).toBe(onSecondaryAction);
  });

  it('LoadingState 自定义消息透传且保留运转视觉', () => {
    const html = renderToStaticMarkup(<LoadingState message="编译中" subMessage="DGX 调度" />);
    expect(html).toContain('编译中');
    expect(html).toContain('DGX 调度');
    expect(html).toContain('animate-spin');
  });

  it('NoPermissionState 默认权限档零按钮，传入 onAction 后渲染提权按钮', () => {
    const bare = renderToStaticMarkup(<NoPermissionState />);
    expect(bare).toContain('RBAC 级别：Director / Admin');
    expect(collectButtons(NoPermissionState({}) as ReactElement)).toHaveLength(0);
    const withAction = renderToStaticMarkup(<NoPermissionState onAction={() => { }} />);
    expect(withAction).toContain('申请提权审批');
    expect(withAction).toContain('<button');
  });
});
