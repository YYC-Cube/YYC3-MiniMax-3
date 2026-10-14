/**
 * @file: production.ts
 * @description: 生产域类型：剧本、分镜、资产、批量生产
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { GateLevel } from '../tokens';

export interface ScriptItem {
  id: string;
  title: string;
  genre: '都市' | '古风' | '悬疑' | '甜宠' | '科幻';
  wordCount: number;
  characterCount: number;
  sceneCount: number;
  loreCompleteness: number; // 0-100%
  stage: string;
  gateLevel: GateLevel;
  lastEdited: string;
  synopsis: string;
  characters: { name: string; avatar: string; roleDesc: string; refTrained: boolean }[];
  scenes: { name: string; type: string; lighting: string }[];
}

export interface StoryboardShot {
  id: string;
  shotNumber: string; // e.g., 'S01-01'
  shotSize: '特写' | '近景' | '中景' | '全景' | '远景';
  cameraMove: '推镜头' | '拉镜头' | '移镜头' | '跟镜头' | '俯仰' | '环绕';
  visualDesc: string;
  character: string;
  scene: string;
  dialogue: string;
  durationSec: number;
  prompt: string;
  negativePrompt: string;
  assetBinding: string;
  status: 'pending' | 'generating' | 'passed' | 'rejected';
  rejectReason?: string;
  consistencyScore: number; // 0-100%
  confidence: number; // 0-1.0
  thumbnailUrl: string;
  seed: number;
  motionStrength: number;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'character' | 'scene' | 'prop' | 'style' | 'template';
  tags: string[];
  version: string;
  usageCount: number;
  consistencyTrained: boolean;
  consistencyScore: number;
  previewUrl: string;
  refCard: boolean; // 是否一致性 Ref
  dualFormContract?: { mainForm: string; altForm: string };
  evolutionStage: '定妆照' | '角色板' | '多视图' | 'LoRA资产包';
  loraRank?: number;
  referenceImages: string[];
}

export interface BatchItem {
  shotId: string;
  shotNumber: string;
  thumbnail: string;
  syncNetScore: number; // ≥0.75 为达标
  duration: number; // seconds
  confidence: number;
  status: 'passed' | 'review' | 'failed';
  sampleFlagged: boolean;
  costEstimated: number; // in RMB
  renderTime: number; // in seconds
}
