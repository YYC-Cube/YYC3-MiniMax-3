/**
 * @file: TopNav.test.tsx
 * @description: 组件：TopNav 顶栏渲染契约 — 品牌区/全局入口文案矩阵与通知徽章分支
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.1
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import TopNav from '../TopNav';

const baseProps = {
  currentDriveMode: 'L1' as const,
  onDriveModeChange: () => { },
  onOpenCommand: () => { },
  onToggleDevMode: () => { },
  isDevModeOpen: false,
  onTogglePrototype: () => { },
  isPrototypeOpen: false,
  onToggleFamilyWidget: () => { },
  onNavigate: () => { },
  onOpenSidebar: () => { },
};

describe('components/layout/TopNav 渲染契约', () => {
  it('品牌与关键入口文案齐备（搜索/⌘K/时钟环/双原型/Dev Mode）', () => {
    const html = renderToStaticMarkup(<TopNav {...baseProps} />);
    expect(html).toContain('YYC³');
    expect(html).toContain('AI Family · Comic Drama');
    expect(html).toContain('全局搜索');
    expect(html).toContain('⌘K');
    expect(html).toContain('Agent 时钟环');
    expect(html).toContain('双原型剧本');
    expect(html).toContain('Dev Mode');
  });

  it('移动端汉堡键存在且绑定 aria-label（lg 以上由 CSS 隐藏，不影响 SSR 契约）', () => {
    const html = renderToStaticMarkup(<TopNav {...baseProps} />);
    expect(html).toContain('aria-label="打开导航菜单"');
    expect(html).toContain('aria-label="全局搜索"');
  });

  it('通知徽章：默认未读 2 渲染；传 0 不渲染；按钮总数 = 10 业务（含汉堡+移动搜索）+ 3 驾驶模式 = 13（含 useState 组件须经渲染器，禁直调函数）', () => {
    expect(renderToStaticMarkup(<TopNav {...baseProps} />)).toContain('>2<');
    const html = renderToStaticMarkup(<TopNav {...baseProps} unreadNotifications={0} />);
    expect(html).not.toContain('>2<');
    expect(html.match(/<button/g)?.length ?? 0).toBe(13);
  });
});
