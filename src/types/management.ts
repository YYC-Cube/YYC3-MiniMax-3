/**
 * @file: management.ts
 * @description: 管理协同域类型：协同评论
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { PageId } from './core';

export interface CollabComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  targetPage: PageId;
  targetAnchor: string; // e.g., 'S01-04' or '00:14.22'
  content: string;
  createdAt: string;
  status: 'pending' | 'resolved';
  resolvedBy?: string;
  replies: {
    author: string;
    content: string;
    createdAt: string;
  }[];
}
