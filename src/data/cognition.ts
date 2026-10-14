/**
 * @file: cognition.ts
 * @description: 认知域演示数据：学习样本、记忆条目
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { LearningSample, MemoryEntry } from '../types';

export const MOCK_LEARNING_SAMPLES: LearningSample[] = [
  {
    id: 'learn-001',
    type: '角色一致性',
    sourceProject: '凌霄剑仙之都市重修',
    sourceShot: 'S01-04 苏清月特写打回',
    agentId: 'gewu-zongshi',
    agentName: '格物·宗师',
    timestamp: '今天 14:12',
    status: 'pending',
    confidenceBefore: 0.54,
    confidenceExpected: 0.92,
    recommendation: '入库 Few-shot',
    reviewNote: '议事厅仲裁通过：微调礼服光影对比并固化 LoRA Ref 锚点后重新生成，准确率显著提升',
  },
  {
    id: 'learn-002',
    type: '口型同步',
    sourceProject: '赛博红娘',
    sourceShot: 'S02-09 艾莉亚告白句',
    agentId: 'yushu-wanwu',
    agentName: '语枢·万物',
    timestamp: '昨天 17:40',
    status: 'approved',
    confidenceBefore: 0.68,
    confidenceExpected: 0.89,
    recommendation: '提升 Prompt 权重',
    reviewNote: '已人工核准入库，针对中英文混合词汇引入双唇闭合音素增强',
  },
  {
    id: 'learn-003',
    type: '分发时段最佳',
    sourceProject: '凌霄剑仙全网分发',
    sourceShot: 'E01-E04 运营数据回流',
    agentId: 'zhiyu-bole',
    agentName: '知遇·伯乐',
    timestamp: '前天 09:30',
    status: 'backtesting',
    confidenceBefore: 0.76,
    confidenceExpected: 0.95,
    recommendation: '提升 Prompt 权重',
    reviewNote: '回测显示：周四晚 20:15 抖音短剧专区曝光率比默认 19:00 高出 34.6%',
  },
];

export const MOCK_MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-g01',
    scope: 'global',
    category: '平台风控',
    content: '小红书漫剧封面不得出现纯暗黑无背景阴森特写，需叠加≥30%暖光环境色方可通过审核。',
    source: '合规中心风控规则库 v4.1',
    usageCount: 89,
    active: true,
    createdAt: '2025-03-01',
    lastRecalledAt: '12 分钟前',
    traceShots: ['S01-04', 'S02-01', 'S03-12'],
  },
  {
    id: 'mem-p01',
    scope: 'project',
    category: '角色设定',
    content: '叶凌霄无论在任何现代场景，其瞳孔在聚光下必须带有淡青色冰魄寒光，且右手食指佩戴一枚古拙墨玉戒。',
    source: '剧本工作台角色设定提取',
    usageCount: 234,
    active: true,
    createdAt: '2025-04-10',
    lastRecalledAt: '5 分钟前',
    traceShots: ['S01-01', 'S01-02', 'S01-03', 'S01-05'],
  },
  {
    id: 'mem-s01',
    scope: 'session',
    category: '渲染策略',
    content: '当前批次优先使用 DGX 节点 1 的 vLLM 实例，运动强度锁定 0.7 以保证衣物物理仿真稳定。',
    source: '元启·天枢全局调度编排',
    usageCount: 14,
    active: true,
    createdAt: '14:00',
    lastRecalledAt: '刚才',
    traceShots: ['S01-01', 'S01-05'],
  },
];
