/**
 * @file: ClockHands.test.tsx
 * @description: ClockHands 三针渲染契约 — 时/分/秒异色异长、秒针尾部配重、双层轴点；
 *               锁定「所有时钟页三针真实可辨」需求，防止回退为同色针。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CLOCK_HAND_COLORS, getClockAngles, getHandLengths } from "../../../hooks/useRealTimeClock";
import ClockHands from "../ClockHands";

describe("components/common/ClockHands 真实三针契约", () => {
  // 10:10:35 → 时/分/秒角度互不相同（-90° 校正系）
  const angles = getClockAngles(new Date(2026, 9, 15, 10, 10, 35));
  const lengths = getHandLengths(100);
  const html = renderToStaticMarkup(<ClockHands angles={angles} lengths={lengths} scale={1} />);

  it("三针使用三种互不相同的品牌色（时青碧/分天青/秒朱红）", () => {
    const colors = [CLOCK_HAND_COLORS.hour, CLOCK_HAND_COLORS.minute, CLOCK_HAND_COLORS.second];
    expect(new Set(colors).size).toBe(3);
    expect(html).toContain(CLOCK_HAND_COLORS.hour);
    expect(html).toContain(CLOCK_HAND_COLORS.minute);
    expect(html).toContain(CLOCK_HAND_COLORS.second);
    // 秒针为朱红系（#ff 开头），与激光粉明确区隔
    expect(CLOCK_HAND_COLORS.second.toLowerCase().startsWith("#ff")).toBe(true);
    expect(CLOCK_HAND_COLORS.second.toLowerCase()).not.toBe("#ff69b4");
  });

  it("三针长度严格递增 时 < 分 < 秒，且秒针带尾部配重", () => {
    expect(lengths.hour).toBeLessThan(lengths.minute);
    expect(lengths.minute).toBeLessThan(lengths.second);
    expect(lengths.tail).toBeGreaterThan(0);
    // 3 条 <line>：时、分、秒（秒针单条贯穿，x1=反向配重端 x2=针尖）
    expect(html.match(/<line/g)?.length).toBe(3);
  });

  it("轴心渲染双层圆点（外圈朱红 + 内芯青碧）", () => {
    expect(html.match(/<circle/g)?.length).toBe(2);
  });
});
