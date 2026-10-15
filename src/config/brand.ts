/**
 * @file: brand.ts
 * @description: YYC³ 品牌与多端资产单源（Single Source of Truth）。
 *               应用名称、主题色、图标路径只准在此定义；页面/组件/构建插件
 *               （pwa.brand.json、site.json 由一致性测试强制同值）一律引用本文件，
 *               禁止散落字面量（边界门禁 R10/R11 机器拦截）。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

/** 全名：document.title / manifest.name / 安装名 */
export const APP_NAME = "YYC³ AI Family · Comic Drama";
/** 短名：桌面图标 / short_name / apple-mobile-web-app-title */
export const APP_SHORT_NAME = "YYC³";
/** UI 品牌行：顶栏副标 / 登录页副标题 */
export const APP_BRAND_LINE = "AI Family · Comic Drama";
/** 应用描述：manifest.description / meta description */
export const APP_DESCRIPTION =
  "面向创作者与工作室的 AI 驱动工业化漫剧生产平台";

export const APP_LANG = "zh-CN";
export const APP_THEME_COLOR = "#0a1628";
export const APP_BACKGROUND_COLOR = "#0a1628";

/** 多端图标路径（物理文件位于 public/icons/，文件名无空格） */
export const APP_ICONS = {
  favicon16: "/icons/favicon-16.png",
  favicon32: "/icons/favicon-32.png",
  appleTouch: "/icons/apple-touch-icon.png",
  pwa192: "/icons/icon-192.png",
  pwa512: "/icons/icon-512.png",
  maskable512: "/icons/icon-maskable-512.png",
} as const;

export type AppIconKey = keyof typeof APP_ICONS;
