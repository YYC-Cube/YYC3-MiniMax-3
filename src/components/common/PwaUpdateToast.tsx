/**
 * @file: PwaUpdateToast.tsx
 * @description: PWA 新版本更新轻提示。检测到 waiting SW 时在底部（避让移动端底栏）
 *               出现「发现新版本 → 立即刷新」，点击即激活新版本。零依赖、不阻断操作。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { RefreshCw } from "lucide-react";
import React, { useSyncExternalStore } from "react";
import {
  activateUpdate,
  getUpdateAvailable,
  subscribeUpdate,
} from "../../pwa/registerSW";

/**
 * 全局挂载一次（App 根）；仅在新版本就绪时渲染。
 */
const PwaUpdateToast: React.FC = () => {
  const updateAvailable = useSyncExternalStore(
    subscribeUpdate,
    getUpdateAvailable,
    () => false
  );

  if (!updateAvailable) return null;

  return (
    <div
      className="fixed z-60 left-1/2 -translate-x-1/2 bottom-24 lg:bottom-6 max-w-[calc(100vw-16px)]"
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={activateUpdate}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#152640] border border-[rgba(0,224,184,0.4)] text-xs text-[#e8f0f8] shadow-2xl shadow-black/50 hover:border-[#00e0b8] transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4 text-[#00e0b8]" />
        <span>发现新版本</span>
        <span className="font-bold text-[#00e0b8]">立即刷新</span>
      </button>
    </div>
  );
};

export default PwaUpdateToast;
