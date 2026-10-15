/**
 * @file: AuthBrandClock.tsx
 * @description: 组件：AuthBrandClock
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Brain,
  Ear,
  Eye,
  Lightbulb,
  Network,
  Scale,
  Shield,
  Star,
} from 'lucide-react';
import React, { useRef } from 'react';
import { CLOCK_HUB_RATIO, getHandLengths, useElementSize, useRealTimeClock } from '../../hooks/useRealTimeClock';
import { AGENTS_LIST, DEFAULT_AGENT_ID } from '../../tokens';
import ClockHands from '../common/ClockHands';

interface AuthBrandClockProps {
  diameter?: number; // 360 for login, 300 for register
  variant?: 'running' | 'static';
  className?: string;
  activeAgentId?: string; // default to 'yushu-wanwu' matching the screenshot
  /** 流式模式：撑满父容器宽度并按实测宽度收缩直径（移动端单栏用；默认固定 diameter） */
  fluid?: boolean;
}

export const AuthBrandClock: React.FC<AuthBrandClockProps> = ({
  diameter: diameterProp = 360,
  variant = 'running',
  className = '',
  activeAgentId = 'yushu-wanwu',
  fluid = false,
}) => {
  // 真实时钟：1s 走时 + 三针角度 + 中心数字时间 + yy/mm/dd 星期（周末粉色）
  const { timeStr, angles, dateInfo } = useRealTimeClock();

  // fluid：按父容器实测宽度等比收缩（首帧/SSR 用 prop 直径，挂载后 ResizeObserver 校正）
  const fluidRef = useRef<HTMLDivElement>(null);
  const { width: fluidWidth } = useElementSize(fluidRef);
  const diameter = fluid && fluidWidth > 0
    ? Math.min(diameterProp, Math.floor(fluidWidth))
    : diameterProp;

  // Agent glyph icons matching the astronomical chronograph screenshot
  const glyphMap: Record<string, React.ReactNode> = {
    [DEFAULT_AGENT_ID]: <Network className="w-5 h-5" />,
    'zhiyun-shouhu': <Shield className="w-5 h-5" />,
    'gewu-zongshi': <Scale className="w-5 h-5" />,
    'chuangxiang-lingyun': <Lightbulb className="w-5 h-5" />,
    'yanqi-qianxing': <Ear className="w-5 h-5" />,
    'yushu-wanwu': <Brain className="w-5 h-5" />,
    'yujian-xianzhi': <Eye className="w-5 h-5" />,
    'zhiyu-bole': <Star className="w-5 h-5" />,
  };

  const scale = diameter / 360;
  const nodeSize = Math.round(48 * scale);
  // 枢纽同比例缩小（直径 = 表盘外径 × 0.21，与大屏/参考图一致）
  const centerHubSize = Math.round(diameter * CLOCK_HUB_RATIO);
  const radius = (diameter / 2) - (nodeSize / 2) - 8;
  // 三针长度统一走 ClockHands 规范（时 0.42 / 分 0.56 / 秒 0.68 + 配重）
  const { hour: hourLen, minute: minuteLen, second: secondLen, tail: secondTail } = getHandLengths(radius);

  const clockEl = (
    <div
      className="relative select-none flex items-center justify-center"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
    >
      {/* 1. Concentric Chronograph Rings and Radar Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer subtle boundary */}
        <div
          className="rounded-full border border-[rgba(0,224,184,0.12)]"
          style={{ width: `${diameter}px`, height: `${diameter}px` }}
        />

        {/* 60s slow rotating indicator ring with gradient arc */}
        <div
          className={`absolute rounded-full border border-[rgba(0,224,184,0.22)] ${variant === 'running' ? 'animate-clock-spin' : ''
            }`}
          style={{
            width: `${diameter - 24}px`,
            height: `${diameter - 24}px`,
            borderTopColor: '#00e0b8',
            borderRightColor: '#9d7cd8',
            borderBottomColor: 'rgba(0,224,184,0.08)',
            borderLeftColor: 'rgba(157,124,216,0.12)',
          }}
        />

        {/* Middle radar circle */}
        <div
          className="absolute rounded-full border border-[rgba(255,255,255,0.05)]"
          style={{ width: `${diameter * 0.68}px`, height: `${diameter * 0.68}px` }}
        />

        {/* Inner core boundary ring */}
        <div
          className="absolute rounded-full border border-[rgba(0,224,184,0.2)]"
          style={{ width: `${diameter * 0.38}px`, height: `${diameter * 0.38}px` }}
        />

        {/* Circular tick marks (12 major ticks + 24 minor ticks) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${diameter} ${diameter}`}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = ((angle - 90) * Math.PI) / 180;
            const isMajor = i % 3 === 0;
            const r1 = diameter / 2 - (isMajor ? 12 : 8);
            const r2 = diameter / 2 - 2;
            const x1 = diameter / 2 + Math.cos(rad) * r1;
            const y1 = diameter / 2 + Math.sin(rad) * r1;
            const x2 = diameter / 2 + Math.cos(rad) * r2;
            const y2 = diameter / 2 + Math.sin(rad) * r2;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'rgba(0,224,184,0.35)' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            );
          })}
        </svg>
      </div>

      {/* 2. Holographic Laser Connecting Lines from Center to 8 Nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        {AGENTS_LIST.map((ag) => {
          const rad = ((ag.degree - 90) * Math.PI) / 180;
          const cx = diameter / 2;
          const cy = diameter / 2;
          const targetX = cx + Math.cos(rad) * radius;
          const targetY = cy + Math.sin(rad) * radius;
          const isActive = ag.id === activeAgentId;

          return (
            <g key={ag.id}>
              <line
                x1={cx}
                y1={cy}
                x2={targetX}
                y2={targetY}
                stroke={isActive ? ag.color : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.85 : 0.25}
                strokeDasharray={isActive ? undefined : '3 3'}
              />
              {/* Animated particle flowing along active laser connection */}
              {isActive && variant === 'running' && (
                <circle
                  r="2.5"
                  fill="#ffffff"
                  className="animate-ping"
                  cx={cx + Math.cos(rad) * (radius * 0.6)}
                  cy={cy + Math.sin(rad) * (radius * 0.6)}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* 3. 真实时钟三针（时青碧/分天青/秒朱红；ClockHands 单源，随 diameter 自适应） */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        <g transform={`translate(${diameter / 2}, ${diameter / 2})`}>
          <ClockHands
            angles={angles}
            lengths={{ hour: hourLen, minute: minuteLen, second: secondLen, tail: secondTail }}
            scale={scale}
          />
        </g>
      </svg>

      {/* 4. Center Hub: YYC³ Logo（同比例缩小）带呼吸霓虹脉冲 */}
      <div
        className="relative z-20 rounded-full bg-[#071222] border-2 border-[rgba(0,224,184,0.4)] flex flex-col items-center justify-center shadow-2xl transition-all duration-300"
        style={{
          width: `${centerHubSize}px`,
          height: `${centerHubSize}px`,
          boxShadow: '0 0 24px rgba(0, 224, 184, 0.25), inset 0 0 16px rgba(0, 224, 184, 0.1)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <span
            className="font-black text-[#00e0b8] tracking-tighter"
            style={{ fontSize: `${Math.round(20 * scale)}px` }}
          >
            YYC³
          </span>
          <span
            className="text-[9px] font-mono text-[#8a97a8] uppercase tracking-wider"
            style={{ fontSize: `${Math.max(Math.round(9 * scale), 8)}px` }}
          >
            AI Family
          </span>
        </div>
      </div>

      {/* 中心数字时间 + yy/mm/dd 星期（位于枢纽正下方；周末粉色） */}
      <div
        className="absolute left-1/2 z-20 -translate-x-1/2 text-center pointer-events-none"
        style={{
          top: `calc(50% + ${centerHubSize / 2 + 8}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        <div
          className="font-mono tabular-nums"
          style={{
            fontSize: `${Math.max(11, Math.round(15 * scale))}px`,
            color: '#00e0b8',
            textShadow: '0 0 10px rgba(0,224,184,0.4)',
            letterSpacing: '1px',
          }}
        >
          {timeStr}
        </div>
        <div
          className="font-mono flex items-center justify-center gap-1"
          style={{ marginTop: '2px' }}
        >
          <span
            style={{
              fontSize: `${Math.max(9, Math.round(10 * scale))}px`,
              color: 'rgba(138,151,168,0.85)',
              letterSpacing: '0.5px',
            }}
          >
            {dateInfo.dateStr}
          </span>
          <span
            style={{
              fontSize: `${Math.max(9, Math.round(10 * scale))}px`,
              color: dateInfo.isWeekend ? '#FF006E' : 'rgba(138,151,168,0.85)',
              textShadow: dateInfo.isWeekend ? '0 0 6px rgba(255,0,110,0.4)' : 'none',
              letterSpacing: '0.5px',
            }}
          >
            {dateInfo.dayLabel}
          </span>
        </div>
      </div>

      {/* 5. 8 Agent Nodes positioned around the circumference */}
      {AGENTS_LIST.map((ag) => {
        const rad = ((ag.degree - 90) * Math.PI) / 180;
        const cx = diameter / 2;
        const cy = diameter / 2;
        const nodeX = cx + Math.cos(rad) * radius;
        const nodeY = cy + Math.sin(rad) * radius;
        const isActive = ag.id === activeAgentId;

        return (
          <div
            key={ag.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-auto group cursor-pointer"
            style={{
              left: `${nodeX}px`,
              top: `${nodeY}px`,
            }}
            title={`${ag.name} (${ag.role}) · ${ag.clockPosition}`}
          >
            {/* Circular Glyph Node */}
            <div
              className={`rounded-full flex items-center justify-center transition-all duration-200 relative ${isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              style={{
                width: `${nodeSize}px`,
                height: `${nodeSize}px`,
                backgroundColor: '#071222',
                border: `2px solid ${ag.color}`,
                boxShadow: isActive
                  ? `0 0 18px ${ag.color}80, inset 0 0 10px ${ag.color}40`
                  : `0 0 8px ${ag.color}30`,
                color: ag.color,
              }}
            >
              {glyphMap[ag.id] || <Brain className="w-4 h-4" />}

              {/* Status pulse dot */}
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full border border-[#071222]"
                style={{ backgroundColor: ag.color }}
              />
            </div>

            {/* Agent Name Tag & Time Marker */}
            <div className="mt-1 text-center leading-none pointer-events-none">
              <span
                className="text-[10px] font-medium text-[#e8f0f8] block whitespace-nowrap"
                style={{ fontSize: `${Math.max(Math.round(10 * scale), 9)}px` }}
              >
                {ag.name}
              </span>
              <span
                className="text-[9px] font-mono text-[#5c697a]"
                style={{ fontSize: `${Math.max(Math.round(8.5 * scale), 8)}px` }}
              >
                {ag.clockPosition}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // fluid：外层测量容器撑满父宽，时钟按实测宽度居中收缩；非 fluid 维持固定 px 直径
  if (fluid) {
    return (
      <div ref={fluidRef} className={`w-full flex justify-center ${className}`}>
        {clockEl}
      </div>
    );
  }

  return <div className={className}>{clockEl}</div>;
};

export default AuthBrandClock;
