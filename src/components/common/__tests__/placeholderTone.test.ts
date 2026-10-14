/**
 * @file: placeholderTone.test.ts
 * @description: Thumb 离线占位纯函数测试 — 确定性色调派生与边界
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { describe, expect, it } from 'vitest';
import { placeholderTone } from '../Thumb';

describe('placeholderTone 确定性占位渐变', () => {
  it('同标签同色（确定性）', () => {
    expect(placeholderTone('SH-101')).toBe(placeholderTone('SH-101'));
  });

  it('不同标签色相不同（高概率）', () => {
    const tones = new Set(['SH-101', 'SH-102', 'SH-103', '小说A', '小说B'].map(placeholderTone));
    expect(tones.size).toBe(5);
  });

  it('输出为合法 CSS 渐变且包含 hsl 色相', () => {
    const tone = placeholderTone('剧本');
    expect(tone.startsWith('linear-gradient(135deg, hsl(')).toBe(true);
    expect(tone).toContain('%');
  });

  it('边界：空标签不崩溃', () => {
    expect(placeholderTone('')).toBe(placeholderTone(''));
  });
});
