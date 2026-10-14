/**
 * @file: editing.ts
 * @description: 剪辑域演示数据：时间轴片段
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { TimelineClip, VideoTemplate } from '../types';

export const MOCK_TIMELINE_CLIPS: TimelineClip[] = [
  { id: 'v-01', trackId: 'V1', name: 'S01-01 叶凌霄酒会特写', startSec: 0, durationSec: 3.2, sourceWindowStart: 0, sourceWindowEnd: 3.2, color: '#00e0b8', transitionType: 'fade', transitionDuration: 0.3 },
  { id: 'v-02', trackId: 'V1', name: 'S01-02 陈浩天带手下逼近', startSec: 3.2, durationSec: 4.0, sourceWindowStart: 0, sourceWindowEnd: 4.0, color: '#00e0b8', transitionType: 'slide', transitionDuration: 0.4 },
  { id: 'v-03', trackId: 'V1', name: 'S01-03 冰魄凝聚剑气', startSec: 7.2, durationSec: 3.5, sourceWindowStart: 0, sourceWindowEnd: 3.5, color: '#00e0b8', transitionType: 'dissolve', transitionDuration: 0.5 },
  { id: 'v-04', trackId: 'V1', name: 'S01-04 苏清月赶来阻拦', startSec: 10.7, durationSec: 2.8, sourceWindowStart: 0, sourceWindowEnd: 2.8, color: '#00e0b8' },
  { id: 'v-05', trackId: 'V1', name: 'S01-05 剑气惊场全景震慑', startSec: 13.5, durationSec: 4.5, sourceWindowStart: 0, sourceWindowEnd: 4.5, color: '#00e0b8' },

  { id: 'a-01', trackId: 'A1', name: '独白：三百年了感应到灵枢', startSec: 0.4, durationSec: 2.5, sourceWindowStart: 0, sourceWindowEnd: 2.5, volume: 1.0 },
  { id: 'a-02', trackId: 'A1', name: '陈浩天对白：哟这不是苏家大能人', startSec: 3.5, durationSec: 3.2, sourceWindowStart: 0, sourceWindowEnd: 3.2, volume: 0.95 },
  { id: 'a-03', trackId: 'A1', name: '叶凌霄对白：蝼蚁之辈惊扰清修', startSec: 7.5, durationSec: 2.8, sourceWindowStart: 0, sourceWindowEnd: 2.8, volume: 1.0 },
  { id: 'a-04', trackId: 'A1', name: '苏清月对白：陈少这里是年会自重', startSec: 11.0, durationSec: 2.2, sourceWindowStart: 0, sourceWindowEnd: 2.2, volume: 0.9 },

  { id: 'bgm-01', trackId: 'A2', name: '玄幻史诗情绪BGM：暗潮涌动', startSec: 0, durationSec: 18.0, sourceWindowStart: 0, sourceWindowEnd: 18.0, volume: 0.35 },

  { id: 'sub-01', trackId: 'T1', name: '字幕01', startSec: 0.4, durationSec: 2.5, sourceWindowStart: 0, sourceWindowEnd: 2.5, subtitleText: '（内心独白）三百年了，这具肉躯终于感应到灵枢。' },
  { id: 'sub-02', trackId: 'T1', name: '字幕02', startSec: 3.5, durationSec: 3.2, sourceWindowStart: 0, sourceWindowEnd: 3.2, subtitleText: '陈浩天：“哟，这不是我们苏家的大能人吗？怎么躲在角落里？”' },
  { id: 'sub-03', trackId: 'T1', name: '字幕03', startSec: 7.5, durationSec: 2.8, sourceWindowStart: 0, sourceWindowEnd: 2.8, subtitleText: '叶凌霄：“蝼蚁之辈，也敢惊扰本座清修？”' },
  { id: 'sub-04', trackId: 'T1', name: '字幕04', startSec: 11.0, durationSec: 2.2, sourceWindowStart: 0, sourceWindowEnd: 2.2, subtitleText: '苏清月：“陈少，这里是苏家年会，请你自重！”' },
];

export const MOCK_VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'tpl-01',
    title: '都市打脸反转 · 黄金3秒节奏模板',
    category: '整片模板',
    ratio: '9:16',
    usedCount: 428,
    recommended: true,
    agentRecommend: '知遇·伯乐 推荐',
    preview: '/demo/photo-1534528741775-53994a69daeb.jpg',
  },
  {
    id: 'tpl-02',
    title: '玄幻破界重击 · 震屏转场特效包',
    category: '转场包',
    ratio: '16:9 / 9:16',
    usedCount: 312,
    preview: '/demo/photo-1519085360753-af0119f7cbe7.jpg',
  },
  {
    id: 'tpl-03',
    title: 'YYC³ 官方影视片头 (1.5s 快速出标)',
    category: '片头片尾',
    ratio: '通用',
    usedCount: 890,
    recommended: true,
    brandBadge: true,
    preview: '/demo/photo-1511578314322-379afb476865.jpg',
  },
];
