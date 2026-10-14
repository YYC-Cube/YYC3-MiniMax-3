/**
 * @file: editing.ts
 * @description: 剪辑域类型：时间轴片段
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export interface TimelineClip {
  id: string;
  trackId: 'V1' | 'A1' | 'A2' | 'T1';
  name: string;
  startSec: number;
  durationSec: number;
  sourceWindowStart: number;
  sourceWindowEnd: number;
  color?: string;
  volume?: number;
  opacity?: number;
  transitionType?: 'none' | 'fade' | 'slide' | 'dissolve';
  transitionDuration?: number;
  subtitleText?: string;
  adMarker?: boolean;
}

export interface VideoTemplate {
  id: string;
  title: string;
  category: '整片模板' | '转场包' | '片头片尾';
  ratio: string;
  usedCount: number;
  recommended?: boolean;
  agentRecommend?: string;
  brandBadge?: boolean;
  preview: string;
}
