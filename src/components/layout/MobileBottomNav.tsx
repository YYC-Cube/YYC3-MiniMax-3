/**
 * @file: MobileBottomNav.tsx
 * @description: 移动端（<lg）底部主导航：生产 / 剪辑 / AI FAB / 管理 / 推送 五槽位。
 *               分组与首页映射取自 NAV_GROUPS 单源；当前页所属分组高亮；中央 AI FAB
 *               打开 W1 协同浮窗。安全区适配（env(safe-area-inset-bottom)），lg 以上隐藏。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { Film, Scissors, Send, Settings2, Sparkles } from "lucide-react";
import React from "react";
import { NAV_GROUPS } from "../../navigation/registry";
import type { PageId } from "../../types";

interface MobileBottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenFamilyWidget: () => void;
}

/** 底栏四个分组（NAV_GROUPS 中除 auth 鉴权域外的业务域）；中央槽位留给 AI FAB */
const TAB_GROUP_IDS = ["prod", "edit", "mgmt", "push"] as const;

const GROUP_ICONS: Record<string, React.ReactNode> = {
  prod: <Film className="w-5 h-5" />,
  edit: <Scissors className="w-5 h-5" />,
  mgmt: <Settings2 className="w-5 h-5" />,
  push: <Send className="w-5 h-5" />,
};

/**
 * 固定底部 Tab 栏；点击分组直达该组首个页面。
 */
const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenFamilyWidget,
}) => {
  const groups = TAB_GROUP_IDS.map((id) => NAV_GROUPS.find((g) => g.id === id)).filter(
    (g): g is (typeof NAV_GROUPS)[number] => Boolean(g)
  );

  /** 当前页是否属于该分组（含中枢特殊页归生产组） */
  const isGroupActive = (groupId: string, items: readonly { id: string }[]) => {
    if (groupId === "prod" && (currentPage === "family" || currentPage === "figma-tokens")) {
      return true;
    }
    return items.some((item) => item.id === currentPage);
  };

  const renderTab = (group: (typeof NAV_GROUPS)[number]) => {
    const active = isGroupActive(group.id, group.items);
    return (
      <button
        key={group.id}
        type="button"
        onClick={() => onNavigate(group.items[0].id as PageId)}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
          active ? "text-[#00e0b8]" : "text-[#8a97a8] hover:text-[#e8f0f8]"
        }`}
        aria-label={group.name}
        aria-current={active ? "page" : undefined}
      >
        {GROUP_ICONS[group.id]}
        <span className="text-[10px] leading-none">{group.name.slice(0, 4)}</span>
      </button>
    );
  };

  const [prod, edit, mgmt, push] = groups;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1628]/95 border-t border-[rgba(0,224,184,0.18)] backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="移动端主导航"
    >
      <div className="flex items-stretch h-16">
        {renderTab(prod)}
        {renderTab(edit)}

        {/* 中央 AI Family FAB */}
        <div className="flex-1 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenFamilyWidget}
            className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-br from-[#00e0b8] to-[#00b4d8] text-[#0a1628] flex items-center justify-center shadow-lg shadow-teal-900/50 border-2 border-[#0a1628] cursor-pointer active:scale-95 transition-transform"
            aria-label="打开 AI Family 协同浮窗"
            title="AI Family 协同中枢"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        {renderTab(mgmt)}
        {renderTab(push)}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
