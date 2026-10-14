/**
 * @file: registry.tsx
 * @description: YYC³ 路由注册表 — PageId→组件/DevMode 元数据同源单例注册（App 壳层唯一渲染分发点）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import type { ReactNode } from 'react';
import { lazy } from 'react';
import { DOMAIN_COLORS, DriveModeId } from '../tokens';
import type { DevModeMeta, PageId, ViewState } from '../types';

/** App 壳层注入页面的渲染上下文（字段全必填，页面按需挑选） */
export interface RenderContext {
  navigate: (page: PageId) => void;
  viewState: ViewState;
  driveMode: DriveModeId;
  onDriveModeChange: (mode: DriveModeId) => void;
  openCounsel: () => void;
  openCognition: (agentId: string) => void;
}

export interface PageEntry {
  /** DevMode 元数据加载器 — 与组件同模块，打包器自动去重 */
  meta: () => Promise<DevModeMeta>;
  /** 渲染函数 — 返回该页面的 lazy 组件元素（props 与原注册一一对应） */
  render: (ctx: RenderContext) => ReactNode;
}

// ==============================================================
// Route-level Code Splitting（按业务域动态 import() 分包）
// 模块级单例 lazy：render 重入不会触发 remount。
// ==============================================================

// Production Pages（生产全链路域）
const DashboardPage = lazy(() => import('../pages/production/DashboardPage'));
const ScriptListPage = lazy(() => import('../pages/production/ScriptListPage'));
const ScriptDetailPage = lazy(() => import('../pages/production/ScriptDetailPage'));
const StoryboardPage = lazy(() => import('../pages/production/StoryboardPage'));
const AssetsPage = lazy(() => import('../pages/production/AssetsPage'));
const BatchProductionPage = lazy(() => import('../pages/production/BatchProductionPage'));
const TasksPage = lazy(() => import('../pages/production/TasksPage'));
const QualityAssurancePage = lazy(() => import('../pages/production/QualityAssurancePage'));
const LibraryPage = lazy(() => import('../pages/production/LibraryPage'));
const ConsistencyTrainingPage = lazy(() => import('../pages/production/ConsistencyTrainingPage'));
const VoiceStudioPage = lazy(() => import('../pages/production/VoiceStudioPage'));
const Storyboard3DPage = lazy(() => import('../pages/production/Storyboard3DPage'));

// Editing Pages（剪辑合并域）
const TimelineEditorPage = lazy(() => import('../pages/editing/TimelineEditorPage'));
const VideoTemplatesPage = lazy(() => import('../pages/editing/VideoTemplatesPage'));
const VideoExportsPage = lazy(() => import('../pages/editing/VideoExportsPage'));
const MusicLibraryPage = lazy(() => import('../pages/editing/MusicLibraryPage'));
const VideoComparePage = lazy(() => import('../pages/editing/VideoComparePage'));
const VideoAdPage = lazy(() => import('../pages/editing/VideoAdPage'));

// Management Pages（平台管理域）
const ProjectSeriesPage = lazy(() => import('../pages/management/ProjectSeriesPage'));
const AnalyticsPage = lazy(() => import('../pages/management/AnalyticsPage'));
const CostCenterPage = lazy(() => import('../pages/management/CostCenterPage'));
const AdminPermissionPage = lazy(() => import('../pages/management/AdminPermissionPage'));
const ProjectLorePage = lazy(() => import('../pages/management/ProjectLorePage'));
const CollabCommentsPage = lazy(() => import('../pages/management/CollabCommentsPage'));
const AdminAgentsPage = lazy(() => import('../pages/management/AdminAgentsPage'));
const AdminRagPage = lazy(() => import('../pages/management/AdminRagPage'));
const AdminCompliancePage = lazy(() => import('../pages/management/AdminCompliancePage'));

// Publishing Pages（一键推送域）
const PublishWizardPage = lazy(() => import('../pages/publishing/PublishWizardPage'));
const PublishAccountsPage = lazy(() => import('../pages/publishing/PublishAccountsPage'));
const PublishBoardPage = lazy(() => import('../pages/publishing/PublishBoardPage'));

// Special Core Views
const ClockHubPage = lazy(() => import('../pages/special/ClockHubPage'));
const FigmaTokensPage = lazy(() => import('../pages/special/FigmaTokensPage'));
const FigmaComponentsPage = lazy(() => import('../pages/special/FigmaComponentsPage'));

// Auth Domain Pages（认证域 A01-A09）
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const MfaPage = lazy(() => import('../pages/auth/MfaPage'));
const InviteLandingPage = lazy(() => import('../pages/auth/InviteLandingPage'));
const OnboardingPage = lazy(() => import('../pages/auth/OnboardingPage'));
const SessionExpiredAndForbiddenPage = lazy(() => import('../pages/auth/SessionExpiredAndForbiddenPage'));
const AccountLockedPage = lazy(() => import('../pages/auth/AccountLockedPage'));

/**
 * 页面注册表。
 * Record<PageId, PageEntry> 由编译器强制 43 项全覆盖：新增 PageId 而未登记
 * 时 TypeScript 直接报错，杜绝「漏分支 = 白屏」缺陷。
 */
const REGISTRY: Record<PageId, PageEntry> = {
  dashboard: {
    meta: () => import('../pages/production/DashboardPage').then((m) => m.DEV_META_DASHBOARD),
    render: (ctx) => <DashboardPage onNavigate={ctx.navigate} viewState={ctx.viewState} driveMode={ctx.driveMode} onOpenCounsel={ctx.openCounsel} />,
  },
  script: {
    meta: () => import('../pages/production/ScriptListPage').then((m) => m.DEV_META_SCRIPT_LIST),
    render: (ctx) => <ScriptListPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'script-detail': {
    meta: () => import('../pages/production/ScriptDetailPage').then((m) => m.DEV_META_SCRIPT_DETAIL),
    render: (ctx) => <ScriptDetailPage onNavigate={ctx.navigate} viewState={ctx.viewState} driveMode={ctx.driveMode} onDriveModeChange={ctx.onDriveModeChange} />,
  },
  storyboard: {
    meta: () => import('../pages/production/StoryboardPage').then((m) => m.DEV_META_STORYBOARD),
    render: (ctx) => <StoryboardPage onNavigate={ctx.navigate} viewState={ctx.viewState} onOpenCounsel={ctx.openCounsel} />,
  },
  assets: {
    meta: () => import('../pages/production/AssetsPage').then((m) => m.DEV_META_ASSETS),
    render: (ctx) => <AssetsPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  production: {
    meta: () => import('../pages/production/BatchProductionPage').then((m) => m.DEV_META_PRODUCTION),
    render: (ctx) => <BatchProductionPage onNavigate={ctx.navigate} viewState={ctx.viewState} driveMode={ctx.driveMode} onDriveModeChange={ctx.onDriveModeChange} onOpenCounsel={ctx.openCounsel} />,
  },
  tasks: {
    meta: () => import('../pages/production/TasksPage').then((m) => m.DEV_META_TASKS),
    render: (ctx) => <TasksPage onNavigate={ctx.navigate} viewState={ctx.viewState} onOpenCognitionWidget={ctx.openCognition} />,
  },
  qa: {
    meta: () => import('../pages/production/QualityAssurancePage').then((m) => m.DEV_META_QA),
    render: (ctx) => <QualityAssurancePage onNavigate={ctx.navigate} viewState={ctx.viewState} onOpenCounsel={ctx.openCounsel} />,
  },
  library: {
    meta: () => import('../pages/production/LibraryPage').then((m) => m.DEV_META_LIBRARY),
    render: (ctx) => <LibraryPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'assets-consistency': {
    meta: () => import('../pages/production/ConsistencyTrainingPage').then((m) => m.DEV_META_CONSISTENCY),
    render: (ctx) => <ConsistencyTrainingPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  voice: {
    meta: () => import('../pages/production/VoiceStudioPage').then((m) => m.DEV_META_VOICE),
    render: (ctx) => <VoiceStudioPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'storyboard-3d': {
    meta: () => import('../pages/production/Storyboard3DPage').then((m) => m.DEV_META_3D),
    render: (ctx) => <Storyboard3DPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  video: {
    meta: () => import('../pages/editing/TimelineEditorPage').then((m) => m.DEV_META_TIMELINE),
    render: (ctx) => <TimelineEditorPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'video-templates': {
    meta: () => import('../pages/editing/VideoTemplatesPage').then((m) => m.DEV_META_TEMPLATES),
    render: (ctx) => <VideoTemplatesPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'video-exports': {
    meta: () => import('../pages/editing/VideoExportsPage').then((m) => m.DEV_META_EXPORTS),
    render: (ctx) => <VideoExportsPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  music: {
    meta: () => import('../pages/editing/MusicLibraryPage').then((m) => m.DEV_META_MUSIC),
    render: (ctx) => <MusicLibraryPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'video-compare': {
    meta: () => import('../pages/editing/VideoComparePage').then((m) => m.DEV_META_COMPARE),
    render: (ctx) => <VideoComparePage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'video-ad': {
    meta: () => import('../pages/editing/VideoAdPage').then((m) => m.DEV_META_AD),
    render: (ctx) => <VideoAdPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  project: {
    meta: () => import('../pages/management/ProjectSeriesPage').then((m) => m.DEV_META_PROJECT),
    render: (ctx) => <ProjectSeriesPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  analytics: {
    meta: () => import('../pages/management/AnalyticsPage').then((m) => m.DEV_META_ANALYTICS),
    render: (ctx) => <AnalyticsPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  cost: {
    meta: () => import('../pages/management/CostCenterPage').then((m) => m.DEV_META_COST),
    render: (ctx) => <CostCenterPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  admin: {
    meta: () => import('../pages/management/AdminPermissionPage').then((m) => m.DEV_META_ADMIN),
    render: (ctx) => <AdminPermissionPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'project-lore': {
    meta: () => import('../pages/management/ProjectLorePage').then((m) => m.DEV_META_LORE),
    render: (ctx) => <ProjectLorePage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  collab: {
    meta: () => import('../pages/management/CollabCommentsPage').then((m) => m.DEV_META_COLLAB),
    render: (ctx) => <CollabCommentsPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'admin-agents': {
    meta: () => import('../pages/management/AdminAgentsPage').then((m) => m.DEV_META_AGENTS),
    render: (ctx) => <AdminAgentsPage onNavigate={ctx.navigate} viewState={ctx.viewState} onOpenCognitionWidget={ctx.openCognition} />,
  },
  'admin-rag': {
    meta: () => import('../pages/management/AdminRagPage').then((m) => m.DEV_META_RAG),
    render: (ctx) => <AdminRagPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'admin-compliance': {
    meta: () => import('../pages/management/AdminCompliancePage').then((m) => m.DEV_META_COMPLIANCE),
    render: (ctx) => <AdminCompliancePage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  publish: {
    meta: () => import('../pages/publishing/PublishWizardPage').then((m) => m.DEV_META_PUBLISH),
    render: (ctx) => <PublishWizardPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'publish-accounts': {
    meta: () => import('../pages/publishing/PublishAccountsPage').then((m) => m.DEV_META_ACCOUNTS),
    render: (ctx) => <PublishAccountsPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'publish-board': {
    meta: () => import('../pages/publishing/PublishBoardPage').then((m) => m.DEV_META_PUBLISH_BOARD),
    render: (ctx) => <PublishBoardPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  family: {
    meta: () => import('../pages/special/ClockHubPage').then((m) => m.DEV_META_CLOCK_HUB),
    render: (ctx) => <ClockHubPage onNavigate={ctx.navigate} onOpenCognitionWidget={ctx.openCognition} />,
  },
  // Figma 规范页复用工作台元数据（与原注册表一致）
  'figma-tokens': {
    meta: () => import('../pages/production/DashboardPage').then((m) => m.DEV_META_DASHBOARD),
    render: (ctx) => <FigmaTokensPage onNavigate={ctx.navigate} />,
  },
  'figma-components': {
    meta: () => import('../pages/production/DashboardPage').then((m) => m.DEV_META_DASHBOARD),
    render: (ctx) => <FigmaComponentsPage onNavigate={ctx.navigate} onOpenCounsel={ctx.openCounsel} />,
  },
  'auth-login': {
    meta: () => import('../pages/auth/LoginPage').then((m) => m.DEV_META_LOGIN),
    render: (ctx) => <LoginPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-register': {
    meta: () => import('../pages/auth/RegisterPage').then((m) => m.DEV_META_REGISTER),
    render: (ctx) => <RegisterPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-forgot': {
    meta: () => import('../pages/auth/ForgotPasswordPage').then((m) => m.DEV_META_FORGOT),
    render: (ctx) => <ForgotPasswordPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-reset': {
    meta: () => import('../pages/auth/ResetPasswordPage').then((m) => m.DEV_META_RESET),
    render: (ctx) => <ResetPasswordPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-mfa': {
    meta: () => import('../pages/auth/MfaPage').then((m) => m.DEV_META_MFA),
    render: (ctx) => <MfaPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-invite': {
    meta: () => import('../pages/auth/InviteLandingPage').then((m) => m.DEV_META_INVITE),
    render: (ctx) => <InviteLandingPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-onboarding': {
    meta: () => import('../pages/auth/OnboardingPage').then((m) => m.DEV_META_ONBOARDING),
    render: (ctx) => <OnboardingPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
  'auth-expired': {
    meta: () => import('../pages/auth/SessionExpiredAndForbiddenPage').then((m) => m.DEV_META_EXPIRED_403),
    render: (ctx) => <SessionExpiredAndForbiddenPage onNavigate={ctx.navigate} viewState={ctx.viewState} initialMode="expired" />,
  },
  'auth-403': {
    meta: () => import('../pages/auth/SessionExpiredAndForbiddenPage').then((m) => m.DEV_META_EXPIRED_403),
    render: (ctx) => <SessionExpiredAndForbiddenPage onNavigate={ctx.navigate} viewState={ctx.viewState} initialMode="403" />,
  },
  'auth-locked': {
    meta: () => import('../pages/auth/AccountLockedPage').then((m) => m.DEV_META_LOCKED),
    render: (ctx) => <AccountLockedPage onNavigate={ctx.navigate} viewState={ctx.viewState} />,
  },
};

/** 注册表键序（App/测试遍历用；顺序与 PageId 声明一致） */
export const PAGE_IDS = Object.keys(REGISTRY) as PageId[];

/** 取页面注册项；未登记 PageId 在编译期即被 Record 类型拦截 */
export function getPageEntry(pageId: PageId): PageEntry {
  return REGISTRY[pageId];
}

/** auth 域页面标识（模板字面量收窄） */
export type AuthPageId = PageId & `auth-${string}`;

export function isAuthPageId(id: PageId): id is AuthPageId {
  return id.startsWith('auth-');
}

/** auth 切换器标签：映射类型过滤强制覆盖全部 auth 页面（新增 auth 页漏配 = 编译错误） */
const AUTH_LABELS: { [K in PageId as K extends `auth-${string}` ? K : never]: string } = {
  'auth-login': 'A01登录',
  'auth-register': 'A02注册',
  'auth-forgot': 'A03找回',
  'auth-reset': 'A04重置',
  'auth-mfa': 'A05双验',
  'auth-invite': 'A06邀请',
  'auth-onboarding': 'A07引导',
  'auth-expired': 'A08过期',
  'auth-403': 'A08-403',
  'auth-locked': 'A09锁定',
};

/** auth 切换器渲染项（顺序即 REGISTRY auth 键序，App 侧 map 派生渲染，消除第二事实源） */
export const AUTH_PAGE_ITEMS: ReadonlyArray<{ id: AuthPageId; label: string }> = PAGE_IDS.filter(isAuthPageId).map(
  (id) => ({ id, label: AUTH_LABELS[id] }),
);

/** 侧边栏导航项规格（纯数据；icon 留在表现层组件） */
export interface NavItemSpec {
  id: PageId;
  label: string;
  badge?: string;
}

/** 侧边栏分组规格 */
export interface NavGroupSpec {
  id: string;
  name: string;
  color: string;
  items: NavItemSpec[];
}

/** 侧边栏导航单源（5 组 39 项）——新页面漏配侧栏由 registry.test 完备性契约拦截 */
export const NAV_GROUPS: readonly NavGroupSpec[] = [
  {
    id: 'prod',
    name: '生产全链路',
    color: DOMAIN_COLORS.production.color,
    items: [
      { id: 'dashboard', label: '工作台首页' },
      { id: 'script', label: '剧本工作台', badge: 'P0' },
      { id: 'script-detail', label: '剧本编辑详情' },
      { id: 'storyboard', label: '分镜设计器', badge: '12列' },
      { id: 'assets', label: '资产中心' },
      { id: 'production', label: '批量生成任务台' },
      { id: 'tasks', label: '任务队列监控', badge: '9步' },
      { id: 'qa', label: '质检门禁看板', badge: '红线' },
      { id: 'library', label: 'IP 素材源站库' },
      { id: 'assets-consistency', label: '角色一致性训练' },
      { id: 'voice', label: '配音导演台' },
      { id: 'storyboard-3d', label: '3D 导演视角' },
    ],
  },
  {
    id: 'edit',
    name: '剪辑合并',
    color: DOMAIN_COLORS.editing.color,
    items: [
      { id: 'video', label: '时间线编辑器', badge: '4轨' },
      { id: 'video-templates', label: '模板中心' },
      { id: 'video-exports', label: '渲染导出' },
      { id: 'music', label: 'BGM 情绪库' },
      { id: 'video-compare', label: '版本对比 Diff' },
      { id: 'video-ad', label: '广告与商业化' },
    ],
  },
  {
    id: 'mgmt',
    name: '平台管理',
    color: DOMAIN_COLORS.management.color,
    items: [
      { id: 'project', label: '项目剧集中心' },
      { id: 'analytics', label: '运营数据看板', badge: '反哺' },
      { id: 'cost', label: '成本中心', badge: '≤2元' },
      { id: 'admin', label: '权限与审计' },
      { id: 'project-lore', label: '世界观知识图谱' },
      { id: 'collab', label: '协作与评论中心' },
      { id: 'admin-agents', label: '智能体训练中心', badge: '核心' },
      { id: 'admin-rag', label: 'RAG 与知识库' },
      { id: 'admin-compliance', label: '合规与版权中心' },
    ],
  },
  {
    id: 'push',
    name: '一键推送',
    color: DOMAIN_COLORS.publishing.color,
    items: [
      { id: 'publish', label: '多平台分发向导' },
      { id: 'publish-accounts', label: '账号矩阵管理' },
      { id: 'publish-board', label: '发布状态看板' },
    ],
  },
  {
    id: 'auth',
    name: 'Auth 鉴权域',
    color: '#00e0b8',
    items: [
      { id: 'auth-login', label: 'A01 登录入口', badge: 'P0' },
      { id: 'auth-register', label: 'A02 注册向导', badge: 'P0' },
      { id: 'auth-forgot', label: 'A03 找回密码' },
      { id: 'auth-reset', label: 'A04 重置密码' },
      { id: 'auth-mfa', label: 'A05 二次验证 MFA', badge: 'P0' },
      { id: 'auth-invite', label: 'A06 团队邀请' },
      { id: 'auth-onboarding', label: 'A07 首次引导', badge: '4步' },
      { id: 'auth-expired', label: 'A08 过期与 403' },
      { id: 'auth-locked', label: 'A09 账号锁定' },
    ],
  },
];

/** DevMode 元数据兜底（页面 chunk 加载完成前/失败时展示；apiEndpoint 无 ENDPOINTS 对应键，遥测端点未定型） */
export const DEV_META_FALLBACK: DevModeMeta = {
  apiEndpoint: '/api/v2/factory/telemetry',
  confidenceSource: 'Dev Mode Inspector 元数据按需加载中',
  memoryScope: 'session',
  driveModePolicy: '页面 chunk 加载完成后注入真实驾驶模式策略',
  stateSwitchConditions: {
    empty: '加载完成后展示',
    loading: '加载完成后展示',
    error: '加载完成后展示',
    forbidden: '加载完成后展示',
  },
};
