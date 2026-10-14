/**
 * @file: publishing.ts
 * @description: 分发域演示数据：发布账号、发布矩阵
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { AccountItem, PublishMatrixRow } from '../types';

export const MOCK_ACCOUNTS: AccountItem[] = [
  { id: 'acc-dy01', platform: 'douyin', platformName: '抖音', accountName: 'YYC³ 凌霄漫剧剧场', followers: '128.4万', authStatus: 'valid', expireDays: 24, successRate: 99.2, predictOfflineRisk: 2, group: '剧集合', authType: 'API授权', encryptedCredentialToken: 'enc_token_••••••••9a3f' },
  { id: 'acc-ch01', platform: 'channels', platformName: '视频号', accountName: 'YYC影业官方漫剧', followers: '45.1万', authStatus: 'valid', expireDays: 18, successRate: 98.5, predictOfflineRisk: 4, group: '剧集合', authType: 'API授权', encryptedCredentialToken: 'enc_token_••••••••7c12' },
  { id: 'acc-bili01', platform: 'bilibili', platformName: 'B站', accountName: '创想漫剧AI工坊', followers: '89.6万', authStatus: 'valid', expireDays: 45, successRate: 99.8, predictOfflineRisk: 1, group: '剧集合', authType: 'API授权', encryptedCredentialToken: 'enc_token_••••••••33dd' },
  { id: 'acc-ks01', platform: 'kuaishou', platformName: '快手', accountName: '爆款漫剧放映厅', followers: '74.2万', authStatus: 'expiring', expireDays: 4, successRate: 94.0, predictOfflineRisk: 19, group: '测试矩阵', authType: 'Cookie/RPA', encryptedCredentialToken: 'enc_token_••••••••b210' },
  { id: 'acc-red01', platform: 'xiaohongshu', platformName: '小红书', accountName: '心动剧场剧评局', followers: '26.8万', authStatus: 'valid', expireDays: 31, successRate: 97.4, predictOfflineRisk: 5, group: '备用号', authType: 'Cookie/RPA', encryptedCredentialToken: 'enc_token_••••••••e455' },
];

export const MOCK_PUBLISH_MATRIX: PublishMatrixRow[] = [
  {
    filmId: 'film-101',
    filmTitle: '凌霄剑仙之都市重修 E01 龙归都市',
    thumbnail: '/demo/photo-1534528741775-53994a69daeb.jpg',
    targets: {
      douyin: { status: 'published', views: 894000, comments: 14200, shares: 32800 },
      channels: { status: 'published', views: 341000, comments: 4800, shares: 9200 },
      bilibili: { status: 'published', views: 512000, comments: 8900, shares: 14200 },
      kuaishou: { status: 'queued' },
      xiaohongshu: { status: 'rejected', rejectCode: 'R-403', rejectReason: '封面人物眼神过度冷酷，触发青少年友好保护过滤', suggestedFix: '更换为女主苏清月护夫正面镜头' },
    },
    reflexStatus: 'synced',
  },
  {
    filmId: 'film-102',
    filmTitle: '凌霄剑仙之都市重修 E02 冰魄初显',
    thumbnail: '/demo/photo-1519085360753-af0119f7cbe7.jpg',
    targets: {
      douyin: { status: 'queued' },
      channels: { status: 'queued' },
      bilibili: { status: 'transcoding' },
      kuaishou: { status: 'unassigned' },
      xiaohongshu: { status: 'unassigned' },
    },
    reflexStatus: 'pending',
  },
];
