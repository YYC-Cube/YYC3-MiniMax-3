/**
 * @file: W2CognitionWidget.tsx
 * @description: 组件：W2CognitionWidget
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
  CheckCircle2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { AGENTS_MAP, DEFAULT_AGENT_ID, DriveModeId, REACT_C_STEPS } from '../../tokens';
import AgentAvatar from '../common/AgentAvatar';
import ConfidenceBadge from '../common/ConfidenceBadge';

interface W2CognitionWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToW1: () => void;
  initialAgentId?: string;
  driveMode: DriveModeId;
}

export const W2CognitionWidget: React.FC<W2CognitionWidgetProps> = ({
  isOpen,
  onClose,
  onSwitchToW1,
  initialAgentId = DEFAULT_AGENT_ID,
  driveMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'0.5x' | '1x' | '2x'>('1x');
  const [activeStep, setActiveStep] = useState<number>(6);
  const [injectedPrompt, setInjectedPrompt] = useState('');
  const [humanIntervened, setHumanIntervened] = useState(false);

  if (!isOpen) return null;

  const currentStepInfo = REACT_C_STEPS[activeStep - 1] || REACT_C_STEPS[5];
  const stepAgent = AGENTS_MAP[currentStepInfo.agentId];

  const handleInject = () => {
    if (!injectedPrompt.trim()) return;
    setHumanIntervened(true);
    setInjectedPrompt('');
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-[580px] h-[720px] rounded-2xl bg-[#0a1628] border border-[rgba(0,224,184,0.35)] shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-200"
      style={{
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 224, 184, 0.2)',
      }}
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-[rgba(255,255,255,0.08)] bg-[#0f1e35] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(123,140,255,0.2)] border border-[#7B8CFF] flex items-center justify-center text-[#7B8CFF]">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e8f0f8] tracking-wide">
                W2 认知增强浮窗 · ReAct-C 轨迹复盘
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#152640] text-[#7B8CFF] border border-[rgba(123,140,255,0.3)]">
                DEEP TRACE
              </span>
            </div>
            <p className="text-[10px] text-[#8a97a8]">
              可见即可信 · 人机共驾 · 闭环回放与提示词注入
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToW1}
            className="p-1.5 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640] transition-colors cursor-pointer"
            title="切换为标准助理视图 (W1)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Split: Left 9-Step Flow, Right Metadata Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: ReAct-C Nine Steps Visualizer */}
        <div className="w-3/5 border-r border-[rgba(255,255,255,0.08)] flex flex-col bg-[#071222]/80">
          {/* Controls Bar */}
          <div className="p-2.5 bg-[#0f1e35]/80 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded bg-[#152640] hover:bg-[#1f3659] text-[#00e0b8] transition-colors cursor-pointer"
                title={isPlaying ? '暂停推理' : '继续推理'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="p-1.5 rounded bg-[#152640] hover:bg-[#1f3659] text-[#8a97a8] hover:text-white transition-colors cursor-pointer"
                title="重新回放"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center ml-1 bg-[#0a1628] rounded border border-[rgba(255,255,255,0.06)]">
                {(['0.5x', '1x', '2x'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 py-0.5 text-[10px] font-mono cursor-pointer ${speed === s ? 'text-[#00e0b8] font-bold bg-[#152640]' : 'text-[#8a97a8]'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#8a97a8]">
              Step <strong className="text-[#00e0b8]">{activeStep}</strong>/9
            </div>
          </div>

          {/* 9 Steps List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {REACT_C_STEPS.map((s) => {
              const agent = AGENTS_MAP[s.agentId];
              const isCurrent = activeStep === s.step;
              const isPast = activeStep > s.step;

              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isCurrent
                      ? 'bg-[#152640] border-[rgba(0,224,184,0.4)] shadow-md'
                      : isPast
                        ? 'bg-[#0a1628] border-[rgba(255,255,255,0.06)] opacity-80'
                        : 'bg-[#0a1628]/40 border-transparent opacity-40'
                    }`}
                  style={{
                    borderLeft: isCurrent
                      ? `3px solid ${agent?.color || '#00e0b8'}`
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#071222] text-[10px] font-bold text-[#8a97a8] font-mono flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                        {s.step}
                      </span>
                      <span className="text-xs font-bold text-[#e8f0f8]">{s.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-[#00e0b8] animate-ping" />
                      )}
                      <span className="text-[10px] font-mono" style={{ color: agent?.color }}>
                        {agent?.name}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8a97a8] pl-6 leading-tight truncate">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prompt Injection Bar (Human Intervention) */}
          <div className="p-2.5 bg-[#0f1e35] border-t border-[rgba(255,255,255,0.08)]">
            <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider block mb-1">
              人工指令热注入 (Human Injection)
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={injectedPrompt}
                onChange={(e) => setInjectedPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInject()}
                placeholder="在当前推理步骤注入干预约束..."
                className="flex-1 bg-[#0a1628] text-xs text-[#e8f0f8] px-2.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] focus:border-[#FFB020] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleInject}
                className="px-2.5 py-1.5 rounded-lg bg-[#FFB020] hover:bg-[#e09b18] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
              >
                注入
              </button>
            </div>
            {humanIntervened && (
              <span className="text-[10px] text-[#22C55E] mt-1 block">
                ✓ 已成功向 Step {activeStep} 注入干预，结果已收录至 Learning Inbox
              </span>
            )}
          </div>
        </div>

        {/* Right: Cognitive Inspector */}
        <div className="w-2/5 flex flex-col p-3.5 bg-[#0a1628] overflow-y-auto space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
              当前执行单元
            </span>
            <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] flex items-center gap-3">
              <AgentAvatar agentId={currentStepInfo.agentId} size="md" />
              <div>
                <h4 className="text-xs font-bold text-[#e8f0f8]">{stepAgent?.name}</h4>
                <p className="text-[11px] text-[#8a97a8]">{stepAgent?.role}</p>
                <span className="text-[10px] font-mono text-[#00e0b8]">
                  时钟位: {stepAgent?.clockPosition}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
              认知置信度分流
            </span>
            <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#8a97a8]">当前步得分:</span>
                <ConfidenceBadge confidence={0.92} size="sm" />
              </div>
              <div className="text-[11px] text-[#5c697a] leading-tight">
                阈值策略: ≥0.9 自动流转 / 0.6-0.9 需人工确认 / &lt;0.6 触发议事厅
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
              三层记忆回溯命中 (Memory)
            </span>
            <div className="p-2.5 rounded-lg bg-[#0f1e35] border border-[rgba(0,180,216,0.2)] text-[11px] space-y-1">
              <div className="flex items-center justify-between font-mono text-[#00B4D8]">
                <span>[Project Scope]</span>
                <span>Recalled 234次</span>
              </div>
              <p className="text-[#8a97a8] leading-tight">
                命中规则: “叶凌霄瞳孔在聚光下必须带有淡青色冰魄寒光”
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
              算力消耗与 Token
            </span>
            <div className="p-2.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] font-mono text-[11px] space-y-1 text-[#8a97a8]">
              <div className="flex justify-between">
                <span>Prompt Tokens:</span>
                <span className="text-[#e8f0f8]">1,420</span>
              </div>
              <div className="flex justify-between">
                <span>Completion:</span>
                <span className="text-[#e8f0f8]">384</span>
              </div>
              <div className="flex justify-between">
                <span>GPU 节点:</span>
                <span className="text-[#00e0b8]">yyc3-101 (vLLM)</span>
              </div>
              <div className="flex justify-between">
                <span>单步预估费用:</span>
                <span className="text-[#22C55E]">¥ 0.00032</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default W2CognitionWidget;
