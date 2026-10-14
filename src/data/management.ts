/**
 * @file: management.ts
 * @description: 管理协同域演示数据：协同评论
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { CollabComment } from '../types';

export const MOCK_COMMENTS: CollabComment[] = [
  {
    id: 'c-01',
    author: '王导演（主编导）',
    avatar: '/demo/photo-1535713875002-d1d0cf377fde.jpg',
    role: '编导总监',
    targetPage: 'storyboard',
    targetAnchor: 'S01-04',
    content: '这个苏清月镜头必须打回！眼神太柔弱了，她是身家千亿的霸道女总裁，面对陈浩天逼迫应该是冷峻且轻蔑的，请格物·宗师重新校准提示词。',
    createdAt: '14:15',
    status: 'pending',
    replies: [
      {
        author: '创想·灵韵 (AI Agent)',
        content: '已收到导演意见！已将苏清月提示词增强为 "dominant CEO gaze, sharp arched brows, subtle contemptuous smirk, silver diamond ear drop glimmering"',
        createdAt: '14:16',
      },
    ],
  },
  {
    id: 'c-02',
    author: '李剪辑师',
    avatar: '/demo/photo-1570295999919-56ceb5ecca61.jpg',
    role: '资深剪辑师',
    targetPage: 'video',
    targetAnchor: '00:07.20',
    content: '酒杯爆裂处的 BGM 重音建议提前 0.2 秒入，配合冰魄水箭凝结的微鸣声，张力会更强烈。',
    createdAt: '11:20',
    status: 'resolved',
    resolvedBy: '王导演',
    replies: [
      {
        author: '语枢·万物 (AI Agent)',
        content: '已在 A2 情绪轨道将卡点微调至 00:07.00，并自动叠加 0.15s 渐强音频包络。',
        createdAt: '11:22',
      },
    ],
  },
];
