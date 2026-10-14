/**
 * @file: TopNav.tsx
 * @description: 组件：TopNav
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Bell,
  Compass,
  Cpu,
  Layers,
  Mic,
  PlayCircle,
  Search,
  Sparkles
} from 'lucide-react';
import React from 'react';
import { DriveModeId } from '../../tokens';
import { PageId } from '../../types';
import DriveModeSwitch from '../common/DriveModeSwitch';

interface TopNavProps {
  currentDriveMode: DriveModeId;
  onDriveModeChange: (mode: DriveModeId) => void;
  onOpenCommand: () => void;
  onToggleDevMode: () => void;
  isDevModeOpen: boolean;
  onTogglePrototype: () => void;
  isPrototypeOpen: boolean;
  onToggleFamilyWidget: () => void;
  unreadNotifications?: number;
  onNavigate: (pageId: PageId) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentDriveMode,
  onDriveModeChange,
  onOpenCommand,
  onToggleDevMode,
  isDevModeOpen,
  onTogglePrototype,
  isPrototypeOpen,
  onToggleFamilyWidget,
  unreadNotifications = 2,
  onNavigate,
}) => {
  const [micActive, setMicActive] = React.useState(false);

  return (
    <header className="h-14 w-full bg-[#0a1628]/95 border-b border-[rgba(0,224,184,0.12)] px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e0b8] via-[#00b4d8] to-[#9d7cd8] p-0.5 shadow-md shadow-teal-900/30">
            <div className="w-full h-full bg-[#0a1628] rounded-[6px] flex items-center justify-center font-black text-xs text-[#00e0b8] group-hover:text-white transition-colors tracking-tighter">
              YYC³
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                AI Family · Comic Drama
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.25)]">
                v2.4 PRO
              </span>
            </div>
            <span className="text-[10px] text-[#5c697a]">8 Agent 协同漫剧工业化生产系统</span>
          </div>
        </button>

        {/* Clock Hub Quick Entry */}
        <button
          type="button"
          onClick={() => onNavigate('family')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f1e35] hover:bg-[#152640] border border-[rgba(0,224,184,0.2)] text-xs text-[#00e0b8] transition-all cursor-pointer"
          title="打开 8 Agent 时钟环大屏"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Agent 时钟环</span>
        </button>
      </div>

      {/* Center Search & Cluster Health */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0f1e35] hover:bg-[#152640] border border-[rgba(255,255,255,0.08)] text-xs text-[#8a97a8] transition-all w-64 justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#5c697a] group-hover:text-[#00e0b8] transition-colors" />
            <span className="text-[11px]">全局搜索资产、分镜、指令...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#152640] text-[#8a97a8] border border-[rgba(255,255,255,0.1)]">
            ⌘K
          </kbd>
        </button>

        {/* Voice Command Mic */}
        <button
          type="button"
          onClick={() => setMicActive(!micActive)}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${micActive
              ? 'bg-[rgba(255,215,0,0.2)] border-[#FFD700] text-[#FFD700] animate-pulse'
              : 'bg-[#0f1e35] border-[rgba(255,255,255,0.08)] text-[#8a97a8] hover:text-[#e8f0f8]'
            }`}
          title={micActive ? '言启·千行 正在倾听语音指令...' : '语音指令 (言启·千行 意图识别)'}
        >
          <Mic className="w-3.5 h-3.5" />
        </button>

        {/* Compute Cluster Pills */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono">
          <Cpu className="w-3.5 h-3.5 text-[#00e0b8]" />
          <div className="flex items-center gap-2 text-[#8a97a8]">
            <span>DGX-1: <strong className="text-[#00e0b8]">42%</strong></span>
            <span className="text-[#5c697a]">|</span>
            <span>DGX-2: <strong className="text-[#00B4D8]">68%</strong></span>
            <span className="text-[#5c697a]">|</span>
            <span>NAS: <strong className="text-[#8a97a8]">52%</strong></span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Global Drive Mode Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#5c697a] hidden sm:inline">驾驶模式:</span>
          <DriveModeSwitch
            currentMode={currentDriveMode}
            onChange={onDriveModeChange}
            size="sm"
            variant="compact"
          />
        </div>

        {/* 90s/60s Interactive Golden Path Runner Toggle */}
        <button
          type="button"
          onClick={onTogglePrototype}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isPrototypeOpen
              ? 'bg-[#00e0b8] text-[#0a1628] font-bold shadow-md shadow-teal-900/30'
              : 'bg-[#0f1e35] text-[#00e0b8] border border-[rgba(0,224,184,0.3)] hover:bg-[#152640]'
            }`}
          title="运行 90秒金牌路径 / 60秒认知闭环原型"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">双原型剧本</span>
        </button>

        {/* Dev Mode Inspector Toggle */}
        <button
          type="button"
          onClick={onToggleDevMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${isDevModeOpen
              ? 'bg-[#152640] text-[#00e0b8] border border-[#00e0b8]'
              : 'bg-[#0f1e35] text-[#8a97a8] hover:text-[#e8f0f8] border border-[rgba(255,255,255,0.08)]'
            }`}
          title="打开 Figma Dev Mode 架构标注与四态调试"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Dev Mode</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          className="relative p-2 rounded-lg bg-[#0f1e35] hover:bg-[#152640] border border-[rgba(255,255,255,0.08)] text-[#8a97a8] hover:text-[#e8f0f8] transition-colors cursor-pointer"
          title="通知中心与任务深链"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4422] text-[10px] font-bold text-white flex items-center justify-center font-mono">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* AI Family Floating Assistant Toggle Button */}
        <button
          type="button"
          onClick={onToggleFamilyWidget}
          className="p-1.5 rounded-lg bg-gradient-to-r from-[rgba(0,224,184,0.2)] to-[rgba(157,124,216,0.2)] border border-[rgba(0,224,184,0.3)] hover:border-[#00e0b8] text-[#00e0b8] transition-all cursor-pointer flex items-center gap-1.5"
          title="展开/收起 AI Family 全局浮窗"
        >
          <Sparkles className="w-4 h-4 text-[#00e0b8]" />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
