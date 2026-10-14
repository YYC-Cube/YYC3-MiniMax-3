/**
 * @file: DevModeDrawer.tsx
 * @description: 组件：DevModeDrawer
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { Activity, Check, Code, Copy, Cpu, Database, Eye, Shield, X } from 'lucide-react';
import React from 'react';
import { getRecentEvents, TELEMETRY_CAPACITY } from '../../observability/telemetry';
import { DriveModeId } from '../../tokens';
import { DevModeMeta, ViewState } from '../../types';

interface DevModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  meta: DevModeMeta;
  currentState: ViewState;
  onStateChange: (state: ViewState) => void;
  driveMode: DriveModeId;
  onDriveModeChange: (mode: DriveModeId) => void;
}

export const DevModeDrawer: React.FC<DevModeDrawerProps> = ({
  isOpen,
  onClose,
  pageTitle,
  meta,
  currentState,
  onStateChange,
  driveMode,
  onDriveModeChange,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stateButtons: { key: ViewState; label: string; color: string }[] = [
    { key: 'normal', label: '正常态', color: '#00e0b8' },
    { key: 'empty', label: '空态', color: '#8a97a8' },
    { key: 'loading', label: '加载态', color: '#00B4D8' },
    { key: 'error', label: '错误态', color: '#ff4422' },
    { key: 'forbidden', label: '无权限态', color: '#FFB020' },
  ];

  return (
    <div className="fixed top-14 right-0 bottom-0 w-[420px] z-50 bg-[#0f1e35] border-l border-[rgba(0,224,184,0.3)] shadow-2xl flex flex-col backdrop-blur-md animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between bg-[#152640]">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#00e0b8]" />
          <div>
            <h3 className="text-xs font-bold text-[#e8f0f8] tracking-wider uppercase">
              Dev Mode 架构标注与调试
            </h3>
            <p className="text-[11px] text-[#8a97a8]">{pageTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#0f1e35] transition-colors cursor-pointer"
            title="复制 Dev Mode Schema"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#8a97a8]" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#0f1e35] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Dynamic State Simulator */}
        <div className="p-3.5 rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.2)]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-bold text-[#e8f0f8] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#00e0b8]" />
              页面四态实时切换仿真
            </span>
            <span className="text-[10px] font-mono text-[#8a97a8]">Dev Preview</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {stateButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => onStateChange(btn.key)}
                className={`py-1.5 px-1 rounded-md text-[11px] font-mono text-center transition-all cursor-pointer ${currentState === btn.key
                    ? 'font-bold shadow-sm'
                    : 'text-[#8a97a8] hover:bg-[#152640]'
                  }`}
                style={
                  currentState === btn.key
                    ? {
                      backgroundColor: `${btn.color}25`,
                      color: btn.color,
                      border: `1px solid ${btn.color}70`,
                    }
                    : { border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Specification */}
        <div className="space-y-1.5">
          <span className="text-[#8a97a8] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <Database className="w-3 h-3 text-[#00B4D8]" />
            后端数据源接口 (API Endpoint)
          </span>
          <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] font-mono text-[#00e0b8] text-[11px] break-all select-all">
            {meta.apiEndpoint}
          </div>
        </div>

        {/* Confidence Engine */}
        <div className="space-y-1.5">
          <span className="text-[#8a97a8] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#7B8CFF]" />
            置信度数据源 (Confidence Source)
          </span>
          <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] font-mono text-[#e8f0f8] text-[11px]">
            {meta.confidenceSource}
          </div>
        </div>

        {/* Memory Scope & Learning Sample */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[#8a97a8] text-[10px] uppercase font-semibold">
              三层记忆作用域 (Scope)
            </span>
            <div className="p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] font-mono text-[#B57BFF] capitalize">
              {meta.memoryScope} Layer
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[#8a97a8] text-[10px] uppercase font-semibold">
              当前驾驶策略
            </span>
            <div className="p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] font-mono text-[#00e0b8]">
              {driveMode} Mode
            </div>
          </div>
        </div>

        {/* Drive Mode Policy */}
        <div className="space-y-1.5">
          <span className="text-[#8a97a8] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#FFB020]" />
            驾驶模式控制策略 (Policy)
          </span>
          <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-[#8a97a8] leading-relaxed">
            {meta.driveModePolicy}
          </div>
        </div>

        {/* State Switch Conditions */}
        <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
          <span className="text-[#e8f0f8] text-[11px] font-bold block">
            四态触发条件规格 (State Trigger Conditions)
          </span>
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded bg-[#0a1628] border-l-2 border-[#8a97a8]">
              <span className="font-bold text-[#8a97a8] mr-1">空态:</span>
              <span className="text-[#8a97a8]">{meta.stateSwitchConditions.empty}</span>
            </div>
            <div className="p-2 rounded bg-[#0a1628] border-l-2 border-[#00B4D8]">
              <span className="font-bold text-[#00B4D8] mr-1">加载态:</span>
              <span className="text-[#8a97a8]">{meta.stateSwitchConditions.loading}</span>
            </div>
            <div className="p-2 rounded bg-[#0a1628] border-l-2 border-[#ff4422]">
              <span className="font-bold text-[#ff4422] mr-1">错误态:</span>
              <span className="text-[#8a97a8]">{meta.stateSwitchConditions.error}</span>
            </div>
            <div className="p-2 rounded bg-[#0a1628] border-l-2 border-[#FFB020]">
              <span className="font-bold text-[#FFB020] mr-1">无权限态:</span>
              <span className="text-[#8a97a8]">{meta.stateSwitchConditions.forbidden}</span>
            </div>
          </div>
        </div>
        {/* Local Telemetry Ring Buffer（本地优先：无公网 APM，进程内诊断） */}
        <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-[#e8f0f8] text-[11px] font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00B4D8]" />
              本地遥测环形缓冲
            </span>
            <span className="text-[10px] font-mono text-[#8a97a8]">
              {getRecentEvents().length}/{TELEMETRY_CAPACITY}
            </span>
          </div>
          {getRecentEvents().length === 0 ? (
            <div className="p-2 rounded bg-[#0a1628] text-[#5c697a] text-[11px]">
              暂无事件 — 快照降级 / 元数据加载失败 / 网络错误将记录于此
            </div>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {[...getRecentEvents()].reverse().map((event, i) => (
                <div
                  key={`${event.ts}-${i}`}
                  className="p-2 rounded bg-[#0a1628] border-l-2 text-[10px] font-mono"
                  style={{
                    borderColor: event.level === 'error' ? '#ff4422' : event.level === 'warn' ? '#FFB020' : '#8a97a8',
                  }}
                >
                  <span
                    className="font-bold mr-1.5"
                    style={{ color: event.level === 'error' ? '#ff4422' : event.level === 'warn' ? '#FFB020' : '#8a97a8' }}
                  >
                    [{event.level.toUpperCase()}]
                  </span>
                  <span className="text-[#e8f0f8]">{event.source}</span>
                  <span className="text-[#8a97a8]"> · {event.message}</span>
                  {event.detail && <div className="text-[#5c697a] mt-0.5 break-all">{event.detail}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevModeDrawer;
