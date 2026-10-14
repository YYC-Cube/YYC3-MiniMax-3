/**
 * @file: core.ts
 * @description: 核心类型：页面路由 ID、视图状态、DevMode 元数据
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export type PageId =
  | 'dashboard'
  | 'script'
  | 'script-detail'
  | 'storyboard'
  | 'assets'
  | 'production'
  | 'tasks'
  | 'qa'
  | 'video'
  | 'video-templates'
  | 'video-exports'
  | 'project'
  | 'analytics'
  | 'cost'
  | 'admin'
  | 'publish'
  | 'publish-accounts'
  | 'publish-board'
  | 'library'
  | 'assets-consistency'
  | 'voice'
  | 'music'
  | 'storyboard-3d'
  | 'video-compare'
  | 'video-ad'
  | 'project-lore'
  | 'collab'
  | 'admin-agents'
  | 'admin-rag'
  | 'admin-compliance'
  | 'family'
  | 'figma-tokens'
  | 'figma-components'
  | 'auth-login'
  | 'auth-register'
  | 'auth-forgot'
  | 'auth-reset'
  | 'auth-mfa'
  | 'auth-invite'
  | 'auth-onboarding'
  | 'auth-expired'
  | 'auth-403'
  | 'auth-locked';

export type ViewState = 'normal' | 'empty' | 'loading' | 'error' | 'forbidden';

export interface DevModeMeta {
  apiEndpoint: string;
  confidenceSource: string;
  memoryScope: 'session' | 'project' | 'global';
  learningSampleSource?: string;
  driveModePolicy: string;
  stateSwitchConditions: {
    empty: string;
    loading: string;
    error: string;
    forbidden: string;
  };
}
