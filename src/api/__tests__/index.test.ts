/**
 * YYC³ API 契约层 — 统一出口（barrel）契约测试
 *
 * 验证 '@/api' 出口面稳定：9 个域服务、端点清单、请求客户端
 * 与数据装载 Hook 全部可从统一入口获取，防止导出意外缺失。
 * @file: index.test.ts
 * @description: YYC³ API 契约层 — 统一出口（barrel）契约测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { describe, expect, it } from 'vitest';
import * as api from '../index';

describe('YYC³ API 契约层 — 统一出口', () => {
  it('导出端点清单与全部 9 个域服务', () => {
    expect(api.ENDPOINTS).toBeTypeOf('object');
    const services = [
      api.scriptService,
      api.storyboardService,
      api.assetService,
      api.taskService,
      api.timelineService,
      api.editingService,
      api.publishingService,
      api.collabService,
      api.cognitionService,
    ];
    for (const service of services) {
      expect(service).toBeTypeOf('object');
    }
    expect(services).toHaveLength(9);
  });

  it('导出请求客户端与数据装载 Hook', () => {
    expect(api.apiRequest).toBeTypeOf('function');
    expect(api.ApiError).toBeTypeOf('function');
    expect(api.useApiData).toBeTypeOf('function');
  });

  it('ApiError 实例携带端点与错误码元信息', () => {
    const err = new api.ApiError('/demo', 'NO_BACKEND', '无 Mock 兜底');
    expect(err.name).toBe('ApiError');
    expect(err.endpoint).toBe('/demo');
    expect(err.code).toBe('NO_BACKEND');
    expect(err.message).toBe('无 Mock 兜底');
  });
});
