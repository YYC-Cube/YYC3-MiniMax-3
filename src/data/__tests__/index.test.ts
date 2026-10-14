/**
 * @file: index.test.ts
 * @description: 单元测试：data 域拆分后 Schema 完整性（经 barrel 再导出验证）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import { AGENTS_MAP } from '../../tokens';
import {
  MOCK_ACCOUNTS,
  MOCK_ASSETS,
  MOCK_BATCH_ITEMS,
  MOCK_COMMENTS,
  MOCK_LEARNING_SAMPLES,
  MOCK_MEMORIES,
  MOCK_PUBLISH_MATRIX,
  MOCK_SCRIPTS,
  MOCK_SHOTS,
  MOCK_TASKS,
  MOCK_TIMELINE_CLIPS,
} from '../index';

const GATE_IDS = ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'] as const;

describe('data barrel — 领域数据 Schema 完整性', () => {
  it('任务步迹契约：ReAct-C 步迹 agentId 全 ∈ 智能体目录（防数据-目录漂移）', () => {
    expect(MOCK_TASKS.length).toBeGreaterThan(0);
    MOCK_TASKS.forEach((task) => {
      task.stepsTrace.forEach((step) => {
        expect(AGENTS_MAP[step.agentId], `${task.id} step${step.step} agentId "${step.agentId}" 不在目录`).toBeTruthy();
      });
    });
  });

  it('剧本库：id 唯一，门禁等级与世界观完整度在合法区间', () => {
    expect(MOCK_SCRIPTS.length).toBeGreaterThan(0);
    expect(new Set(MOCK_SCRIPTS.map((s) => s.id)).size).toBe(MOCK_SCRIPTS.length);
    MOCK_SCRIPTS.forEach((s) => {
      expect(GATE_IDS).toContain(s.gateLevel);
      expect(s.loreCompleteness).toBeGreaterThanOrEqual(0);
      expect(s.loreCompleteness).toBeLessThanOrEqual(100);
      expect(s.synopsis.length).toBeGreaterThan(0);
    });
  });

  it('分镜库：置信度 ∈ [0,1]，一致性评分 ∈ [0,100]', () => {
    MOCK_SHOTS.forEach((shot) => {
      expect(shot.confidence).toBeGreaterThanOrEqual(0);
      expect(shot.confidence).toBeLessThanOrEqual(1);
      expect(shot.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(shot.consistencyScore).toBeLessThanOrEqual(100);
      expect(shot.shotNumber).toMatch(/^S\d{2}-\d{2}$/);
    });
  });

  it('资产库：Ref 卡一致性评分 ≥ 80（G2 门禁）', () => {
    MOCK_ASSETS.forEach((asset) => {
      expect(asset.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(asset.consistencyScore).toBeLessThanOrEqual(100);
      if (asset.refCard) {
        expect(asset.consistencyScore).toBeGreaterThanOrEqual(80);
      }
    });
  });

  it('批量生产：status=passed 的镜头 SyncNet ≥ 0.75（G3 音画合规门禁）', () => {
    MOCK_BATCH_ITEMS.forEach((item) => {
      if (item.status === 'passed') {
        expect(item.syncNetScore).toBeGreaterThanOrEqual(0.75);
      } else {
        // 未达标镜头不允许直接标记 passed
        expect(item.syncNetScore).toBeLessThan(0.75);
      }
    });
  });

  it('任务中心：ReAct-C 步迹恒为 9 步且编号连续', () => {
    MOCK_TASKS.forEach((task) => {
      expect(task.stepsTrace.map((s) => s.step)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(task.currentStep).toBeGreaterThanOrEqual(1);
      expect(task.currentStep).toBeLessThanOrEqual(9);
      expect(['L0', 'L1', 'L2']).toContain(task.driveMode);
    });
  });

  it('发布账号：凭据恒为加密令牌（永不显示明文红线）', () => {
    MOCK_ACCOUNTS.forEach((acc) => {
      expect(acc.encryptedCredentialToken).toMatch(/^enc_token_/);
      expect(['valid', 'expiring', 'invalid']).toContain(acc.authStatus);
      expect(acc.predictOfflineRisk).toBeGreaterThanOrEqual(0);
      expect(acc.predictOfflineRisk).toBeLessThanOrEqual(100);
    });
  });

  it('时间轴：轨位枚举合法且片段时长为正', () => {
    const TRACKS = ['V1', 'A1', 'A2', 'T1'] as const;
    MOCK_TIMELINE_CLIPS.forEach((clip) => {
      expect(TRACKS).toContain(clip.trackId);
      expect(clip.durationSec).toBeGreaterThan(0);
    });
  });

  it('发布矩阵：目标状态枚举合法', () => {
    const STATUSES = ['unassigned', 'transcoding', 'queued', 'published', 'rejected'] as const;
    MOCK_PUBLISH_MATRIX.forEach((row) => {
      Object.values(row.targets).forEach((t) => {
        expect(STATUSES).toContain(t.status);
      });
    });
  });

  it('认知域数据（学习样本/记忆/协同评论）非空且 id 唯一', () => {
    [
      MOCK_LEARNING_SAMPLES,
      MOCK_MEMORIES,
      MOCK_COMMENTS,
    ].forEach((collection) => {
      expect(collection.length).toBeGreaterThan(0);
      expect(new Set(collection.map((item) => item.id)).size).toBe(collection.length);
    });
  });
});
