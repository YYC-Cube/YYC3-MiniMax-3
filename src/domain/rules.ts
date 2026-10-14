/**
 * @file: rules.ts
 * @description: 领域规则单源 — 业务阈值与分类判定的唯一事实源（UI 层禁止内联阈值）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

/**
 * SyncNet 唇形同步阈值（G3 音画合规门禁）
 * 与 tokens.GATE_LEVELS 中 G3 描述「SyncNet ≥ 0.75」保持一致。
 */
export const SYNCNET_PASS = 0.75;
/** 待定复核下界：0.60 – SYNCNET_PASS 进入 review 泳道 */
export const SYNCNET_REVIEW_MIN = 0.6;

export type SyncNetVerdict = 'passed' | 'review' | 'failed';

/**
 * 按 SyncNet 评分判定泳道归属：
 * - score ≥ 0.75        → passed（质检通过）
 * - 0.60 ≤ score < 0.75 → review（待定复核）
 * - score < 0.60        → failed（打回重生成）
 */
export function classifySyncNet(score: number): SyncNetVerdict {
  if (score >= SYNCNET_PASS) return 'passed';
  if (score >= SYNCNET_REVIEW_MIN) return 'review';
  return 'failed';
}

/** G2 资产一致性 Ref 卡达标分（与 GATE_LEVELS G2 描述「Ref 评分 ≥ 80%」一致，0-100 量纲） */
export const REF_CONSISTENCY_PASS = 80;

/** 置信度达标线（ReAct-C Step7 质量校验：<80 回环 Step5，0-100 量纲） */
export const QUALITY_CHECK_PASS = 80;
