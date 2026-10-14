/**
 * @file: DriveModeSwitch.tsx
 * @description: 组件：DriveModeSwitch
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { DRIVE_MODES, DriveModeId } from '../../tokens';

interface DriveModeSwitchProps {
  currentMode: DriveModeId;
  onChange: (mode: DriveModeId) => void;
  size?: 'sm' | 'md';
  variant?: 'compact' | 'full';
  className?: string;
}

export const DriveModeSwitch: React.FC<DriveModeSwitchProps> = ({
  currentMode,
  onChange,
  size = 'md',
  variant = 'compact',
  className = '',
}) => {
  const modes: DriveModeId[] = ['L0', 'L1', 'L2'];

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] ${className}`}
      title={`当前驾驶模式：${DRIVE_MODES[currentMode].name} - ${DRIVE_MODES[currentMode].desc}`}
    >
      {modes.map((mode) => {
        const info = DRIVE_MODES[mode];
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`flex items-center gap-1.5 rounded-md font-mono transition-all duration-150 cursor-pointer ${
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
            } ${
              isActive
                ? 'font-medium shadow-sm'
                : 'text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640]'
            }`}
            style={
              isActive
                ? {
                    backgroundColor: `${info.color}20`,
                    color: info.color,
                    border: `1px solid ${info.color}60`,
                  }
                : { border: '1px solid transparent' }
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : 'opacity-40'}`}
              style={{ backgroundColor: info.color }}
            />
            <span className="font-bold">{mode}</span>
            {variant === 'full' && (
              <span className="text-[11px] opacity-90">{info.name}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DriveModeSwitch;
