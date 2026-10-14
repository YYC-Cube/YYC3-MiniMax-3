/**
 * YYC³ API 契约层 — 快照键位绑定契约（R12 专项）
 *
 * 配对正确性的唯一权威表：SNAPSHOT 条目 ↔ ENDPOINTS 成员逐一锁定，
 * 防跨域错配污染快照（如 taskService.list 误配 assets 键互相覆盖）。
 * @file: snapshot-bindings.test.ts
 * @description: YYC³ API 契约层 — 快照键位绑定契约
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { describe, expect, it } from 'vitest';
import { ENDPOINTS, SNAPSHOT } from '../services';

const BINDINGS = [
  ['scriptList', ENDPOINTS.scripts],
  ['shotList', ENDPOINTS.storyboards],
  ['assetList', ENDPOINTS.assets],
  ['batchItems', ENDPOINTS.batch],
  ['taskList', ENDPOINTS.tasks],
  ['timelineClips', ENDPOINTS.timeline],
  ['videoTemplates', ENDPOINTS.templates],
  ['accounts', ENDPOINTS.accounts],
  ['publishMatrix', ENDPOINTS.publishMatrix],
  ['learningSamples', ENDPOINTS.learningSamples],
  ['memories', ENDPOINTS.memories],
  ['comments', ENDPOINTS.comments],
] as const;

describe('api/SNAPSHOT — 快照键位绑定契约（R12）', () => {
  it('12 条目逐一绑定正确端点成员（防跨域错配污染快照）', () => {
    for (const [name, endpoint] of BINDINGS) {
      expect(SNAPSHOT[name].snapshotKey, `SNAPSHOT.${name} 应绑定 ${endpoint}`).toBe(endpoint);
    }
  });

  it('键集合 ≡ ENDPOINTS 值集合：无遗漏 / 无多余 / 无重复（防漂移）', () => {
    const bound = BINDINGS.map(([, endpoint]) => endpoint);
    expect(new Set(bound).size, '绑定表自身不得重复').toBe(bound.length);
    expect(new Set(bound)).toEqual(new Set(Object.values(ENDPOINTS)));
    expect(Object.keys(SNAPSHOT), 'SNAPSHOT 条目数应与绑定表一致').toHaveLength(BINDINGS.length);
  });
});
