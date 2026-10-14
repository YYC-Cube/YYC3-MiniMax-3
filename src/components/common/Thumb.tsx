/**
 * @file: Thumb.tsx
 * @description: 组件：Thumb — 远程缩略图统一组件，加载失败自动降级为确定性渐变占位（本地优先）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState } from 'react';

/**
 * 从标签派生确定性占位渐变（同标签同色，纯函数可测）。
 * 外链资源断网失败时，占位保持版面密度与色调和谐。
 */
export function placeholderTone(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h} 35% 18%), hsl(${(h + 40) % 360} 45% 10%))`;
}

interface ThumbProps {
  /** 图片地址；空值直接渲染占位（如 characters[0]?.avatar 未配置） */
  src?: string;
  alt?: string;
  /** 占位标签（镜头号/标题等），用于派生色调与显示字符 */
  label: string;
  className?: string;
}

export const Thumb: React.FC<ThumbProps> = ({ src, alt = '', label, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={label}
        data-degraded="true"
        className={`flex items-center justify-center text-[#5c697a] text-[10px] font-mono ${className}`}
        style={{ background: placeholderTone(label) }}
      >
        <span>{label.slice(0, 4)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default Thumb;
