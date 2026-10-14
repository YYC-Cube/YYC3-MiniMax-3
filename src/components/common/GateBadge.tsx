/**
 * @file: GateBadge.tsx
 * @description: 组件：GateBadge
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { GATE_LEVELS, GateLevel } from '../../tokens';

interface GateBadgeProps {
  level: GateLevel;
  active?: boolean;
  passed?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const GateBadge: React.FC<GateBadgeProps> = ({
  level,
  active = false,
  passed = false,
  size = 'md',
  className = '',
}) => {
  const gateInfo = GATE_LEVELS.find((g) => g.id === level) || {
    id: level,
    name: '门禁',
    threshold: '质检校验',
  };

  const color = passed ? '#22C55E' : active ? '#00e0b8' : '#5c697a';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md font-mono border transition-all duration-200 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'
      } ${className}`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color,
      }}
      title={`${gateInfo.id} 门禁 (${gateInfo.name}) · 准入标准：${gateInfo.threshold}`}
    >
      <span className="font-bold">{gateInfo.id}</span>
      <span className="text-[11px] opacity-80">{gateInfo.name}</span>
      {passed && <span className="text-[10px] text-[#22C55E]">✓</span>}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-pulse" />}
    </div>
  );
};

export default GateBadge;
