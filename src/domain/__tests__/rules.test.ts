/**
 * @file: rules.test.ts
 * @description: 领域规则单源测试 — SyncNet 泳道分类边界与常量一致性
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import { GATE_LEVELS } from '../../tokens';
import {
  QUALITY_CHECK_PASS,
  REF_CONSISTENCY_PASS,
  SYNCNET_PASS,
  SYNCNET_REVIEW_MIN,
  classifySyncNet,
} from '../rules';

describe('classifySyncNet 泳道分类（G3 音画合规门禁）', () => {
  it('score ≥ 0.75 → passed（含边界值）', () => {
    expect(classifySyncNet(0.75)).toBe('passed');
    expect(classifySyncNet(0.81)).toBe('passed');
    expect(classifySyncNet(1)).toBe('passed');
  });

  it('0.60 ≤ score < 0.75 → review（含双边界）', () => {
    expect(classifySyncNet(0.6)).toBe('review');
    expect(classifySyncNet(0.72)).toBe('review');
    expect(classifySyncNet(0.749)).toBe('review');
  });

  it('score < 0.60 → failed（含边界值）', () => {
    expect(classifySyncNet(0.59)).toBe('failed');
    expect(classifySyncNet(0)).toBe('failed');
  });

  it('常量与 GATE_LEVELS G3 描述文本一致（防双源漂移）', () => {
    const g3 = GATE_LEVELS.find((g) => g.id === 'G3');
    expect(g3).toBeDefined();
    expect(g3?.threshold).toContain(`SyncNet ≥ ${SYNCNET_PASS}`);
  });

  it('常量自洽：复核下界 < 达标线', () => {
    expect(SYNCNET_REVIEW_MIN).toBeLessThan(SYNCNET_PASS);
    expect(REF_CONSISTENCY_PASS).toBe(80);
    expect(QUALITY_CHECK_PASS).toBe(80);
  });
});
