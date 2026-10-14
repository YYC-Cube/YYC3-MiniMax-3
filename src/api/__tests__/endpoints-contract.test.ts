/**
 * @file: endpoints-contract.test.ts
 * @description: 端点契约测试 — 页面 DevModeMeta 与 ENDPOINTS 注册表单源对齐（防双源漂移回归）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import { ENDPOINTS } from '../services';

/**
 * 服务承载数据的页面 → ENDPOINTS 键绑定表。
 * ENDPOINTS 为运行时权威侧（服务层实际请求地址）；
 * 页面 DevModeMeta.apiEndpoint 必须引用常量，禁止硬编码字符串。
 * 新增服务承载页面时必须在此登记，否则契约测试失败。
 */
const PAGE_ENDPOINT_BINDING: {
  pageId: string;
  endpoint: keyof typeof ENDPOINTS;
  meta: () => Promise<{ apiEndpoint: string }>;
}[] = [
    { pageId: 'dashboard', endpoint: 'scripts', meta: () => import('../../pages/production/DashboardPage').then((m) => m.DEV_META_DASHBOARD) },
    { pageId: 'script', endpoint: 'scripts', meta: () => import('../../pages/production/ScriptListPage').then((m) => m.DEV_META_SCRIPT_LIST) },
    { pageId: 'storyboard', endpoint: 'storyboards', meta: () => import('../../pages/production/StoryboardPage').then((m) => m.DEV_META_STORYBOARD) },
    { pageId: 'assets', endpoint: 'assets', meta: () => import('../../pages/production/AssetsPage').then((m) => m.DEV_META_ASSETS) },
    { pageId: 'production', endpoint: 'batch', meta: () => import('../../pages/production/BatchProductionPage').then((m) => m.DEV_META_PRODUCTION) },
    { pageId: 'tasks', endpoint: 'tasks', meta: () => import('../../pages/production/TasksPage').then((m) => m.DEV_META_TASKS) },
    { pageId: 'video', endpoint: 'timeline', meta: () => import('../../pages/editing/TimelineEditorPage').then((m) => m.DEV_META_TIMELINE) },
    { pageId: 'project', endpoint: 'scripts', meta: () => import('../../pages/management/ProjectSeriesPage').then((m) => m.DEV_META_PROJECT) },
    { pageId: 'collab', endpoint: 'comments', meta: () => import('../../pages/management/CollabCommentsPage').then((m) => m.DEV_META_COLLAB) },
    { pageId: 'admin-agents', endpoint: 'learningSamples', meta: () => import('../../pages/management/AdminAgentsPage').then((m) => m.DEV_META_AGENTS) },
    { pageId: 'publish-accounts', endpoint: 'accounts', meta: () => import('../../pages/publishing/PublishAccountsPage').then((m) => m.DEV_META_ACCOUNTS) },
    { pageId: 'publish-board', endpoint: 'publishMatrix', meta: () => import('../../pages/publishing/PublishBoardPage').then((m) => m.DEV_META_PUBLISH_BOARD) },
  ];

describe('端点契约 — DevModeMeta 与 ENDPOINTS 单源对齐', () => {
  it('ENDPOINTS 注册表：值唯一且全部位于 /api/v2/ 命名空间', () => {
    const values = Object.values(ENDPOINTS);
    expect(new Set(values).size).toBe(values.length);
    for (const v of values) expect(v.startsWith('/api/v2/')).toBe(true);
  });

  it.each(PAGE_ENDPOINT_BINDING.map((b) => [b.pageId, b] as const))(
    '%s 页面 meta 引用 ENDPOINTS.%s（无硬编码漂移）',
    async (_pageId, binding) => {
      const meta = await binding.meta();
      expect(meta.apiEndpoint).toBe(ENDPOINTS[binding.endpoint]);
    },
  );

  it('绑定表覆盖 ENDPOINTS 中被服务消费的全部页面键', () => {
    const boundKeys = new Set(PAGE_ENDPOINT_BINDING.map((b) => b.endpoint));
    for (const key of ['scripts', 'storyboards', 'assets', 'batch', 'tasks', 'timeline', 'accounts', 'publishMatrix', 'learningSamples', 'comments'] as const) {
      expect(boundKeys.has(key), `ENDPOINTS.${key} 未被绑定表覆盖`).toBe(true);
    }
    // memories 亦由 AdminAgentsPage 双 Hook 消费，主 meta 键为 learningSamples
    expect(ENDPOINTS.memories).toBeDefined();
  });
});
