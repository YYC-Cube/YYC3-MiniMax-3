/**
 * YYC³ Auth 域头部（R7 专项 R7-C）— 返回工作台 + auth 切换条 + Dev Mode 开关
 *
 * 自 App.tsx auth 分支原样平移（样式与行为零变化）；切换项来自 registry.AUTH_PAGE_ITEMS 单源派生。
 * @file: AuthHeader.tsx
 * @description: YYC³ Auth 域头部 — 返回工作台 + auth 切换条 + Dev Mode 开关
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { ArrowLeft, Layers } from 'lucide-react';
import React from 'react';
import { AUTH_PAGE_ITEMS } from '../../navigation/registry';
import type { PageId } from '../../types';

interface AuthHeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onToggleDevMode: () => void;
}

export default function AuthHeader({ currentPage, onNavigate, onToggleDevMode }: AuthHeaderProps) {
  return (
    <div className="fixed top-4 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f1e35]/90 hover:bg-[#152640] border border-[rgba(0,224,184,0.3)] text-xs text-[#00e0b8] font-bold shadow-lg transition-colors cursor-pointer backdrop-blur-md"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>返回生产工作台 (Dashboard)</span>
      </button>

      <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-[#0f1e35]/90 border border-[rgba(255,255,255,0.08)] text-[11px] font-mono shadow-2xl backdrop-blur-md overflow-x-auto">
        {AUTH_PAGE_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`px-2 py-0.5 rounded cursor-pointer ${currentPage === id ? 'bg-[#00e0b8] text-[#0a1628] font-bold' : 'text-[#8a97a8] hover:text-white'}`}
          >
            {label}
          </button>
        ))}

        {/* Dev Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDevMode}
          className="ml-2 px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)] hover:bg-[#1f3659] cursor-pointer flex items-center gap-1"
        >
          <Layers className="w-3 h-3" />
          <span>Dev Mode</span>
        </button>
      </div>
    </div>
  );
}
