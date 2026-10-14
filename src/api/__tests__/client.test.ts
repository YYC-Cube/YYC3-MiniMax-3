/**
 * @file: client.test.ts
 * @description: 单元测试：client.test
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from '../client';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('api/client — Mock 优先策略', () => {
  it('未配置后端时回退 mock 兜底数据', async () => {
    const result = await apiRequest<string[]>('/api/v2/demo', { mock: () => ['a', 'b'] });
    expect(result).toEqual(['a', 'b']);
  });

  it('未配置后端且无 mock 时抛出 NO_BACKEND', async () => {
    await expect(apiRequest('/api/v2/demo')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'NO_BACKEND',
      endpoint: '/api/v2/demo',
    });
  });
});

describe('api/client — 真实请求契约', () => {
  const fakeFetch = (response: { ok: boolean; status?: number; json?: () => Promise<unknown> }) =>
    vi.fn(async () => response) as unknown as typeof fetch;

  it('配置 VITE_API_BASE_URL 后发起真实请求并解析 JSON', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.yyc3.test');
    const fetchImpl = fakeFetch({ ok: true, json: async () => ({ ok: 1 }) });

    const result = await apiRequest<{ ok: number }>('/ping', { fetchImpl });

    expect(result).toEqual({ ok: 1 });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.yyc3.test/ping',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('基地址末尾斜杠被规范化', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.yyc3.test/');
    const fetchImpl = fakeFetch({ ok: true, json: async () => null });

    await apiRequest('/ping', { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith('https://api.yyc3.test/ping', expect.anything());
  });

  it('非 2xx 响应抛出 HTTP 错误并携带状态码', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.yyc3.test');
    const fetchImpl = fakeFetch({ ok: false, status: 500 });

    await expect(apiRequest('/boom', { fetchImpl })).rejects.toMatchObject({
      code: 'HTTP',
      status: 500,
    });
  });

  it('网络异常包装为 NETWORK 错误', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.yyc3.test');
    const fetchImpl = vi.fn(async () => {
      throw new Error('ECONNREFUSED');
    }) as unknown as typeof fetch;

    await expect(apiRequest('/down', { fetchImpl })).rejects.toBeInstanceOf(ApiError);
  });
});
