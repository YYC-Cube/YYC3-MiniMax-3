/**
 * @file: ClockHands.tsx
 * @description: YYC³ 真实时钟三针共享渲染（纯 SVG <g>）：时针（青碧/短/粗）、
 *               分针（天青/中）、秒针（朱红/长/细 + 尾部配重 + 红圈轴点）。
 *               Agent 协同大屏与 A01/A02/A03 认证品牌时钟共用本组件，保证
 *               「不同长短、不同颜色」全链路一致；秒针朱红与 Agent 激光粉区隔。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { CLOCK_HAND_COLORS, type ClockAngles } from '../../hooks/useRealTimeClock';

export interface ClockHandLengths {
  hour: number;
  minute: number;
  second: number;
  tail: number;
}

interface ClockHandsProps {
  /** 三针角度（useRealTimeClock 产出，-90° 校正系：0°=3 点、-90°=12 点） */
  angles: ClockAngles;
  lengths: ClockHandLengths;
  /** 线宽/轴点整体缩放（跟随表盘自适应比例，默认 1） */
  scale?: number;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * 用法：置于已 translate 到表盘中心的 <g> 内；所有坐标以 (0,0) 为轴心。
 * 秒针为贯穿式（前端 second、反向 tail 配重），轴心双层圆点。
 */
export const ClockHands: React.FC<ClockHandsProps> = ({ angles, lengths, scale = 1 }) => {
  const hourRad = toRad(angles.hourAngle);
  const minuteRad = toRad(angles.minuteAngle);
  const secondRad = toRad(angles.secondAngle);

  return (
    <g>
      {/* 时针：最短最粗，品牌青碧 */}
      <line
        x1={0}
        y1={0}
        x2={Math.cos(hourRad) * lengths.hour}
        y2={Math.sin(hourRad) * lengths.hour}
        stroke={CLOCK_HAND_COLORS.hour}
        strokeOpacity={0.95}
        strokeWidth={Math.max(2, 4 * scale)}
        strokeLinecap="round"
      />
      {/* 分针：居中长度与粗细，天青蓝 */}
      <line
        x1={0}
        y1={0}
        x2={Math.cos(minuteRad) * lengths.minute}
        y2={Math.sin(minuteRad) * lengths.minute}
        stroke={CLOCK_HAND_COLORS.minute}
        strokeOpacity={0.9}
        strokeWidth={Math.max(1.5, 2.5 * scale)}
        strokeLinecap="round"
      />
      {/* 秒针：最长最细，朱红，尾部配重贯穿轴心 */}
      <line
        x1={-Math.cos(secondRad) * lengths.tail}
        y1={-Math.sin(secondRad) * lengths.tail}
        x2={Math.cos(secondRad) * lengths.second}
        y2={Math.sin(secondRad) * lengths.second}
        stroke={CLOCK_HAND_COLORS.second}
        strokeOpacity={0.95}
        strokeWidth={Math.max(1, 1.5 * scale)}
        strokeLinecap="round"
      />
      {/* 轴点：外圈朱红 + 内芯青碧 */}
      <circle cx={0} cy={0} r={Math.max(2.5, 5 * scale)} fill={CLOCK_HAND_COLORS.second} />
      <circle cx={0} cy={0} r={Math.max(1.2, 2.4 * scale)} fill={CLOCK_HAND_COLORS.hour} />
    </g>
  );
};

export default ClockHands;
