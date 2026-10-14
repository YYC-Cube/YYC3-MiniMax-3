/**
 * @file: services.test.ts
 * @description: 单元测试：services.test
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import {
  ENDPOINTS,
  assetService,
  collabService,
  cognitionService,
  publishingService,
  scriptService,
  taskService,
} from '../services';

describe('api/services — 业务域服务契约', () => {
  it('scriptService.list 返回剧本演示数据（Mock 优先）', async () => {
    const scripts = await scriptService.list();
    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts[0]).toHaveProperty('gateLevel');
  });

  it('scriptService.detail 命中与未命中分别返回实体/undefined', async () => {
    const hit = await scriptService.detail('sc-101');
    const miss = await scriptService.detail('not-exist');
    expect(hit?.id).toBe('sc-101');
    expect(miss).toBeUndefined();
  });

  it('各服务 list 直通对应领域模型数组', async () => {
    await expect(assetService.list()).resolves.toHaveProperty('length');
    await expect(assetService.batchItems()).resolves.toHaveProperty('length');
    await expect(taskService.list()).resolves.toHaveProperty('length');
    await expect(publishingService.accounts()).resolves.toHaveProperty('length');
    await expect(publishingService.matrix()).resolves.toHaveProperty('length');
    await expect(cognitionService.learningSamples()).resolves.toHaveProperty('length');
    await expect(cognitionService.memories()).resolves.toHaveProperty('length');
    await expect(collabService.comments()).resolves.toHaveProperty('length');
  });

  it('端点注册表与 v2 factory 契约对齐', () => {
    expect(ENDPOINTS.scripts).toBe('/api/v2/factory/scripts');
    expect(ENDPOINTS.tasks).toBe('/api/v2/factory/tasks');
    expect(ENDPOINTS.publishMatrix).toBe('/api/v2/publishing/matrix');
  });
});
