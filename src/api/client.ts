/**
 * YYC³ API 契约层 — 统一请求客户端
 *
 * 设计原则（五高架构 · 高可扩展）：
 * - 单一事实：所有端点经此层发起，UI 层禁止直接 fetch
 * - Mock 优先：未配置 VITE_API_BASE_URL 时回退到 options.mock 演示数据
 *   （与各页面 DevModeMeta.apiEndpoint 的 UI 事实源衔接）
 * - 可测试：fetchImpl / 超时均可注入，纯逻辑可单测
 *
 * 接入真实后端：在 .env.local 设置 VITE_API_BASE_URL 即可，页面代码零改动。
 * @file: client.ts
 * @description: YYC³ API 契约层 — 统一请求客户端
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

export type ApiErrorCode = 'NO_BACKEND' | 'NETWORK' | 'TIMEOUT' | 'HTTP';

export class ApiError extends Error {
  readonly endpoint: string;
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(endpoint: string, code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.code = code;
    this.status = status;
  }
}

export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** 请求超时（毫秒），默认 10s */
  timeoutMs?: number;
  /** 后端未接入时的演示数据兜底（Mock 优先策略） */
  mock?: () => T;
  /** 可注入的 fetch 实现（测试用） */
  fetchImpl?: typeof fetch;
}

function getApiBaseUrl(): string | undefined {
  const base = import.meta.env.VITE_API_BASE_URL;
  return typeof base === 'string' && base.length > 0 ? base.replace(/\/+$/, '') : undefined;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions<T> = {}): Promise<T> {
  const base = getApiBaseUrl();

  // Mock 优先：契约先行，后端就绪前由演示数据兜底
  if (!base) {
    if (options.mock) return options.mock();
    throw new ApiError(endpoint, 'NO_BACKEND', `未配置 VITE_API_BASE_URL 且 ${endpoint} 无 Mock 兜底`);
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

  try {
    const res = await fetchImpl(`${base}${endpoint}`, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(endpoint, 'HTTP', `请求失败（HTTP ${res.status}）: ${endpoint}`, res.status);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      endpoint,
      controller.signal.aborted ? 'TIMEOUT' : 'NETWORK',
      controller.signal.aborted ? `请求超时（>${options.timeoutMs ?? 10_000}ms）: ${endpoint}` : `网络异常: ${endpoint}`,
    );
  } finally {
    clearTimeout(timer);
  }
}
