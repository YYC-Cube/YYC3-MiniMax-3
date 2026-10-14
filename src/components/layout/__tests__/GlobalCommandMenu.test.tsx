// @vitest-environment jsdom
/**
 * @file: GlobalCommandMenu.test.tsx
 * @description: GlobalCommandMenu 渲染与交互契约 — SSR 门卫/三组 20 命令全量 + jsdom 交互升级（搜索过滤/空态/Esc 关闭/命令点击；含 useState+useEffect(window)，禁直调）
 * @author: AI Tutor <minimax>
 * @version: v1.1.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalCommandMenu } from '../GlobalCommandMenu';

// React 19 act 环境标志：RTL render/fireEvent/act 依赖此全局开关
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function menuProps(overrides: Record<string, unknown> = {}) {
  return {
    isOpen: true,
    onClose: vi.fn(),
    onNavigate: vi.fn(),
    ...overrides,
  };
}

/** SSR 渲染 helper：命名避开 RTL render，防遮蔽 */
function renderHtml(props: ReturnType<typeof menuProps>): string {
  return renderToStaticMarkup(createElement(GlobalCommandMenu, props));
}

describe('GlobalCommandMenu SSR 渲染契约（含 useState+useEffect，一律经渲染器）', () => {
  it('isOpen=false 门卫契约：不产生任何标记', () => {
    expect(renderHtml(menuProps({ isOpen: false }))).toBe('');
  });

  it('isOpen=true 全量契约：三组 20 命令 + 关闭按钮 = 21 按钮，抽样与文案矩阵', () => {
    const html = renderHtml(menuProps());

    // 分组结构：快捷跳转 8 + 生产域操作 3 + Auth 鉴权域 9 = 20 命令按钮 + 1 关闭按钮
    expect(html).toContain('快捷跳转');
    expect(html).toContain('生产域操作');
    expect(html).toContain('Auth 鉴权域');
    expect(html.match(/<button/g)?.length ?? 0).toBe(21);

    // 抽样命令（跨组）
    expect(html).toContain('工作台首页');
    expect(html).toContain('产线总览与双 DGX 状态');
    expect(html).toContain('A01 登录入口');
    expect(html).toContain('55:45 沉浸式登录与品牌时钟环');

    // 搜索栏与 footer 文案矩阵
    expect(html).toContain('输入页面名称、Agent、或操作指令...');
    expect(html).toContain('ESC');
    expect(html).toContain('按 ↑↓ 选择，Enter 确认跳转');
    expect(html).toContain('YYC³ Global Routing');
  });

  it('初始态契约：query 为空时全量命令可见，空态分支不可达', () => {
    const html = renderHtml(menuProps());
    expect(html).not.toContain('未检索到相关指令或页面');
    // window keydown 监听在 effect 期注册，SSR 渲染不触碰 window —— 渲染成功即为安全性证据
  });
});

describe('GlobalCommandMenu jsdom 交互升级（R16-B：真实 DOM 状态迁移）', () => {
  afterEach(cleanup);

  it('搜索过滤：输入「登录」仅保留 Auth 组命中项（A01/A07），剔除未命中命令与空组', () => {
    const props = menuProps();
    const { getByPlaceholderText, getByText, queryByText } = render(
      createElement(GlobalCommandMenu, props)
    );

    fireEvent.change(getByPlaceholderText('输入页面名称、Agent、或操作指令...'), {
      target: { value: '登录' },
    });

    // 未命中命令被隐藏，快捷跳转/生产域两组因零命中整体剔除
    expect(queryByText('工作台首页')).toBeNull();
    expect(queryByText('快捷跳转')).toBeNull();
    expect(queryByText('生产域操作')).toBeNull();
    // title 含「登录」的 A01 与 A07 命中，Auth 组保留
    expect(getByText('A01 登录入口')).toBeTruthy();
    expect(getByText('A07 首次登录引导')).toBeTruthy();
  });

  it('无结果空态：查询无命中时渲染空态文案且所有分组消失', () => {
    const props = menuProps();
    const { getByPlaceholderText, getByText, queryByText } = render(
      createElement(GlobalCommandMenu, props)
    );

    fireEvent.change(getByPlaceholderText('输入页面名称、Agent、或操作指令...'), {
      target: { value: 'zzz不存在' },
    });

    expect(getByText('未检索到相关指令或页面')).toBeTruthy();
    expect(queryByText('快捷跳转')).toBeNull();
    expect(queryByText('Auth 鉴权域')).toBeNull();
  });

  it('Esc 关闭契约：isOpen=true 时 window Escape 触发 onClose；isOpen=false 时被 isOpen 守卫拦截', () => {
    const openProps = menuProps();
    const open = render(createElement(GlobalCommandMenu, openProps));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(openProps.onClose).toHaveBeenCalledTimes(1);
    open.unmount();

    // 门卫态：effect 监听仍注册，但 handler 内 isOpen 守卫拦截关闭调用
    const closedProps = menuProps({ isOpen: false });
    render(createElement(GlobalCommandMenu, closedProps));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(closedProps.onClose).not.toHaveBeenCalled();
  });

  it('命令点击：点击「工作台首页」按序触发 onNavigate(dashboard) 与 onClose', () => {
    const props = menuProps();
    const { getByText } = render(createElement(GlobalCommandMenu, props));

    fireEvent.click(getByText('工作台首页'));

    expect(props.onNavigate).toHaveBeenCalledTimes(1);
    expect(props.onNavigate).toHaveBeenCalledWith('dashboard');
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
