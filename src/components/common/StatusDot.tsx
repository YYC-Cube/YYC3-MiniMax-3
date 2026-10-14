/**
 * @file: StatusDot.tsx
 * @description: 组件：StatusDot
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';

export interface StatusDotProps {
  color?: string;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  title?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  color = '#22C55E',
  pulse = true,
  size = 'sm',
  className = '',
  title,
}) => {
  const sizeMap = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} title={title}>
      {pulse && (
        <span
          className={`absolute rounded-full opacity-75 animate-ping ${sizeMap[size]}`}
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className={`relative inline-block rounded-full ${sizeMap[size]}`}
        style={{ backgroundColor: color }}
      />
    </span>
  );
};

export default StatusDot;
