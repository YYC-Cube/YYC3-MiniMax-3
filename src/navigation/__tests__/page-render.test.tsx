/**
 * @file: page-render.test.tsx
 * @description: 43 页全量真实渲染冒烟 — renderToStaticMarkup 闭合「渲染冒烟只覆盖元素创建」缺口
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.1
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { PageId } from '../../types';
import { getPageEntry, PAGE_IDS, type RenderContext } from '../registry';

/** 渲染上下文桩（与 registry.test.tsx 同构；页面按需挑选字段） */
const ctx: RenderContext = {
  navigate: () => { },
  viewState: 'normal',
  driveMode: 'L1',
  onDriveModeChange: () => { },
  openCounsel: () => { },
  openCognition: () => { },
};

/**
 * 经 lazy 载荷取解析后的页面组件，以 registry 绑定的 props 做真实静态渲染。
 * 与 registry.test 的静默守卫不同：本冒烟取不到载荷即硬失败（渲染保证不容跳过）。
 */
async function renderPage(pageId: PageId, viewState: RenderContext['viewState'] = 'normal'): Promise<string> {
  const element = getPageEntry(pageId).render({ ...ctx, viewState }) as {
    type?: { _payload?: { _result?: unknown } };
    props?: Record<string, unknown>;
  };
  const loader = element.type?._payload?._result;
  if (typeof loader !== 'function') {
    throw new Error(`${pageId} lazy 载荷结构变化，渲染冒烟无法解析（请同步更新取件方式）`);
  }
  const load = loader as () => Promise<{ default?: unknown }>;
  const mod = await load();
  const Page = mod.default as ComponentType<Record<string, unknown>>;
  return renderToStaticMarkup(createElement(Page, element.props ?? {}));
}

describe('navigation/pages 43 页真实渲染冒烟', () => {
  it('全量静态渲染：每页输出非空 HTML（渲染期崩溃即刻红，R9 类缺陷从点击期前置到测试期）', async () => {
    expect(PAGE_IDS).toHaveLength(43);
    for (const pageId of PAGE_IDS) {
      const html = await renderPage(pageId);
      expect(html.length, `${pageId} 渲染输出为空`).toBeGreaterThan(100);
    }
  });

  it('error 分支端到端：viewState=error 页面直出 ErrorState 默认降级文案（R13 恢复动作单源页面级实证）', async () => {
    const html = await renderPage('publish', 'error');
    expect(html).toContain('平台分发网关超时');
    expect(html).toContain('降级路径已激活');
    expect(html).toContain('重试当前链路');
  });
});
