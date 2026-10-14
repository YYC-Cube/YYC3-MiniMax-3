/**
 * @file: ConfirmSheet.tsx
 * @description: 组件：ConfirmSheet
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmSheetProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmSheet: React.FC<ConfirmSheetProps> = ({
  isOpen,
  title,
  description,
  confirmText = '确认执行',
  cancelText = '取消',
  isDestructive = false,
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.2)] p-6 shadow-2xl relative animate-in zoom-in-95"
        style={{
          boxShadow: isDestructive
            ? '0 0 24px rgba(255, 68, 34, 0.2)'
            : '0 0 24px rgba(0, 224, 184, 0.15)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isDestructive
                  ? 'bg-[rgba(255,68,34,0.15)] text-[#ff4422]'
                  : 'bg-[rgba(0,224,184,0.15)] text-[#00e0b8]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e8f0f8]">{title}</h3>
              <p className="text-xs text-[#8a97a8] mt-0.5">二次风控审核机制</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#8a97a8] hover:text-[#e8f0f8] p-1 rounded-lg hover:bg-[#152640] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#8a97a8] leading-relaxed mb-4">
          {description}
        </p>

        {children && <div className="mb-4">{children}</div>}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
              isDestructive
                ? 'bg-[#ff4422] hover:bg-[#e03818] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSheet;
