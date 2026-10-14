/**
 * @file: publishing.ts
 * @description: 分发域类型：发布账号、发布矩阵
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export interface AccountItem {
  id: string;
  platform: 'douyin' | 'channels' | 'bilibili' | 'kuaishou' | 'xiaohongshu';
  platformName: string;
  accountName: string;
  followers: string;
  authStatus: 'valid' | 'expiring' | 'invalid';
  expireDays: number;
  successRate: number; // 0-100%
  predictOfflineRisk: number; // 0-100%
  group: '剧集合' | '测试矩阵' | '备用号';
  authType: 'API授权' | 'Cookie/RPA';
  encryptedCredentialToken: string; // 永不显示真实明文
}

export interface PublishMatrixRow {
  filmId: string;
  filmTitle: string;
  thumbnail: string;
  targets: Record<
    string,
    {
      status: 'unassigned' | 'transcoding' | 'queued' | 'published' | 'rejected';
      views?: number;
      comments?: number;
      shares?: number;
      rejectCode?: string;
      rejectReason?: string;
      suggestedFix?: string;
    }
  >;
  reflexStatus: 'ready' | 'synced' | 'pending';
}
