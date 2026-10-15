/**
 * @file: W1AIFamilyWidget.tsx
 * @description: 组件：W1AIFamilyWidget
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Maximize2,
  Paperclip,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { APP_SHORT_NAME } from '../../config/brand';
import { AGENTS_LIST, AGENTS_MAP, COUNSEL_ROLE_AGENT_IDS, DEFAULT_AGENT_ID } from '../../tokens';
import { PageId } from '../../types';
import AgentAvatar from '../common/AgentAvatar';
import BrandMark from '../common/BrandMark';
import ConfidenceBadge from '../common/ConfidenceBadge';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentId?: string;
  text: string;
  type?: 'normal' | 'proactive' | 'decision' | 'counsel';
  confidence?: number;
  referenceCard?: {
    type: 'shot' | 'task' | 'asset';
    id: string;
    title: string;
    page: PageId;
  };
  timestamp: string;
}

interface W1AIFamilyWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenCognitionWidget: (agentId: string) => void;
  onOpenCounsel: () => void;
  onNavigate: (page: PageId) => void;
}

export const W1AIFamilyWidget: React.FC<W1AIFamilyWidgetProps> = ({
  isOpen,
  onToggle,
  onOpenCognitionWidget,
  onOpenCounsel,
  onNavigate,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(DEFAULT_AGENT_ID);
  const [inputText, setInputText] = useState('');
  const [proactiveDismissed, setProactiveDismissed] = useState(false);
  const [isProactiveExpanded, setIsProactiveExpanded] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      agentId: DEFAULT_AGENT_ID,
      text: '您好！我是全局编排总调度「元启·天枢」。当前剧目《凌霄剑仙》已完成分镜编排，第三阶段批量生成正在 DGX 节点运行中，当前置信度 0.89。',
      type: 'normal',
      confidence: 0.94,
      timestamp: '14:20',
    },
    {
      id: 'm2',
      sender: 'agent',
      agentId: COUNSEL_ROLE_AGENT_IDS.quality,
      text: '【质检拦截预警】镜头 S01-04 (苏清月特写) 一致性得分仅 64%（置信度 0.54），低于 80% 工业红线！是否需要立即发起多 Agent 议事厅仲裁？',
      type: 'decision',
      confidence: 0.54,
      referenceCard: {
        type: 'shot',
        id: 'shot-04',
        title: 'S01-04 苏清月特写',
        page: 'storyboard',
      },
      timestamp: '14:22',
    },
  ]);

  const activeAgent = AGENTS_MAP[selectedAgentId] || AGENTS_MAP[DEFAULT_AGENT_ID];

  const quickChips = [
    { label: '查看质检', action: () => onNavigate('qa') },
    { label: '发起协商', action: onOpenCounsel },
    { label: '继续生产', action: () => onNavigate('production') },
    { label: '成本报告', action: () => onNavigate('cost') },
    { label: '查看记忆', action: () => onNavigate('admin-agents') },
  ];

  /** 消息时间戳单点格式 HH:mm（R13：收敛组件内重复表达式） */
  const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: nowTime(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate Agent response
    setTimeout(() => {
      const resp: Message = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        agentId: selectedAgentId,
        text: `已收到您的指令，${activeAgent.name} 正在基于 ReAct-C 九步机制对当前任务进行处理分析。`,
        type: 'normal',
        confidence: 0.96,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, resp]);
    }, 600);
  };

  if (!isOpen) {
    // Collapsed 56x56 Floating Orb
    return (
      <button
        type="button"
        onClick={onToggle}
        className="hidden lg:flex fixed bottom-24 lg:bottom-6 right-4 lg:right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f1e35] via-[#152640] to-[#0a1628] border-2 border-[#00e0b8] shadow-2xl items-center justify-center cursor-pointer group z-50 hover:scale-105 transition-all duration-200"
        style={{
          boxShadow: '0 0 20px rgba(0, 224, 184, 0.35)',
        }}
        title="展开 AI Family 全局助手浮窗"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#00e0b8] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#ff4422] text-[10px] font-bold text-white flex items-center justify-center font-mono">
            1
          </span>
        </div>
      </button>
    );
  }

  // Expanded：<lg 全屏抽屉（含刘海/手势条安全区）；lg 起恢复右下角 400x600 浮窗
  return (
    <div
      className="fixed inset-0 lg:inset-auto lg:bottom-6 lg:right-6 w-full lg:w-[400px] h-full lg:h-[600px] rounded-none lg:rounded-2xl bg-[#0f1e35] border-0 lg:border border-[rgba(0,224,184,0.3)] shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 pt-[env(safe-area-inset-top)] lg:pt-0 pb-[env(safe-area-inset-bottom)] lg:pb-0"
      style={{
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 224, 184, 0.15)',
      }}
    >
      {/* Top Header */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.08)] bg-[#152640] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandMark variant="mark" size={18} />
          <span className="text-xs font-bold text-[#e8f0f8] tracking-wide">
            {APP_SHORT_NAME} · 协同中枢
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0a1628] text-[#00e0b8] border border-[rgba(0,224,184,0.2)]">
            ReAct-C
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Deep Cognition Mode Button */}
          <button
            type="button"
            onClick={() => onOpenCognitionWidget(selectedAgentId)}
            className="p-1 rounded text-[#8a97a8] hover:text-[#00e0b8] hover:bg-[#0f1e35] transition-colors cursor-pointer"
            title="打开 W2 认知浮窗 (九步轨迹与深度复盘)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 rounded text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#0f1e35] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8 Agent Horizontal Switcher */}
      <div className="px-2 py-2 bg-[#0a1628] border-b border-[rgba(255,255,255,0.06)] flex items-center gap-1 overflow-x-auto scrollbar-none">
        {AGENTS_LIST.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-1 rounded-lg transition-all shrink-0 cursor-pointer ${isSelected
                ? 'bg-[#152640] ring-1 ring-[#00e0b8]'
                : 'hover:bg-[#0f1e35] opacity-75 hover:opacity-100'
                }`}
              title={`${agent.name} (${agent.role})`}
            >
              <AgentAvatar agentId={agent.id} size="sm" />
            </button>
          );
        })}
      </div>

      {/* Proactive Tip Banner (Collapsible & Dismissable) */}
      {!proactiveDismissed && (
        <div className="bg-[rgba(255,122,69,0.12)] border-b border-[rgba(255,122,69,0.3)] px-3 py-2 text-xs">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[#ff7a45] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>知遇·伯乐 主动提示</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsProactiveExpanded(!isProactiveExpanded)}
                className="text-[#ff7a45] hover:text-white"
              >
                {isProactiveExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={() => setProactiveDismissed(true)}
                className="text-[#8a97a8] hover:text-white ml-1 text-[10px]"
                title="本周不再提示"
              >
                本周不再提示
              </button>
            </div>
          </div>
          {isProactiveExpanded && (
            <p className="text-[11px] text-[#e8f0f8] mt-1 leading-snug">
              检测到当前都市剧题材在抖音 20:00 完播率高出 28%。建议将 S01 前三镜头剪辑节奏压缩至 8.2 秒内。
            </p>
          )}
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-xl rounded-tr-none bg-gradient-to-br from-[#152640] to-[#1e3a63] border border-[rgba(0,224,184,0.2)] p-2.5 text-xs text-[#e8f0f8] shadow-sm">
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-[#8a97a8] mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          const agent = AGENTS_MAP[msg.agentId || DEFAULT_AGENT_ID] || AGENTS_MAP[DEFAULT_AGENT_ID];

          return (
            <div key={msg.id} className="flex items-start gap-2 max-w-[95%]">
              <AgentAvatar agentId={agent.id} size="sm" />
              <div
                className="flex-1 rounded-xl rounded-tl-none bg-[#0a1628] border border-[rgba(255,255,255,0.08)] p-3 text-xs text-[#e8f0f8] shadow-md relative"
                style={{ borderLeft: `3px solid ${agent.color}` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[11px]" style={{ color: agent.color }}>
                    {agent.name}
                  </span>
                  {msg.confidence !== undefined && (
                    <ConfidenceBadge confidence={msg.confidence} size="sm" />
                  )}
                </div>

                <p className="leading-relaxed text-[#e8f0f8] mb-2">{msg.text}</p>

                {/* Reference Card */}
                {msg.referenceCard && (
                  <div
                    onClick={() => onNavigate(msg.referenceCard!.page)}
                    className="p-2 rounded-lg bg-[#152640] border border-[rgba(0,224,184,0.2)] hover:border-[#00e0b8] transition-colors cursor-pointer flex items-center justify-between mb-2 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8]" />
                      <span className="text-[11px] font-bold text-[#e8f0f8] group-hover:text-[#00e0b8]">
                        {msg.referenceCard.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#8a97a8] group-hover:text-[#00e0b8]" />
                  </div>
                )}

                {/* Decision CTA if low confidence */}
                {msg.type === 'decision' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <button
                      type="button"
                      onClick={onOpenCounsel}
                      className="px-2.5 py-1 rounded bg-[rgba(255,68,34,0.15)] hover:bg-[rgba(255,68,34,0.25)] text-[#ff4422] border border-[rgba(255,68,34,0.3)] text-[11px] font-bold cursor-pointer"
                    >
                      进入议事厅仲裁
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('qa')}
                      className="px-2.5 py-1 rounded bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] text-[11px] cursor-pointer"
                    >
                      查看质检门禁
                    </button>
                  </div>
                )}

                <span className="text-[9px] text-[#5c697a] block text-right font-mono mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Command Chips */}
      <div className="px-3 py-1.5 bg-[#0a1628]/80 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={chip.action}
            className="px-2 py-0.5 rounded-md bg-[#152640] hover:bg-[#1f3659] text-[10px] text-[#8a97a8] hover:text-[#00e0b8] border border-[rgba(255,255,255,0.06)] shrink-0 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#152640] border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2 bg-[#0a1628] rounded-xl border border-[rgba(0,224,184,0.2)] px-3 py-1.5 focus-within:border-[#00e0b8] transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`指令发送至 ${activeAgent.name}...`}
            className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none"
          />
          <button
            type="button"
            className="text-[#8a97a8] hover:text-[#e8f0f8] transition-colors p-1"
            title="上传剧本或参考图"
          >
            <Paperclip className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="p-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold transition-colors cursor-pointer"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#5c697a]">
          <span>当前由 {activeAgent.name} 响应 · ReAct-C 九步模式</span>
          <span className="font-mono">⌘ + Enter 发送</span>
        </div>
      </div>
    </div>
  );
};

export default W1AIFamilyWidget;
