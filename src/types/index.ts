/**
 * @file: index.ts
 * @description: 类型定义 barrel：按域拆分（core/production/tasks/editing/publishing/cognition/management），统一再导出保持 '../../types' 路径稳定
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v2.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export type { LearningSample, MemoryEntry } from './cognition';
export type { DevModeMeta, PageId, ViewState } from './core';
export type { TimelineClip, VideoTemplate } from './editing';
export type { CollabComment } from './management';
export type { AssetItem, BatchItem, ScriptItem, StoryboardShot } from './production';
export type { AccountItem, PublishMatrixRow } from './publishing';
export type { TaskRecord } from './tasks';
