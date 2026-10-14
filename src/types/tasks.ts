/**
 * @file: tasks.ts
 * @description: 任务域类型：任务中心 ReAct-C 步迹记录
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { DriveModeId } from '../tokens';

export interface TaskRecord {
  id: string;
  type: '视频生成' | '硬件渲染' | '音画转码' | '多端分发' | '知识库抽取';
  projectId: string;
  projectName: string;
  submittedAt: string;
  duration: string;
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  driveMode: DriveModeId;
  confidence: number;
  hasLearningSample: boolean;
  currentStep: number; // 1-9 in ReAct-C
  stepsTrace: {
    step: number;
    name: string;
    agentId: string;
    durationMs: number;
    confidence: number;
    status: 'success' | 'running' | 'failed' | 'pending' | 'loopback';
    errorSummary?: string;
  }[];
}
