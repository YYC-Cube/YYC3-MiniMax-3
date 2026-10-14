/**
 * YYC³ API 契约层 — 业务域服务
 *
 * 五大业务域 + Auth 域的资源服务。每个服务方法均声明：
 * 1. 端点（与页面 DevModeMeta.apiEndpoint 的 UI 事实源保持一致）
 * 2. 返回类型（复用 src/types 领域模型）
 * 3. Mock 兜底（复用 src/data 按域拆分的演示数据）
 *
 * 页面迁移指引：将「直接 import 演示数据」逐步替换为
 * `await xxxService.list()`，即可在后端就绪后零改动切换真实 API。
 * @file: services.ts
 * @description: YYC³ API 契约层 — 业务域服务
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import {
  MOCK_ACCOUNTS,
  MOCK_ASSETS,
  MOCK_BATCH_ITEMS,
  MOCK_COMMENTS,
  MOCK_LEARNING_SAMPLES,
  MOCK_MEMORIES,
  MOCK_PUBLISH_MATRIX,
  MOCK_SCRIPTS,
  MOCK_SHOTS,
  MOCK_TASKS,
  MOCK_TIMELINE_CLIPS,
  MOCK_VIDEO_TEMPLATES
} from '../data';
import type {
  AccountItem,
  AssetItem,
  BatchItem,
  CollabComment,
  LearningSample,
  MemoryEntry,
  PublishMatrixRow,
  ScriptItem,
  StoryboardShot,
  TaskRecord,
  TimelineClip,
  VideoTemplate
} from '../types';
import { apiRequest } from './client';
import type { UseApiDataOptions } from './useApiData';

/** 端点注册表 — 与 DevModeMeta.apiEndpoint 预埋端点对齐 */
export const ENDPOINTS = {
  scripts: '/api/v2/factory/scripts',
  storyboards: '/api/v2/factory/storyboards',
  assets: '/api/v2/factory/assets',
  batch: '/api/v2/factory/production/batch',
  tasks: '/api/v2/factory/tasks',
  timeline: '/api/v2/editing/timeline/clips',
  templates: '/api/v2/editing/templates',
  accounts: '/api/v2/publishing/accounts',
  publishMatrix: '/api/v2/publishing/matrix',
  learningSamples: '/api/v2/factory/ai-family/learning-samples',
  memories: '/api/v2/factory/ai-family/memories',
  comments: '/api/v2/management/collab/comments',
} as const;

/** 快照键位绑定 — 方法级、与 ENDPOINTS 同源派生（键位知识不外泄页面层，杜绝手写错配污染快照；R12 专项） */
export const SNAPSHOT = {
  scriptList: { snapshotKey: ENDPOINTS.scripts },
  shotList: { snapshotKey: ENDPOINTS.storyboards },
  assetList: { snapshotKey: ENDPOINTS.assets },
  batchItems: { snapshotKey: ENDPOINTS.batch },
  taskList: { snapshotKey: ENDPOINTS.tasks },
  timelineClips: { snapshotKey: ENDPOINTS.timeline },
  videoTemplates: { snapshotKey: ENDPOINTS.templates },
  accounts: { snapshotKey: ENDPOINTS.accounts },
  publishMatrix: { snapshotKey: ENDPOINTS.publishMatrix },
  learningSamples: { snapshotKey: ENDPOINTS.learningSamples },
  memories: { snapshotKey: ENDPOINTS.memories },
  comments: { snapshotKey: ENDPOINTS.comments },
} as const satisfies Record<string, UseApiDataOptions>;

export const scriptService = {
  list: () => apiRequest<ScriptItem[]>(ENDPOINTS.scripts, { mock: () => MOCK_SCRIPTS }),
  detail: (id: string) =>
    apiRequest<ScriptItem | undefined>(`${ENDPOINTS.scripts}/${id}`, {
      mock: () => MOCK_SCRIPTS.find((s) => s.id === id),
    }),
};

export const storyboardService = {
  list: () => apiRequest<StoryboardShot[]>(ENDPOINTS.storyboards, { mock: () => MOCK_SHOTS }),
};

export const assetService = {
  list: () => apiRequest<AssetItem[]>(ENDPOINTS.assets, { mock: () => MOCK_ASSETS }),
  batchItems: () => apiRequest<BatchItem[]>(ENDPOINTS.batch, { mock: () => MOCK_BATCH_ITEMS }),
};

export const taskService = {
  list: () => apiRequest<TaskRecord[]>(ENDPOINTS.tasks, { mock: () => MOCK_TASKS }),
};

export const timelineService = {
  clips: () => apiRequest<TimelineClip[]>(ENDPOINTS.timeline, { mock: () => MOCK_TIMELINE_CLIPS }),
};

export const editingService = {
  templates: () => apiRequest<VideoTemplate[]>(ENDPOINTS.templates, { mock: () => MOCK_VIDEO_TEMPLATES }),
};

export const publishingService = {
  accounts: () => apiRequest<AccountItem[]>(ENDPOINTS.accounts, { mock: () => MOCK_ACCOUNTS }),
  matrix: () => apiRequest<PublishMatrixRow[]>(ENDPOINTS.publishMatrix, { mock: () => MOCK_PUBLISH_MATRIX }),
};

export const cognitionService = {
  learningSamples: () =>
    apiRequest<LearningSample[]>(ENDPOINTS.learningSamples, { mock: () => MOCK_LEARNING_SAMPLES }),
  memories: () => apiRequest<MemoryEntry[]>(ENDPOINTS.memories, { mock: () => MOCK_MEMORIES }),
};

export const collabService = {
  comments: () => apiRequest<CollabComment[]>(ENDPOINTS.comments, { mock: () => MOCK_COMMENTS }),
};
