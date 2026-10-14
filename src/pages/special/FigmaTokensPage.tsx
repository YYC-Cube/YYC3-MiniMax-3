/**
 * @file: FigmaTokensPage.tsx
 * @description: 页面组件：FigmaTokensPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  Code,
  Layers,
  Sparkles,
  Eye,
  Sliders,
} from 'lucide-react';
import { PageId } from '../../types';
import {
  COLOR_TOKENS,
  DOMAIN_COLORS,
  AGENTS_LIST,
  COGNITION_COLORS,
  DRIVE_MODES,
} from '../../tokens';

interface FigmaTokensPageProps {
  onNavigate: (page: PageId) => void;
}

export const FigmaTokensPage: React.FC<FigmaTokensPageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTokens = () => {
    const payload = {
      theme: 'Dark Only (Industrial Precision)',
      colors: COLOR_TOKENS,
      domains: DOMAIN_COLORS,
      agents: AGENTS_LIST,
      cognition: COGNITION_COLORS,
      driveModes: DRIVE_MODES,
      spacing: [4, 8, 12, 16, 20, 24, 32],
      radii: { chip: 6, button: 8, input: 10, card: 10, panel: 12, modal: 16 },
      motion: { fast: '150ms ease-out', base: '200ms ease-out', slow: '250ms ease-out' },
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">
              🧭 Foundations & Variables 设计基座规范
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              Figma 变量全量映射
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            深色唯一主题 · 四域色红线 · 8 Agent 视觉平等 · 认知语义阶梯 · 间距与字号阶梯
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyTokens}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
        >
          {copied ? <Check className="w-4 h-4 text-[#0a1628]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '已复制 Tokens JSON' : '复制全量 Figma 变量 JSON'}</span>
        </button>
      </div>

      {/* 1. Four Domains Color Mapping (Global Consistency Red-Line) */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.2)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e0b8]" />
            <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
              四大功能域色彩映射（全局一致性红线）
            </h3>
          </div>
          <span className="text-[11px] text-[#ff4422] font-mono">
            * 仅允许顶边 3px 色条 / 16×16 圆角标 / 图表系列，禁止大面积铺色！
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.values(DOMAIN_COLORS).map((dom) => (
            <div
              key={dom.id}
              className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-1.5"
              style={{ borderTop: `3px solid ${dom.color}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e8f0f8]">{dom.name}</span>
                <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold text-[#0a1628]" style={{ backgroundColor: dom.color }}>
                  {dom.label.slice(0, 1)}
                </span>
              </div>
              <span className="text-xs font-mono font-bold block" style={{ color: dom.color }}>
                {dom.color}
              </span>
              <span className="text-[10px] text-[#8a97a8] block">{dom.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 8 Agent Equal Palettes */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
            AI Family 8 成员专属色（视觉平等红线）
          </h3>
          <span className="text-[11px] text-[#8a97a8] font-mono">
            头像尺寸一致、亮度一致，仅靠专属色区分角色
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AGENTS_LIST.map((ag) => (
            <div
              key={ag.id}
              className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-1.5"
              style={{ borderLeft: `3px solid ${ag.color}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e8f0f8]">{ag.name}</span>
                <span className="text-[10px] font-mono px-1 rounded bg-[#152640] text-[#8a97a8]">
                  {ag.clockPosition}
                </span>
              </div>
              <span className="text-xs font-mono font-bold block" style={{ color: ag.color }}>
                {ag.color}
              </span>
              <span className="text-[11px] text-[#8a97a8] block">{ag.role}</span>
              <p className="text-[10px] text-[#5c697a] truncate">{ag.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Cognitive Semantic Colors & Drive Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cognitive Colors */}
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
          <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
            认知语义色（叠加在四域色之上）
          </h3>
          <div className="space-y-1.5 text-xs font-mono">
            {Object.entries(COGNITION_COLORS).map(([key, val]) => (
              <div
                key={key}
                className="p-2 rounded bg-[#0a1628] flex items-center justify-between"
                style={{ borderLeft: `3px solid ${val}` }}
              >
                <span className="text-[#e8f0f8]">cognition-{key}</span>
                <span style={{ color: val }} className="font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drive Modes */}
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
          <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
            驾驶模式三档色 (Drive Modes)
          </h3>
          <div className="space-y-2 text-xs">
            {Object.values(DRIVE_MODES).map((dm) => (
              <div
                key={dm.id}
                className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-1"
                style={{ borderLeft: `3px solid ${dm.color}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#e8f0f8]">
                    {dm.id} {dm.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: dm.color }}>
                    {dm.color}
                  </span>
                </div>
                <p className="text-[11px] text-[#8a97a8]">{dm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Spacing, Radii & Typography Ladders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-2 text-xs">
          <span className="font-bold text-[#e8f0f8] block mb-2">间距阶梯 (Spacing)</span>
          <div className="space-y-1 font-mono text-[#8a97a8]">
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>space-xs: 4px</span>
              <span>space-sm: 8px</span>
            </div>
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>space-md: 12px</span>
              <span>space-base: 16px</span>
            </div>
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>space-lg: 20px</span>
              <span>space-xl: 24px / 32px</span>
            </div>
            <div className="p-1.5 bg-[#152640] rounded text-[#00e0b8] text-[10px]">
              认知检查器宽度: 360px · 折叠侧栏: 64px
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-2 text-xs">
          <span className="font-bold text-[#e8f0f8] block mb-2">圆角阶梯 (Radii)</span>
          <div className="space-y-1 font-mono text-[#8a97a8]">
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>chip: 6px</span>
              <span>button: 8px</span>
            </div>
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>input / card: 10px</span>
              <span>panel: 12px</span>
            </div>
            <div className="flex justify-between p-1 bg-[#0a1628] rounded">
              <span>modal / widget: 16px</span>
              <span>badge: 9999px</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-2 text-xs">
          <span className="font-bold text-[#e8f0f8] block mb-2">排版阶梯 (Typography)</span>
          <div className="space-y-1 text-[#8a97a8]">
            <div className="p-1 bg-[#0a1628] rounded flex justify-between font-mono">
              <span>display: 28-42 / 500</span>
              <span>page-title: 17 / 500</span>
            </div>
            <div className="p-1 bg-[#0a1628] rounded flex justify-between font-mono">
              <span>section: 14 / 500</span>
              <span>body: 14 / 400</span>
            </div>
            <div className="p-1 bg-[#0a1628] rounded flex justify-between font-mono">
              <span>caption: 12 / 400</span>
              <span>micro: 11 / 400</span>
            </div>
            <span className="text-[10px] text-[#00e0b8] block pt-1 font-mono">
              * tabular-nums 强制启用在数字与代码上
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaTokensPage;
