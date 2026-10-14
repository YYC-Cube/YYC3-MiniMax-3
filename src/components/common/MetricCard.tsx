/**
 * @file: MetricCard.tsx
 * @description: 组件：MetricCard
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { DomainType, DOMAIN_COLORS } from '../../tokens';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  domain?: DomainType;
  cognitionColor?: string;
  driveTag?: string;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  change,
  isPositive = true,
  domain,
  cognitionColor,
  driveTag,
  subtext,
  icon,
  className = '',
}) => {
  const domainColor = domain ? DOMAIN_COLORS[domain].color : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#0f1e35] p-4 border border-[rgba(0,224,184,0.12)] hover:border-[rgba(0,224,184,0.3)] transition-all duration-200 ${className}`}
      style={{
        borderTop: domainColor ? `3px solid ${domainColor}` : undefined,
        borderLeft: cognitionColor ? `3px solid ${cognitionColor}` : undefined,
      }}
    >
      <div className="flex items-center justify-between text-[#8a97a8] mb-2">
        <span className="text-xs font-medium tracking-wide flex items-center gap-1.5">
          {domain && (
            <span
              className="w-2 h-2 rounded-sm inline-block"
              style={{ backgroundColor: domainColor }}
              title={DOMAIN_COLORS[domain].label}
            />
          )}
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {driveTag && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.2)]">
              {driveTag}
            </span>
          )}
          {icon && <span className="text-[#8a97a8]">{icon}</span>}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold font-mono tabular-nums text-[#e8f0f8] tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs text-[#8a97a8]">{unit}</span>}
      </div>

      {(change || subtext) && (
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          {change && (
            <span
              className={`font-mono flex items-center gap-1 ${
                isPositive ? 'text-[#22C55E]' : 'text-[#ff4422]'
              }`}
            >
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{change}</span>
            </span>
          )}
          {subtext && <span className="text-[#5c697a] truncate max-w-[140px]">{subtext}</span>}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
