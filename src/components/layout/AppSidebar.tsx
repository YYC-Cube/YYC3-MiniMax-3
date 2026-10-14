/**
 * @file: AppSidebar.tsx
 * @description: 组件：AppSidebar
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  BarChart3,
  Bookmark,
  BookOpen,
  Bot,
  Box,
  BrainCircuit,
  Clock,
  Coins,
  Compass,
  Component,
  DollarSign,
  FileText,
  Film,
  FolderArchive,
  GitCompare,
  HardDrive,
  Kanban,
  KeyRound,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  ListOrdered,
  Lock,
  LockKeyhole,
  LogIn,
  MailCheck,
  MessageSquare,
  Mic2,
  Music2,
  Network,
  Palette,
  Scissors,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';
import React from 'react';
import { SYNCNET_PASS } from '../../domain/rules';
import { NAV_GROUPS } from '../../navigation/registry';
import { PageId } from '../../types';

interface AppSidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  className?: string;
}

/** 侧栏图标映射（表现层；键随 NAV_GROUPS 单源，漏配 = React 渲染缺图标而非缺导航项） */
const NAV_ICONS: Partial<Record<PageId, React.ReactNode>> = {
  dashboard: <LayoutDashboard className="w-4 h-4" />,
  script: <FileText className="w-4 h-4" />,
  'script-detail': <FileText className="w-4 h-4" />,
  storyboard: <Film className="w-4 h-4" />,
  assets: <FolderArchive className="w-4 h-4" />,
  production: <Layers className="w-4 h-4" />,
  tasks: <ListOrdered className="w-4 h-4" />,
  qa: <ShieldCheck className="w-4 h-4" />,
  library: <BookOpen className="w-4 h-4" />,
  'assets-consistency': <UserCheck className="w-4 h-4" />,
  voice: <Mic2 className="w-4 h-4" />,
  'storyboard-3d': <Box className="w-4 h-4" />,
  video: <Scissors className="w-4 h-4" />,
  'video-templates': <Bookmark className="w-4 h-4" />,
  'video-exports': <Share2 className="w-4 h-4" />,
  music: <Music2 className="w-4 h-4" />,
  'video-compare': <GitCompare className="w-4 h-4" />,
  'video-ad': <DollarSign className="w-4 h-4" />,
  project: <Kanban className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
  cost: <Coins className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
  'project-lore': <Network className="w-4 h-4" />,
  collab: <MessageSquare className="w-4 h-4" />,
  'admin-agents': <Bot className="w-4 h-4" />,
  'admin-rag': <BrainCircuit className="w-4 h-4" />,
  'admin-compliance': <Lock className="w-4 h-4" />,
  publish: <Send className="w-4 h-4" />,
  'publish-accounts': <Users className="w-4 h-4" />,
  'publish-board': <LayoutGrid className="w-4 h-4" />,
  'auth-login': <LogIn className="w-4 h-4" />,
  'auth-register': <UserPlus className="w-4 h-4" />,
  'auth-forgot': <KeyRound className="w-4 h-4" />,
  'auth-reset': <LockKeyhole className="w-4 h-4" />,
  'auth-mfa': <ShieldCheck className="w-4 h-4" />,
  'auth-invite': <MailCheck className="w-4 h-4" />,
  'auth-onboarding': <Compass className="w-4 h-4" />,
  'auth-expired': <Clock className="w-4 h-4" />,
  'auth-locked': <Lock className="w-4 h-4" />,
};

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentPage,
  onNavigate,
  className = '',
}) => {
  // 导航分组单源（registry.NAV_GROUPS）；label/badge/color 随单源，本组件仅补 icon 表现层
  const groups = NAV_GROUPS;

  const nasUsage = 52; // %

  return (
    <aside
      className={`w-60 h-[calc(100vh-3.5rem)] bg-[#0a1628]/90 border-r border-[rgba(0,224,184,0.12)] flex flex-col justify-between shrink-0 sticky top-14 select-none backdrop-blur-sm z-30 ${className}`}
    >
      {/* Scrollable Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {/* Special Views: AI Family Clock Hub & Figma Handover Specs */}
        <div className="space-y-1 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="px-2 text-[10px] font-bold text-[#5c697a] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>核心中枢 & 设计基座</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('family')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${currentPage === 'family'
              ? 'bg-gradient-to-r from-[rgba(0,224,184,0.25)] to-[rgba(157,124,216,0.25)] text-[#e8f0f8] font-bold border border-[rgba(0,224,184,0.4)]'
              : 'text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640]'
              }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00e0b8]" />
              <span>AI Family 8 Agent 环</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-ping" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('figma-tokens')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${currentPage === 'figma-tokens'
              ? 'bg-[#152640] text-[#00e0b8] font-bold border border-[rgba(0,224,184,0.3)]'
              : 'text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640]'
              }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#00B4D8]" />
              <span>🧭 Foundations & Tokens</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('figma-components')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${currentPage === 'figma-components'
              ? 'bg-[#152640] text-[#9d7cd8] font-bold border border-[rgba(157,124,216,0.3)]'
              : 'text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640]'
              }`}
          >
            <div className="flex items-center gap-2">
              <Component className="w-4 h-4 text-[#9d7cd8]" />
              <span>🧩 Components 规格库</span>
            </div>
          </button>
        </div>

        {/* Four Domain Groups */}
        {groups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Domain Header with 16x16 rounded tag */}
            <div className="flex items-center gap-2 px-2 py-1">
              <span
                className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold text-[#0a1628] shrink-0"
                style={{ backgroundColor: group.color }}
              >
                {group.name.slice(0, 1)}
              </span>
              <span
                className="text-[11px] font-bold tracking-wide uppercase"
                style={{ color: group.color }}
              >
                {group.name}
              </span>
            </div>

            {/* Nav Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer ${isActive
                      ? 'bg-[#152640] text-[#e8f0f8] font-medium border-l-2'
                      : 'text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#0f1e35]'
                      }`}
                    style={
                      isActive
                        ? {
                          borderLeftColor: group.color,
                          backgroundColor: 'rgba(21, 38, 64, 0.8)',
                        }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={isActive ? 'text-[#00e0b8]' : 'text-[#5c697a]'}>
                        {NAV_ICONS[item.id]}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#0a1628] text-[#8a97a8] border border-[rgba(255,255,255,0.06)] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pinned Bottom Status Bar */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)] bg-[#071222] space-y-2.5">
        {/* Gate Status Capsule (G0-G5) */}
        <div className="p-2 rounded-lg bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono font-bold text-[#00e0b8]">G3 音画合规</span>
          </div>
          <span className="text-[10px] text-[#8a97a8] font-mono">SyncNet ≥ {SYNCNET_PASS}</span>
        </div>

        {/* NAS Storage Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#8a97a8]">
            <span className="flex items-center gap-1.5 font-mono">
              <HardDrive className="w-3 h-3 text-[#00B4D8]" />
              /mnt/nas
            </span>
            <span className="font-mono text-[10px] tabular-nums">
              {nasUsage}% (12.4TB / 24TB)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#152640] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${nasUsage > 85 ? 'bg-[#ff7a45]' : 'bg-[#00e0b8]'
                }`}
              style={{ width: `${nasUsage}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
