/**
 * @file: tokens.test.ts
 * @description: 单元测试：tokens.test
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import {
  AGENTS_LIST,
  AGENTS_MAP,
  AUTH_TOKENS,
  COGNITION_COLORS,
  COLOR_TOKENS,
  COUNSEL_ROLE_AGENT_IDS,
  DEFAULT_AGENT_ID,
  DOMAIN_COLORS,
  DRIVE_MODES,
  GATE_CURRENT_ID,
  GATE_LEVELS,
  PIPELINE_STAGES,
  REACT_C_STEPS,
  getConfidenceMeta
} from '../index';

describe('tokens/getConfidenceMeta — 置信度阶梯', () => {
  it('≥0.9 判定为高置信（PASS，直接采纳）', () => {
    expect(getConfidenceMeta(0.95).level).toBe('high');
    expect(getConfidenceMeta(0.95).tag).toBe('PASS');
  });

  it('0.9 边界值归属高置信（左闭区间）', () => {
    expect(getConfidenceMeta(0.9).level).toBe('high');
  });

  it('0.6–0.9 判定为中置信（REVIEW，人工复核）', () => {
    expect(getConfidenceMeta(0.75).level).toBe('mid');
    expect(getConfidenceMeta(0.75).tag).toBe('REVIEW');
    expect(getConfidenceMeta(0.6).level).toBe('mid');
  });

  it('<0.6 判定为低置信（INTERVENE，触发议事厅）', () => {
    expect(getConfidenceMeta(0.5).level).toBe('low');
    expect(getConfidenceMeta(0.5).tag).toBe('INTERVENE');
  });
});

describe('tokens/AGENTS_LIST — AI Family 8 成员视觉平等红线', () => {
  it('DEFAULT_AGENT_ID 单源：属于目录成员且为全局调度（防常量与目录漂移）', () => {
    expect(AGENTS_MAP[DEFAULT_AGENT_ID]?.role).toBe('全局调度');
  });

  it('GATE_CURRENT_ID 主检门禁锚点：∈ 门禁阶梯且为 G3（防高亮判定漂移）', () => {
    expect(GATE_LEVELS.map((g) => g.id)).toContain(GATE_CURRENT_ID);
    expect(GATE_CURRENT_ID).toBe('G3');
  });

  it('COUNSEL_ROLE_AGENT_IDS 议事三角：id ∈ 目录且 role 匹配（防角色锚定漂移）', () => {
    expect(AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.arbiter]?.role).toBe('全局调度');
    expect(AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.quality]?.role).toBe('质量校验');
    expect(AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.creator]?.role).toBe('创意生成');
  });

  it('成员数量恒为 8', () => {
    expect(AGENTS_LIST).toHaveLength(8);
  });

  it('成员 id 与专属色唯一', () => {
    const ids = AGENTS_LIST.map((a) => a.id);
    const colors = AGENTS_LIST.map((a) => a.color);
    expect(new Set(ids).size).toBe(8);
    expect(new Set(colors).size).toBe(8);
  });

  it('时钟环按 1.5h 间隔均匀分布（45° 步进）', () => {
    const degrees = AGENTS_LIST.map((a) => a.degree).sort((a, b) => a - b);
    expect(degrees).toEqual([0, 45, 90, 135, 180, 225, 270, 315]);
  });

  it('AGENTS_MAP 与 AGENTS_LIST 一一对应', () => {
    expect(Object.keys(AGENTS_MAP)).toHaveLength(8);
    AGENTS_LIST.forEach((agent) => {
      expect(AGENTS_MAP[agent.id]).toBe(agent);
    });
  });
});

describe('tokens/体系常量 — 领域模型完整性', () => {
  it('四大功能域色齐全（生产/剪辑/管理/推送）', () => {
    expect(Object.keys(DOMAIN_COLORS)).toEqual(['production', 'editing', 'management', 'publishing']);
    expect(DOMAIN_COLORS.production.color).toBe('#00e0b8');
  });

  it('三档驾驶模式 L0/L1/L2 齐备', () => {
    expect(Object.keys(DRIVE_MODES)).toEqual(['L0', 'L1', 'L2']);
  });

  it('六阶段流水线 S1-S6 连续编号且路由为 PageId 形态', () => {
    expect(PIPELINE_STAGES.map((s) => s.stage)).toEqual([1, 2, 3, 4, 5, 6]);
    PIPELINE_STAGES.forEach((s) => {
      // route 为裸 PageId（无斜杠前缀）；∈ PAGE_IDS 的注册表契约由 registry.test 护航（tokens 不得反向导入 registry）
      expect(s.route).toMatch(/^[a-z][a-z-]*$/);
      expect(s.agent.length).toBeGreaterThan(0);
    });
  });

  it('G0-G5 六级门禁连续', () => {
    expect(GATE_LEVELS.map((g) => g.id)).toEqual(['G0', 'G1', 'G2', 'G3', 'G4', 'G5']);
  });

  it('ReAct-C 九步闭环引擎 Step1-9 连续', () => {
    expect(REACT_C_STEPS.map((s) => s.step)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('认知语义色 7 项齐备', () => {
    expect(Object.keys(COGNITION_COLORS)).toEqual([
      'think',
      'confirm',
      'doubt',
      'reject',
      'learn',
      'memory',
      'degrade',
    ]);
  });

  it('基础令牌与 Auth 域令牌非空', () => {
    expect(COLOR_TOKENS.accent).toBe('#00e0b8');
    expect(AUTH_TOKENS.splitRatio).toBe('55 : 45');
  });
});
