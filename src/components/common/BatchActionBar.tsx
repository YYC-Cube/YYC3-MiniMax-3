/**
 * @file: BatchActionBar.tsx
 * @description: 组件：BatchActionBar
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { X } from 'lucide-react';

interface BatchAction {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

interface BatchActionBarProps {
  selectedCount: number;
  totalCount?: number;
  onClear: () => void;
  actions: BatchAction[];
  className?: string;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onClear,
  actions,
  className = '',
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-xl bg-[#152640] border border-[rgba(0,224,184,0.35)] shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 12px rgba(0, 224, 184, 0.15)',
      }}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-[rgba(255,255,255,0.1)]">
        <span className="text-xs text-[#8a97a8]">已选择</span>
        <span className="text-sm font-bold font-mono text-[#00e0b8] tabular-nums">
          {selectedCount}
        </span>
        {totalCount && (
          <span className="text-xs text-[#5c697a]">/ {totalCount}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions.map((act, idx) => {
          const style = {
            primary: 'bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold',
            secondary: 'bg-[#0f1e35] hover:bg-[#1a2f4e] text-[#e8f0f8] border border-[rgba(255,255,255,0.12)]',
            danger: 'bg-[rgba(255,68,34,0.15)] hover:bg-[rgba(255,68,34,0.25)] text-[#ff4422] border border-[rgba(255,68,34,0.3)]',
          }[act.variant || 'secondary'];

          return (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer ${style}`}
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClear}
        className="p-1 text-[#8a97a8] hover:text-[#e8f0f8] rounded-md hover:bg-[#0f1e35] transition-colors cursor-pointer"
        title="取消全部选择"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BatchActionBar;
