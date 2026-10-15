/**
 * @file: ClockHubPage.tsx
 * @description: 页面组件：ClockHubPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Activity,
  AlertCircle,
  Bell,
  Brain,
  Clock,
  Compass,
  Ear,
  Eye,
  Globe,
  HelpCircle,
  Lightbulb,
  Menu,
  MoreHorizontal,
  Network,
  Radio,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Wrench,
  Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import ClockHands from '../../components/common/ClockHands';
import { CLOCK_HUB_RATIO, getHandLengths, useElementSize, useRealTimeClock } from '../../hooks/useRealTimeClock';
import { AGENTS_LIST, DEFAULT_AGENT_ID } from '../../tokens';
import { DevModeMeta, PageId } from '../../types';

interface ClockHubPageProps {
  onNavigate: (page: PageId) => void;
  onOpenCognitionWidget: (agentId: string) => void;
}

export const DEV_META_CLOCK_HUB: DevModeMeta = {
  apiEndpoint: '/api/v2/factory/ai-family/hub-telemetry',
  confidenceSource: '8 Agent 实时心跳健康度与 ReAct-C 协同事件流广播',
  memoryScope: 'global',
  learningSampleSource: '各 Agent 认知回环与少样本学习总体样本聚合池',
  driveModePolicy: '时钟环中枢支持全局任务拖拽分发与单 Agent 深度认知探针接入',
  stateSwitchConditions: {
    empty: '正常运行态，不可置空',
    loading: '8 Agent 实时神经网络权重心跳与全息流同步中',
    error: 'DGX 通讯网关断开，Agent 进入本地降级独立模式',
    forbidden: '仅内部指挥中心大屏模式开放全量拓扑',
  },
};

export const ClockHubPage: React.FC<ClockHubPageProps> = ({
  onNavigate,
  onOpenCognitionWidget,
}) => {
  // 真实时钟：1s 走时 + 三针角度 + yy/mm/dd 星期（复用 useRealTimeClock 单源）
  const { timeStr, angles, dateInfo } = useRealTimeClock();
  const [activeAgentId, setActiveAgentId] = useState<string>('yushu-wanwu'); // Matches screenshot (语枢·万物 highlighted)

  // ===== 表盘自适应：以表盘容器短边相对设计基线 620px 等比缩放（防宽屏拉伸） =====
  const dialRef = useRef<HTMLDivElement>(null);
  const { width: dialW, height: dialH } = useElementSize(dialRef);
  const scale = Math.min(1.15, Math.max(0.55, (dialW > 0 ? Math.min(dialW, dialH) : 620) / 620));
  const RING_OUTER = 270 * scale;          // 外环半径（540 直径）
  const ORBIT = 220 * scale;               // 8 节点轨道半径 / 激光线长度
  // 中心枢纽直径 = 表盘直径 × 0.21（与 AuthBrandClock 同比例，视觉让位于三针）
  const HUB = RING_OUTER * 2 * CLOCK_HUB_RATIO;
  const TICK_LEN_MAJOR = 14 * scale;
  const TICK_LEN_MINOR = 8 * scale;
  /** 三针真实长度（时 0.42r / 分 0.56r / 秒 0.68r + 尾部配重 0.16r） */
  const handLengths = getHandLengths(ORBIT);
  const NODE = 56 * scale;

  const glyphMap: Record<string, React.ReactNode> = {
    [DEFAULT_AGENT_ID]: <Network className="w-6 h-6" />,
    'zhiyun-shouhu': <Shield className="w-6 h-6" />,
    'gewu-zongshi': <Scale className="w-6 h-6" />,
    'chuangxiang-lingyun': <Lightbulb className="w-6 h-6" />,
    'yanqi-qianxing': <Ear className="w-6 h-6" />,
    'yushu-wanwu': <Brain className="w-6 h-6" />,
    'yujian-xianzhi': <Eye className="w-6 h-6" />,
    'zhiyu-bole': <Star className="w-6 h-6" />,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 select-none pb-4">
      {/* 1. Header Bar matching screenshot（<lg 隐藏：全局 TopNav 已承载汉堡/搜索/通知/语言，避免重复占高） */}
      <div className="hidden lg:flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0a1628]/95 border border-[rgba(0,224,184,0.15)] text-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Menu className="w-4 h-4 text-[#8a97a8] cursor-pointer hover:text-white" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#152640] border border-[rgba(0,224,184,0.3)] flex items-center justify-center font-bold text-[#00e0b8] text-[10px]">
              YYC³
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.25)]">
              GHOST
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#071222] border border-[rgba(255,255,255,0.06)] text-[11px] text-[#5c697a] w-56">
            <Search className="w-3.5 h-3.5" />
            <span>搜索页面、功能...</span>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#152640] border border-[rgba(0,224,184,0.3)] text-[#00e0b8] cursor-pointer hover:bg-[#1f3659]"
          >
            <Zap className="w-3.5 h-3.5 text-[#00e0b8]" />
            <span className="hidden sm:inline">模拟模式</span>
          </button>

          <div className="relative cursor-pointer p-1.5 text-[#8a97a8] hover:text-white">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#ff4422] text-[9px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </div>

          <div className="w-6 h-6 rounded-full bg-[#00B4D8] text-[#0a1628] font-bold flex items-center justify-center text-[10px]">
            GH
          </div>

          <Globe className="w-4 h-4 text-[#8a97a8] cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* 2. Top Title & Telemetry Metrics Pill */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-2">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00e0b8]" />
            <h1 className="text-xl font-bold text-[#e8f0f8] tracking-tight">AI Family</h1>
          </div>
          <p className="text-xs text-[#8a97a8] mt-0.5">八魂归一，云枢乃成</p>
        </div>

        {/* Top Right Metrics matching screenshot */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)]">
            <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
            <div>
              <span className="text-[10px] text-[#5c697a] block">在线</span>
              <span className="font-bold text-[#22C55E]">7/8</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)]">
            <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
            <div>
              <span className="text-[10px] text-[#5c697a] block">活跃任务</span>
              <span className="font-bold text-[#FFD700]">142</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)]">
            <Clock className="w-3.5 h-3.5 text-[#00B4D8]" />
            <div>
              <span className="text-[10px] text-[#5c697a] block">运行时间</span>
              <span className="font-bold text-[#00B4D8]">99.97%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Center Astronomical Chronograph Radar Dial (Height 620px) */}
      <div
        ref={dialRef}
        className="relative rounded-2xl bg-[#071222] border border-[rgba(0,224,184,0.2)] h-[62svh] lg:h-[620px] overflow-hidden flex items-center justify-center shadow-2xl"
      >
        {/* Astronomical Concentric Rings & Crosshair Markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer Ring */}
          <div className="rounded-full border border-[rgba(0,224,184,0.12)]" style={{ width: RING_OUTER * 2, height: RING_OUTER * 2 }} />
          {/* Rotating Ring with Dual Accent Highlights */}
          <div
            className="absolute rounded-full border border-[rgba(0,224,184,0.25)] animate-clock-spin"
            style={{ width: 500 * scale, height: 500 * scale, borderTopColor: '#00e0b8', borderRightColor: '#FF69B4' }}
          />
          {/* Mid Radar Dial */}
          <div className="absolute rounded-full border border-[rgba(255,255,255,0.05)]" style={{ width: 380 * scale, height: 380 * scale }} />
          {/* Inner Core Dial */}
          <div className="absolute rounded-full border border-[rgba(0,224,184,0.18)]" style={{ width: 200 * scale, height: 200 * scale }} />

          {/* Crosshair Axis Lines */}
          <div className="w-full h-px bg-[rgba(255,255,255,0.03)] absolute" />
          <div className="h-full w-px bg-[rgba(255,255,255,0.03)] absolute" />

          {/* Radar Tick Marks (24 ticks, 随短边缩放) */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = ((angle - 90) * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const r1 = RING_OUTER - (isMajor ? TICK_LEN_MAJOR : TICK_LEN_MINOR);
              const r2 = RING_OUTER;
              return (
                <line
                  key={i}
                  x1={`calc(50% + ${Math.cos(rad) * r1}px)`}
                  y1={`calc(50% + ${Math.sin(rad) * r1}px)`}
                  x2={`calc(50% + ${Math.cos(rad) * r2}px)`}
                  y2={`calc(50% + ${Math.sin(rad) * r2}px)`}
                  stroke={isMajor ? '#00e0b8' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isMajor ? 1.5 : 1}
                  opacity={isMajor ? 0.7 : 0.3}
                />
              );
            })}
          </svg>
        </div>

        {/* 真实时钟三针（时青碧短粗 / 分天青中 / 秒朱红长细带配重；ClockHands 单源） */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width={RING_OUTER * 2}
          height={RING_OUTER * 2}
          viewBox={`0 0 ${RING_OUTER * 2} ${RING_OUTER * 2}`}
        >
          <g transform={`translate(${RING_OUTER}, ${RING_OUTER})`}>
            <ClockHands angles={angles} lengths={handLengths} scale={scale} />
          </g>
        </svg>

        {/* Laser Connecting Lines (SVG) matching the reference screenshot */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {AGENTS_LIST.map((ag) => {
            const rad = ((ag.degree - 90) * Math.PI) / 180;
            const isHighlighted = ag.id === activeAgentId; // 语枢·万物 is highlighted with laser in screenshot!

            return (
              <g key={ag.id}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${Math.cos(rad) * ORBIT}px)`}
                  y2={`calc(50% + ${Math.sin(rad) * ORBIT}px)`}
                  stroke={isHighlighted ? ag.color : 'rgba(0, 224, 184, 0.2)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeDasharray={isHighlighted ? undefined : '4 4'}
                  opacity={isHighlighted ? 1 : 0.35}
                />
                {isHighlighted && (
                  <circle
                    r="3"
                    fill="#FF69B4"
                    className="animate-ping"
                    cx={`calc(50% + ${Math.cos(rad) * ORBIT * 0.5}px)`}
                    cy={`calc(50% + ${Math.sin(rad) * ORBIT * 0.5}px)`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center YYC³ Core Hub & Realtime Tabular Clock */}
        <div
          className="relative z-20 rounded-full bg-[#071222] border-2 border-[rgba(0,224,184,0.4)] p-1 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 hover:scale-105"
          style={{
            width: HUB,
            height: HUB,
            boxShadow: '0 0 32px rgba(0, 224, 184, 0.3), inset 0 0 16px rgba(0, 224, 184, 0.1)',
          }}
          onClick={() => onNavigate('dashboard')}
          title="YYC³ 中枢内核"
        >
          <div className="flex flex-col items-center text-center">
            <span className="font-black text-[#00e0b8] tracking-tight" style={{ fontSize: 20 * scale }}>
              YYC³
            </span>
            <span className="font-mono text-[#8a97a8]" style={{ fontSize: Math.max(8, 10 * scale) }}>
              AI Family
            </span>
          </div>

          {/* Realtime Time & Date below center matching screenshot */}
          <div className="absolute -bottom-10 flex flex-col items-center pointer-events-none">
            <span className="text-sm font-bold font-mono text-[#00B4D8] tabular-nums tracking-wide">
              {timeStr}
            </span>
            <span className="text-[10px] font-mono flex items-center gap-1">
              <span className="text-[#5c697a]">{dateInfo.dateStr}</span>
              <span
                style={dateInfo.isWeekend
                  ? { color: '#FF006E', textShadow: '0 0 6px rgba(255,0,110,0.4)' }
                  : { color: '#5c697a' }}
              >
                {dateInfo.dayLabel}
              </span>
            </span>
          </div>
        </div>

        {/* 8 Agent Nodes positioned around the perimeter */}
        {AGENTS_LIST.map((ag) => {
          const rad = ((ag.degree - 90) * Math.PI) / 180;
          const isHighlighted = ag.id === activeAgentId;
          const glyphSize = Math.max(16, Math.round(24 * scale));

          return (
            <div
              key={ag.id}
              onClick={() => {
                setActiveAgentId(ag.id);
                onOpenCognitionWidget(ag.id);
              }}
              className="absolute z-20 flex flex-col items-center cursor-pointer group -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `calc(50% + ${Math.cos(rad) * ORBIT}px)`,
                top: `calc(50% + ${Math.sin(rad) * ORBIT}px)`,
              }}
              title={`${ag.name} (${ag.role}) · 点击打开认知增强轨迹`}
            >
              {/* Circular Glyph Node */}
              <div
                className={`rounded-full flex items-center justify-center transition-all duration-200 relative ${isHighlighted
                  ? 'ring-4 ring-[#FF69B4]/40 scale-110 shadow-2xl shadow-pink-900/50'
                  : 'group-hover:scale-105 shadow-md'
                  }`}
                style={{
                  width: NODE,
                  height: NODE,
                  backgroundColor: '#071222',
                  border: `2px solid ${ag.color}`,
                  color: ag.color,
                  boxShadow: `0 0 16px ${ag.color}35`,
                }}
              >
                {React.cloneElement((glyphMap[ag.id] || <Brain className="w-5 h-5" />) as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
                  style: { width: glyphSize, height: glyphSize },
                })}

                {/* Status Dot */}
                <span
                  className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-[#071222]"
                  style={{ backgroundColor: ag.color }}
                />
              </div>

              {/* Agent Name Tag & Time Marker */}
              <div className="mt-1.5 text-center leading-tight">
                <span
                  className="font-bold text-[#e8f0f8] block group-hover:text-[#00e0b8] transition-colors whitespace-nowrap"
                  style={{ fontSize: 12 * scale }}
                >
                  {ag.name}
                </span>
                <span className="text-[10px] font-mono text-[#5c697a]" style={{ fontSize: 10 * scale }}>
                  {ag.clockPosition}
                </span>
              </div>
            </div>
          );
        })}

        {/* Bottom Floating Badge matching screenshot（<lg 隐藏：避让底栏/W1 浮窗球，dashboard 由底栏生产 Tab 承载） */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="hidden lg:flex absolute bottom-5 right-6 z-30 items-center gap-2 cursor-pointer group"
          title="YYC³ 核心安全防护浮动徽章"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00e0b8] to-[#9d7cd8] p-0.5 shadow-xl group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a1628] rounded-[14px] flex items-center justify-center text-[#00e0b8]">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#152640] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8a97a8] hover:text-white">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. Bottom Operational Navigation Tabs matching screenshot footer（<lg 隐藏：全局 MobileBottomNav 已承载等效入口） */}
      <div className="hidden lg:flex items-center justify-center gap-12 py-3 px-6 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-xs text-[#8a97a8]">
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          className="flex flex-col items-center gap-1 hover:text-[#00e0b8] transition-colors cursor-pointer"
        >
          <Activity className="w-4 h-4 text-[#00e0b8]" />
          <span>监控</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('qa')}
          className="flex flex-col items-center gap-1 hover:text-[#FFB020] transition-colors cursor-pointer"
        >
          <AlertCircle className="w-4 h-4 text-[#FFB020]" />
          <span>跟进</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('storyboard')}
          className="flex flex-col items-center gap-1 hover:text-[#00B4D8] transition-colors cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-[#00B4D8]" />
          <span>操作</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('admin-compliance')}
          className="flex flex-col items-center gap-1 hover:text-[#9d7cd8] transition-colors cursor-pointer"
        >
          <Radio className="w-4 h-4 text-[#9d7cd8]" />
          <span>巡查</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('project')}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4 text-[#5c697a]" />
          <span>更多</span>
        </button>
      </div>
    </div>
  );
};

export default ClockHubPage;
