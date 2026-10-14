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
import React from 'react';
import { AGENTS_LIST, DEFAULT_AGENT_ID } from '../../tokens';

interface AuthBrandClockProps {
  diameter?: number; // 360 for login, 300 for register
  variant?: 'running' | 'static';
  className?: string;
  activeAgentId?: string; // default to 'yushu-wanwu' matching the screenshot
}

export const AuthBrandClock: React.FC<AuthBrandClockProps> = ({
  diameter = 360,
  variant = 'running',
  className = '',
  activeAgentId = 'yushu-wanwu',
}) => {
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
  const centerHubSize = Math.round(96 * scale);
  const radius = (diameter / 2) - (nodeSize / 2) - 8;

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
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

      {/* 3. Center Hub: 96x96 (or scaled) YYC³ Logo with breathing neon pulse */}
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

      {/* 4. 8 Agent Nodes positioned around the circumference */}
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
};

export default AuthBrandClock;
