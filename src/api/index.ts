/**
 * YYC³ API 契约层 — 统一出口
 * @file: index.ts
 * @description: YYC³ API 契约层 — 统一出口
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 * @example
 * import { scriptService } from '@/api';
 * const scripts = await scriptService.list();
*/
export { ApiError, apiRequest } from './client';
export type { ApiErrorCode, RequestOptions } from './client';
export { ENDPOINTS, SNAPSHOT, assetService, cognitionService, collabService, editingService, publishingService, scriptService, storyboardService, taskService, timelineService } from './services';
export { useApiData } from './useApiData';
export type { ApiDataState } from './useApiData';
