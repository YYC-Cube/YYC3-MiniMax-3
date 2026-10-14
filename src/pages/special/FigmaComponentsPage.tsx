/**
 * @file: FigmaComponentsPage.tsx
 * @description: 页面组件：FigmaComponentsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Sparkles
} from 'lucide-react';
import React, { useState } from 'react';
import AgentAvatar from '../../components/common/AgentAvatar';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import DriveModeSwitch from '../../components/common/DriveModeSwitch';
import GateBadge from '../../components/common/GateBadge';
import MetricCard from '../../components/common/MetricCard';
import StatusDot from '../../components/common/StatusDot';
import { DEFAULT_AGENT_ID } from '../../tokens';
import { PageId } from '../../types';

interface FigmaComponentsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenCounsel: () => void;
}

export const FigmaComponentsPage: React.FC<FigmaComponentsPageProps> = ({
  onNavigate,
  onOpenCounsel,
}) => {
  const [testDriveMode, setTestDriveMode] = useState<'L0' | 'L1' | 'L2'>('L1');
  const [testBatchCount, setTestBatchCount] = useState<number>(3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">
              🧩 Figma Components 组件规格库 & 变体画廊
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              shadcn/ui 语义映射
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            原子 (Atoms) · 分子 (Molecules) · 有机体 (Organisms) · 认知专属组件 (Cognition Primitives)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCounsel}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[rgba(255,176,32,0.15)] text-[#FFB020] border border-[rgba(255,176,32,0.3)] font-bold text-xs cursor-pointer"
        >
          <span>唤起议事厅 (AgentCounselView)</span>
        </button>
      </div>

      {/* 1. Cognitive Exclusive Components */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.2)] space-y-4">
        <h3 className="text-xs font-bold text-[#00e0b8] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>认知增强与人机共驾专属组件 (Cognitive Primitives)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Agent Avatar Variants */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">AgentAvatar 视觉平等变体</span>
            <div className="flex flex-wrap items-center gap-3">
              <AgentAvatar agentId={DEFAULT_AGENT_ID} size="sm" status="online" />
              <AgentAvatar agentId="gewu-zongshi" size="md" status="thinking" />
              <AgentAvatar agentId="chuangxiang-lingyun" size="md" status="speaking" />
              <AgentAvatar agentId="zhiyu-bole" size="sm" status="learning" />
            </div>
            <span className="text-[10px] text-[#5c697a] block">
              尺寸统一、亮度统一、专属色环区分
            </span>
          </div>

          {/* Confidence Badge Variants */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">ConfidenceBadge 三档置信度</span>
            <div className="flex flex-wrap items-center gap-2">
              <ConfidenceBadge confidence={0.96} size="sm" />
              <ConfidenceBadge confidence={0.74} size="sm" />
              <ConfidenceBadge confidence={0.54} size="sm" />
            </div>
            <span className="text-[10px] text-[#5c697a] block">
              ≥0.9 PASS / 0.6-0.9 REVIEW / &lt;0.6 INTERVENE
            </span>
          </div>

          {/* Drive Mode Switcher */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">DriveModeSwitch 三档驾驶模式</span>
            <DriveModeSwitch currentMode={testDriveMode} onChange={setTestDriveMode} size="sm" />
            <span className="text-[10px] text-[#5c697a] block">
              L0 全自动 / L1 半自动 / L2 人工主导
            </span>
          </div>
        </div>
      </div>

      {/* 2. Atomic Components Showcase */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-4">
        <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
          原子组件规范 (Atoms: Buttons, Inputs, Gates, Badges)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gate Badges (G0 - G5) */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">GateBadge (G0–G5 门禁等级)</span>
            <div className="flex flex-wrap gap-1.5">
              <GateBadge level="G0" passed />
              <GateBadge level="G1" passed />
              <GateBadge level="G2" passed />
              <GateBadge level="G3" active />
              <GateBadge level="G4" />
              <GateBadge level="G5" />
            </div>
          </div>

          {/* Button Variants */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">Button 按钮体系</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold text-xs"
              >
                主按钮 (Primary)
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[#152640] text-[#e8f0f8] border border-[rgba(255,255,255,0.1)] text-xs"
              >
                次按钮 (Secondary)
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[rgba(255,68,34,0.15)] text-[#ff4422] border border-[rgba(255,68,34,0.3)] text-xs font-bold"
              >
                危险按钮 (Danger)
              </button>
            </div>
          </div>

          {/* Status Dots */}
          <div className="p-3.5 rounded-lg bg-[#0a1628] space-y-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">StatusDot 呼吸态势点</span>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <StatusDot color="#22C55E" />
                <span>在线运行</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusDot color="#FFB020" />
                <span>警告审核</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusDot color="#ff4422" />
                <span>拦截熔断</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MetricCard & BatchActionBar Molecules */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-4">
        <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
          分子与复杂交互 (Molecules: MetricCard & BatchActionBar)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="单集算力成本"
            value="¥ 0.0018"
            change="-84.2%"
            domain="production"
            subtext="青绿顶边 3px 规范"
          />
          <MetricCard
            label="视频导出帧率"
            value="60"
            unit="FPS"
            domain="editing"
            subtext="流程紫顶边 3px 规范"
          />
          <MetricCard
            label="全网分发矩阵"
            value="5"
            unit="平台"
            domain="publishing"
            subtext="珊瑚红顶边 3px 规范"
          />
        </div>
      </div>
    </div>
  );
};

export default FigmaComponentsPage;
