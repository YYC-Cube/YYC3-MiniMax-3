/**
 * @file: ConfidenceBadge.tsx
 * @description: 组件：ConfidenceBadge
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { getConfidenceMeta } from '../../tokens';

interface ConfidenceBadgeProps {
  confidence: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  showValue = true,
  size = 'md',
  className = '',
}) => {
  const meta = getConfidenceMeta(confidence);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-2.5 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-md font-mono border backdrop-blur-sm transition-all duration-200 ${sizeClasses} ${className}`}
      style={{
        backgroundColor: `${meta.color}15`,
        borderColor: `${meta.color}40`,
        color: meta.color,
      }}
      title={`置信度 ${confidence.toFixed(2)} · ${meta.label} (${meta.desc})`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
        style={{ backgroundColor: meta.color }}
      />
      <span>{meta.tag}</span>
      {showValue && (
        <span className="font-semibold tabular-nums opacity-90">
          {(confidence * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};

export default ConfidenceBadge;
