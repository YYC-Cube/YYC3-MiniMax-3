/**
 * @file: AgentCounselModal.tsx
 * @description: 组件：AgentCounselModal
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  CheckCircle2,
  Inbox,
  Scale,
  Shield,
  ThumbsDown,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { AGENTS_MAP, COUNSEL_ROLE_AGENT_IDS } from '../../tokens';
import AgentAvatar from '../common/AgentAvatar';
import ConfidenceBadge from '../common/ConfidenceBadge';

interface AgentCounselModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdoptArbitration: (toLearningInbox: boolean) => void;
  onHumanOverride: () => void;
}

export const AgentCounselModal: React.FC<AgentCounselModalProps> = ({
  isOpen,
  onClose,
  onAdoptArbitration,
  onHumanOverride,
}) => {
  const [saveToInbox, setSaveToInbox] = useState(true);

  if (!isOpen) return null;

  const agentA = AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.quality];
  const agentB = AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.creator];
  const arbiter = AGENTS_MAP[COUNSEL_ROLE_AGENT_IDS.arbiter];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-3xl rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.3)] shadow-2xl overflow-hidden animate-in zoom-in-95"
        style={{
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 224, 184, 0.2)',
        }}
      >
        {/* Header */}
        <div className="p-4 bg-[#152640] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[rgba(255,176,32,0.15)] text-[#FFB020] border border-[rgba(255,176,32,0.3)]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#e8f0f8]">
                  YYC³ 多 Agent 议事厅 (Agent Counsel)
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ff4422]/20 text-[#ff4422] border border-[#ff4422]/30">
                  冲突仲裁中
                </span>
              </div>
              <p className="text-xs text-[#8a97a8] mt-0.5">
                议题：分镜 S01-04 (苏清月特写) 一致性 vs 戏剧张力分歧 · 置信度差 &gt; 0.2
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#0f1e35] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflicting Arguments Side by Side */}
        <div className="p-5 grid grid-cols-2 gap-4 bg-[#0a1628]/60">
          {/* Agent A: 格物·宗师 */}
          <div
            className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.3)] relative"
            style={{ borderLeft: `3px solid ${agentA.color}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AgentAvatar agentId={agentA.id} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#e8f0f8]">{agentA.name}</h4>
                  <span className="text-[10px] text-[#8a97a8]">{agentA.role}</span>
                </div>
              </div>
              <ConfidenceBadge confidence={0.54} size="sm" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#ff4422] block">
                立场：坚决打回重生成 (Trigger Gate G3)
              </span>
              <p className="text-[#8a97a8] leading-relaxed text-[11px]">
                “面部特征向量与苏清月 RefCard 相似度仅为 64%，低于 80% 工业红线！眼神呈现软弱迷离，严重偏离‘霸道女总裁’人物核心设定。”
              </p>
            </div>
          </div>

          {/* Agent B: 创想·灵韵 */}
          <div
            className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.3)] relative"
            style={{ borderLeft: `3px solid ${agentB.color}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AgentAvatar agentId={agentB.id} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#e8f0f8]">{agentB.name}</h4>
                  <span className="text-[10px] text-[#8a97a8]">{agentB.role}</span>
                </div>
              </div>
              <ConfidenceBadge confidence={0.88} size="sm" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#00e0b8] block">
                立场：保留该动态镜头 (Creative Flow)
              </span>
              <p className="text-[#8a97a8] leading-relaxed text-[11px]">
                “此镜头处于快步上前阻拦陈浩天的剧烈运动帧，微表情变化属于紧急关头的情绪外溢，光影与氛围完全符合短剧黄金前3秒吸睛定律。”
              </p>
            </div>
          </div>
        </div>

        {/* Arbiter Recommendation (元启·天枢) */}
        <div className="px-5 py-4 bg-[#0f1e35] border-t border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-start gap-3">
            <AgentAvatar agentId={arbiter.id} size="md" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00e0b8]">
                    {arbiter.name} (全局编排仲裁建议)
                  </span>
                  <ConfidenceBadge confidence={0.92} size="sm" />
                </div>
                <span className="text-[10px] font-mono text-[#8a97a8]">ReAct-C Step 6</span>
              </div>
              <div className="p-3 rounded-xl bg-[#152640] border border-[rgba(0,224,184,0.2)] text-xs text-[#e8f0f8] leading-relaxed">
                “仲裁方案：采纳【约束性重绘】方案。在提示词中追加冷傲霸道总裁眼神特征词汇，将 LoRA Ref 权重从 0.65 动态提权至 0.82，重绘面部区域（耗时 12 秒），兼顾面部一致性与戏剧冲突。”
              </div>

              {/* Learning Inbox Checkbox */}
              <label className="flex items-center gap-2 mt-3 text-xs text-[#8a97a8] cursor-pointer hover:text-[#e8f0f8]">
                <input
                  type="checkbox"
                  checked={saveToInbox}
                  onChange={(e) => setSaveToInbox(e.target.checked)}
                  className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <Inbox className="w-3.5 h-3.5 text-[#B57BFF]" />
                  <span>仲裁采纳后自动归档至 Learning Inbox（沉淀为 Few-shot 教学样本）</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions (Human Veto Guarantee: 禁止强制采纳！) */}
        <div className="p-4 bg-[#0a1628] flex items-center justify-between">
          <span className="text-[11px] text-[#5c697a] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#00e0b8]" />
            红线保障：议事厅仲裁仅提供决策参考，最终处置权 100% 归属人类
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onHumanOverride}
              className="px-3 py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#ff7a45] border border-[rgba(255,122,69,0.3)] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>人工否决建议 (自定义)</span>
            </button>

            <button
              type="button"
              onClick={() => onAdoptArbitration(saveToInbox)}
              className="px-4 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-teal-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>采纳天枢仲裁方案 (立即执行)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCounselModal;
