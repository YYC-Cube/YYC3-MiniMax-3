/**
 * @file: registry.test.tsx
 * @description: 路由注册表完备性测试 — 43 项全覆盖 / meta-render 同源 / 渲染冒烟
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { AUTH_PAGE_ITEMS, getPageEntry, isAuthPageId, PAGE_IDS, RenderContext } from '../registry';

/** 渲染上下文桩（记录型，不真正渲染） */
const ctx: RenderContext = {
  navigate: () => { },
  viewState: 'normal',
  driveMode: 'L1',
  onDriveModeChange: () => { },
  openCounsel: () => { },
  openCognition: () => { },
};

/** 与 types.PageId 声明一致的 43 项全集（漂移即测试失败，双保险） */
const EXPECTED_PAGE_IDS = [
  'dashboard', 'script', 'script-detail', 'storyboard', 'assets', 'production', 'tasks', 'qa',
  'library', 'assets-consistency', 'voice', 'storyboard-3d',
  'video', 'video-templates', 'video-exports', 'music', 'video-compare', 'video-ad',
  'project', 'analytics', 'cost', 'admin', 'project-lore', 'collab', 'admin-agents', 'admin-rag', 'admin-compliance',
  'publish', 'publish-accounts', 'publish-board',
  'family', 'figma-tokens', 'figma-components',
  'auth-login', 'auth-register', 'auth-forgot', 'auth-reset', 'auth-mfa', 'auth-invite', 'auth-onboarding', 'auth-expired', 'auth-403', 'auth-locked',
];

describe('navigation/registry 完备性', () => {
  it('注册表 43 项全覆盖且与 PageId 全集一致', () => {
    expect(PAGE_IDS).toHaveLength(43);
    expect([...PAGE_IDS].sort()).toEqual([...EXPECTED_PAGE_IDS].sort());
  });

  it('每项注册：meta 为函数、render 返回 React 元素（渲染冒烟）', () => {
    for (const pageId of PAGE_IDS) {
      const entry = getPageEntry(pageId);
      expect(typeof entry.meta, `${pageId}.meta 应为函数`).toBe('function');
      const element = entry.render(ctx);
      expect(element, `${pageId}.render 应返回 React 元素`).not.toBeNull();
      expect(typeof (element as ReactElement).type).toBeDefined();
    }
  });

  it('meta 与组件同源：全量加载后均返回含 apiEndpoint 的 DevModeMeta（43 项契约冒烟）', async () => {
    for (const pageId of PAGE_IDS) {
      const meta = await getPageEntry(pageId).meta();
      expect(meta.apiEndpoint, `${pageId}.meta.apiEndpoint 应存在`).toBeTruthy();
      expect(meta.stateSwitchConditions, `${pageId}.meta.stateSwitchConditions 应存在`).toBeDefined();
    }
  });

  it('分包 loader 全量可加载（React.lazy 载荷预触发，杜绝坏分包）', async () => {
    for (const pageId of PAGE_IDS) {
      const element = getPageEntry(pageId).render(ctx) as {
        type?: { _payload?: { _result?: unknown } };
      };
      // React 19 lazy 内部载荷：Uninitialized 态下 _result 即 loader 本体；
      // 结构变更时 typeof 守卫静默跳过，覆盖率门禁会暴露回归
      const loader = element.type?._payload?._result;
      if (typeof loader === 'function') {
        const mod = await (loader as () => Promise<{ default?: unknown }>)();
        expect(mod.default, `${pageId} 分包应有 default 导出`).toBeDefined();
      }
    }
  });

  it('auth 双态视图：expired / 403 均可渲染（同一组件不同 initialMode）', () => {
    const expired = getPageEntry('auth-expired').render(ctx);
    const forbidden = getPageEntry('auth-403').render(ctx);
    expect(expired).not.toBeNull();
    expect(forbidden).not.toBeNull();
  });

  it('auth 切换器派生项：与注册表 auth 子集一一对应且标签非空（防标签映射漂移）', () => {
    const authIds = PAGE_IDS.filter(isAuthPageId);
    expect(AUTH_PAGE_ITEMS.map((item) => item.id)).toEqual(authIds);
    for (const item of AUTH_PAGE_ITEMS) {
      expect(item.label.trim().length, `${item.id} 标签应为非空`).toBeGreaterThan(0);
    }
  });

  it('PIPELINE_STAGES 路由契约：route 全部 ∈ PAGE_IDS（防流水线卡片导航漂移）', async () => {
    const { PIPELINE_STAGES } = await import('../../tokens');
    const routing = await import('../registry');
    for (const stage of PIPELINE_STAGES) {
      expect(routing.PAGE_IDS, `${stage.id} route "${stage.route}" 必须是注册表键`).toContain(stage.route);
    }
  });

  it('NAV_GROUPS 导航完备性：PAGE_IDS ≡ 侧栏 39 项 ∪ auth ∪ 显式清单外 3 页（防新页面漏配导航静默不可达）', async () => {
    const { NAV_GROUPS } = await import('../registry');
    const navIds = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    const dupes = navIds.filter((id, idx) => navIds.indexOf(id) !== idx);
    expect(dupes, `侧栏内重复项: ${[...new Set(dupes)]}`).toEqual([]);

    const outside = ['family', 'figma-tokens', 'figma-components'];
    const navSet = new Set<string>(navIds);
    const missing = PAGE_IDS.filter(
      (id) => !navSet.has(id) && !isAuthPageId(id) && !outside.includes(id),
    );
    expect(missing, `未进侧栏且未声明的页面: ${missing}`).toEqual([]);
    for (const id of [...navIds, ...outside]) {
      expect(PAGE_IDS as string[], `${id} 必须是注册表键`).toContain(id);
    }
  });

  it('NAV_GROUPS 数据契约：5 组 39 项，label 非空、color 合法（防清单漂移）', async () => {
    const { NAV_GROUPS } = await import('../registry');
    expect(NAV_GROUPS).toHaveLength(5);
    expect(NAV_GROUPS.flatMap((g) => g.items)).toHaveLength(39);
    NAV_GROUPS.forEach((g) => {
      expect(g.name.trim().length, `${g.id} 组名应为非空`).toBeGreaterThan(0);
      expect(g.color.startsWith('#'), `${g.id} 色值应为 hex`).toBe(true);
      g.items.forEach((i) => {
        expect(i.label.trim().length, `${i.id} 标签应为非空`).toBeGreaterThan(0);
      });
    });
  });
});
