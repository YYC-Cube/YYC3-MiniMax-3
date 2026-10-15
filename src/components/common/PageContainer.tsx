/**
 * @file: PageContainer.tsx
 * @description: 页面级响应式容器：统一各业务页纵向节奏与宽度约束，
 *               移动端默认满宽流式（外层 <main> 已提供 px-3 lg:px-6 安全边距）。
 *               R21 业务页精修统一以本容器为页根，杜绝写死宽度导致的横向滚动。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
}) => (
  <section className={`w-full min-w-0 space-y-4 lg:space-y-5 ${className}`}>
    {children}
  </section>
);

export default PageContainer;
