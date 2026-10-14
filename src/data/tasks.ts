/**
 * @file: tasks.ts
 * @description: 任务域演示数据：任务中心 ReAct-C 步迹
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { DEFAULT_AGENT_ID } from '../tokens';
import { TaskRecord } from '../types';

export const MOCK_TASKS: TaskRecord[] = [
  {
    id: 'TASK-20250415-091',
    type: '视频生成',
    projectId: 'sc-101',
    projectName: '凌霄剑仙之都市重修 E01',
    submittedAt: '14:28:10',
    duration: '02m 45s',
    progress: 78,
    status: 'running',
    driveMode: 'L1',
    confidence: 0.89,
    hasLearningSample: true,
    currentStep: 6,
    stepsTrace: [
      { step: 1, name: '安全过滤', agentId: 'zhiyun-shouhu', durationMs: 140, confidence: 0.99, status: 'success' },
      { step: 2, name: '意图路由', agentId: 'yanqi-qianxing', durationMs: 190, confidence: 0.97, status: 'success' },
      { step: 3, name: 'RAG注入', agentId: 'yushu-wanwu', durationMs: 310, confidence: 0.94, status: 'success' },
      { step: 4, name: '分析预测', agentId: 'yujian-xianzhi', durationMs: 420, confidence: 0.92, status: 'success' },
      { step: 5, name: '报告润色', agentId: 'chuangxiang-lingyun', durationMs: 580, confidence: 0.95, status: 'success' },
      { step: 6, name: '全局决策', agentId: DEFAULT_AGENT_ID, durationMs: 220, confidence: 0.89, status: 'running' },
      { step: 7, name: '质量校验', agentId: 'gewu-zongshi', durationMs: 0, confidence: 0, status: 'pending' },
      { step: 8, name: '审计脱敏', agentId: 'zhiyun-shouhu', durationMs: 0, confidence: 0, status: 'pending' },
      { step: 9, name: '画像更新', agentId: 'zhiyu-bole', durationMs: 0, confidence: 0, status: 'pending' },
    ],
  },
  {
    id: 'TASK-20250415-084',
    type: '硬件渲染',
    projectId: 'sc-103',
    projectName: '赛博红娘 E03 全规格导出',
    submittedAt: '13:50:00',
    duration: '06m 12s',
    progress: 100,
    status: 'completed',
    driveMode: 'L0',
    confidence: 0.98,
    hasLearningSample: false,
    currentStep: 9,
    stepsTrace: [
      { step: 1, name: '安全过滤', agentId: 'zhiyun-shouhu', durationMs: 110, confidence: 1.0, status: 'success' },
      { step: 2, name: '意图路由', agentId: 'yanqi-qianxing', durationMs: 140, confidence: 0.98, status: 'success' },
      { step: 3, name: 'RAG注入', agentId: 'yushu-wanwu', durationMs: 220, confidence: 0.96, status: 'success' },
      { step: 4, name: '分析预测', agentId: 'yujian-xianzhi', durationMs: 380, confidence: 0.95, status: 'success' },
      { step: 5, name: '报告润色', agentId: 'chuangxiang-lingyun', durationMs: 440, confidence: 0.98, status: 'success' },
      { step: 6, name: '全局决策', agentId: DEFAULT_AGENT_ID, durationMs: 190, confidence: 0.99, status: 'success' },
      { step: 7, name: '质量校验', agentId: 'gewu-zongshi', durationMs: 310, confidence: 0.96, status: 'success' },
      { step: 8, name: '审计脱敏', agentId: 'zhiyun-shouhu', durationMs: 160, confidence: 0.99, status: 'success' },
      { step: 9, name: '画像更新', agentId: 'zhiyu-bole', durationMs: 180, confidence: 0.98, status: 'success' },
    ],
  },
];
