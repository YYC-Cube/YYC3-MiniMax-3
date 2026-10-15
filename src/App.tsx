/**
 * @file: App.tsx
 * @description: Layout & Core Navigation — 纯布局组合（R7 专项收敛）：页面分发经 navigation/registry 单源，
 *                浮层编排走 hooks/useAppOverlays，DevMode 元数据走 hooks/useDevModeMeta，auth 头部组件化
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v3.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { useState } from 'react';
import { useAppOverlays } from './hooks/useAppOverlays';
import { useDevModeMeta } from './hooks/useDevModeMeta';
import type { RenderContext } from './navigation/registry';
import { getPageEntry, PAGE_IDS } from './navigation/registry';
import { DriveModeId } from './tokens';
import { DevModeMeta, PageId, ViewState } from './types';

// Layout & Core Navigation
import AppSidebar from './components/layout/AppSidebar';
import AuthHeader from './components/layout/AuthHeader';
import GlobalCommandMenu from './components/layout/GlobalCommandMenu';
import MobileBottomNav from './components/layout/MobileBottomNav';
import TopNav from './components/layout/TopNav';

// Widgets & Modals
import DevModeDrawer from './components/common/DevModeDrawer';
import PwaUpdateToast from './components/common/PwaUpdateToast';
import { PageSlot } from './components/common/RouteErrorBoundary';
import AgentCounselModal from './components/counsel/AgentCounselModal';
import InteractivePrototypeRunner from './components/prototype/InteractivePrototypeRunner';
import W1AIFamilyWidget from './components/widgets/W1AIFamilyWidget';
import W2CognitionWidget from './components/widgets/W2CognitionWidget';

/**
 * 启动深链：PWA manifest shortcuts 使用 /?p=<pageId>。
 * 仅在首屏读取一次，非法值回退工作台。
 */
function readInitialPage(): PageId {
  const raw = new URLSearchParams(window.location.search).get('p');
  return raw && (PAGE_IDS as string[]).includes(raw) ? (raw as PageId) : 'dashboard';
}

export default function App() {
  // 核心导航状态机（布局职责本体；浮层与元数据编排已外移至 hooks/）
  const [currentPage, setCurrentPage] = useState<PageId>(readInitialPage);
  const [currentDriveMode, setCurrentDriveMode] = useState<DriveModeId>('L1');
  const [pageState, setPageState] = useState<ViewState>('normal');
  /** <lg 侧栏抽屉展开态（lg 以上侧栏恒展开，此状态无视觉影响） */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setPageState('normal');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 浮层编排（互斥与导航规则单点）+ DevMode 元数据装载
  const { overlays, actions } = useAppOverlays(handleNavigate);
  const currentMeta: DevModeMeta = useDevModeMeta(currentPage);

  const isAuthPage = currentPage.startsWith('auth-');

  // 页面渲染上下文
  const renderContext = {
    navigate: handleNavigate,
    viewState: pageState,
    driveMode: currentDriveMode,
    onDriveModeChange: setCurrentDriveMode,
    openCounsel: actions.openCounsel,
    openCognition: actions.openCognition,
  } satisfies RenderContext;

  // DevModeDrawer 共享接线（auth 与主工作区分支复用，仅标题不同）
  const drawer = (pageTitle: string) => (
    <DevModeDrawer
      isOpen={overlays.isDevModeOpen}
      onClose={actions.closeDevMode}
      pageTitle={pageTitle}
      meta={currentMeta}
      currentState={pageState}
      onStateChange={setPageState}
      driveMode={currentDriveMode}
      onDriveModeChange={setCurrentDriveMode}
    />
  );

  // ==============================================================
  // RENDER: Full-Screen Immersive Auth Domain View
  // ==============================================================
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#071222] text-[#e8f0f8] relative select-none">
        {/* Floating Auth Switcher & Navigation Header（auth 域专属组件） */}
        <AuthHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggleDevMode={actions.toggleDevMode}
        />

        {/* Specific Auth Page View（注册表分发 + 降级单点插槽） */}
        <PageSlot navigate={handleNavigate}>
          {getPageEntry(currentPage).render(renderContext)}
        </PageSlot>

        {/* Dev Mode Drawer for Auth pages */}
        {drawer(`Auth 页面: ${currentPage}`)}

        {/* PWA 新版本更新提示（auth 域同样挂载） */}
        <PwaUpdateToast />
      </div>
    );
  }

  // ==============================================================
  // RENDER: Standard Production Workspace Layout
  // ==============================================================
  return (
    <div className="min-h-screen bg-[#0a1628] text-[#e8f0f8] flex flex-col select-none">
      {/* 1. Global 56px Top Navigation Bar */}
      <TopNav
        currentDriveMode={currentDriveMode}
        onDriveModeChange={setCurrentDriveMode}
        onOpenCommand={actions.toggleCommand}
        onToggleDevMode={actions.toggleDevMode}
        isDevModeOpen={overlays.isDevModeOpen}
        onTogglePrototype={actions.togglePrototype}
        isPrototypeOpen={overlays.isPrototypeOpen}
        onToggleFamilyWidget={actions.toggleFamilyWidget}
        onNavigate={handleNavigate}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* 移动端抽屉遮罩（<lg；点击关闭；桌面 lg 恒隐藏） */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="关闭导航菜单"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 top-14 z-40 bg-black/60 backdrop-blur-[1px] cursor-default"
          />
        )}

        {/* Left 240px Grouped App Sidebar（<lg 为滑入抽屉） */}
        <AppSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          mobileOpen={sidebarOpen}
        />

        {/* Center Content Stream (1440px Main Canvas) — 注册表分发 + 降级单点插槽 */}
        <main className="flex-1 overflow-y-auto px-3 lg:px-6 py-4 lg:py-5 pb-24 lg:pb-5 max-w-[1720px] mx-auto w-full">
          <PageSlot navigate={handleNavigate}>
            {getPageEntry(currentPage).render(renderContext)}
          </PageSlot>
        </main>
      </div>

      {/* 移动端底部五槽位导航（<lg；中央 AI FAB 打开 W1） */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenFamilyWidget={actions.toggleFamilyWidget}
      />

      {/* 3. Global Floating Universal Widget (W1) */}
      <W1AIFamilyWidget
        isOpen={overlays.isFamilyWidgetOpen}
        onToggle={actions.toggleFamilyWidget}
        onOpenCognitionWidget={actions.openCognition}
        onOpenCounsel={actions.openCounsel}
        onNavigate={handleNavigate}
      />

      {/* 4. Global Deep Cognition Widget (W2) */}
      <W2CognitionWidget
        isOpen={overlays.isCognitionWidgetOpen}
        onClose={actions.closeCognition}
        onSwitchToW1={actions.switchToW1}
        initialAgentId={overlays.selectedAgentId}
        driveMode={currentDriveMode}
      />

      {/* 5. Multi-Agent Council Modal (议事厅) */}
      <AgentCounselModal
        isOpen={overlays.isCounselOpen}
        onClose={actions.closeCounsel}
        onAdoptArbitration={actions.adoptArbitration}
        onHumanOverride={actions.humanOverride}
      />

      {/* 6. Interactive 90s / 60s Prototype Player */}
      <InteractivePrototypeRunner
        isOpen={overlays.isPrototypeOpen}
        onClose={actions.closePrototype}
        onNavigate={handleNavigate}
        onOpenCounsel={actions.openCounsel}
      />

      {/* 7. Global ⌘K Command Menu */}
      <GlobalCommandMenu
        isOpen={overlays.isCommandOpen}
        onClose={actions.closeCommand}
        onNavigate={handleNavigate}
      />

      {/* 8. Figma Dev Mode Inspector & State Simulator */}
      {drawer(`页面: ${currentPage}`)}

      {/* 9. PWA 新版本更新提示 */}
      <PwaUpdateToast />
    </div>
  );
}
