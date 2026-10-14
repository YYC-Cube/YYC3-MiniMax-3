/**
 * @file: cognition.ts
 * @description: 认知域类型：学习样本、记忆条目
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export interface LearningSample {
  id: string;
  type: '角色一致性' | '口型同步' | '画风稳定性' | '分镜运镜偏好' | '分发时段最佳';
  sourceProject: string;
  sourceShot: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'backtesting';
  confidenceBefore: number;
  confidenceExpected: number;
  recommendation: '入库 Few-shot' | '提升 Prompt 权重' | '加入否定词典';
  reviewNote?: string;
}

export interface MemoryEntry {
  id: string;
  scope: 'session' | 'project' | 'global';
  category: '角色设定' | '叙事风格' | '渲染策略' | '平台风控' | '音色偏好';
  content: string;
  source: string;
  usageCount: number;
  active: boolean;
  createdAt: string;
  lastRecalledAt: string;
  traceShots: string[]; // 影响过的分镜镜头列表
}
