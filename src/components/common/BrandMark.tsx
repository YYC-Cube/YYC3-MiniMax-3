/**
 * @file: BrandMark.tsx
 * @description: YYC³ 全站唯一品牌标识组件。统一引用 public/icons 资产与 brand 单源
 *               名称文案；UI 内一律使用深底版 mark（maskable512），与深色主题一致。
 *               变体：mark（仅图形）/ mark-text（图形 + 短名 + 品牌行）/ compact。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from "react";
import { APP_BRAND_LINE, APP_ICONS, APP_SHORT_NAME } from "../../config/brand";

export type BrandMarkVariant = "mark" | "mark-text" | "compact";

interface BrandMarkProps {
  variant?: BrandMarkVariant;
  /** 图形边长 px（默认 32） */
  size?: number;
  /** 图形圆角样式（默认 rounded-lg） */
  className?: string;
  /** 文字区附加类（如响应式隐藏副标题） */
  textClassName?: string;
  /** 是否显示品牌行（AI Family · Comic Drama），默认 true */
  showBrandLine?: boolean;
}

/**
 * 品牌标识单源组件：浮窗、顶栏、登录/注册/邀请/引导页等一切品牌位均使用本组件。
 */
const BrandMark: React.FC<BrandMarkProps> = ({
  variant = "mark-text",
  size = 32,
  className = "",
  textClassName = "",
  showBrandLine = true,
}) => {
  const img = (
    <img
      src={APP_ICONS.maskable512}
      width={size}
      height={size}
      alt={APP_SHORT_NAME}
      draggable={false}
      className={`rounded-lg object-contain shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );

  if (variant === "mark") return img;

  if (variant === "compact") {
    return (
      <span className={`inline-flex items-center gap-2 ${textClassName}`}>
        {img}
        <span className="font-bold text-[#e8f0f8] leading-none">{APP_SHORT_NAME}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${textClassName}`}>
      {img}
      <span className="flex flex-col leading-tight">
        <span className="font-bold text-[#e8f0f8] tracking-tight">{APP_SHORT_NAME}</span>
        {showBrandLine && (
          <span className="text-[10px] font-mono text-[#5c697a] truncate">{APP_BRAND_LINE}</span>
        )}
      </span>
    </span>
  );
};

export default BrandMark;
