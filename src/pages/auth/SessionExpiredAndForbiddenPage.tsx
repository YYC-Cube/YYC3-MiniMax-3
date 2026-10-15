/**
 * @file: SessionExpiredAndForbiddenPage.tsx
 * @description: 页面组件：SessionExpiredAndForbiddenPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState } from 'react';
import {
  Clock,
  ShieldOff,
  RotateCcw,
  ArrowLeft,
  Lock,
  Mail,
  FileText,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { AUTH_TOKENS } from '../../tokens';

interface SessionExpiredAndForbiddenPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  initialMode?: 'expired' | '403';
}

export const DEV_META_EXPIRED_403: DevModeMeta = {
  apiEndpoint: 'GET /api/auth/session/status',
  confidenceSource: '智云·守护 (JWT 会话超时验签与 RBAC 访问控制策略引擎)',
  memoryScope: 'session',
  learningSampleSource: '未保存临时状态快照自动暂存至本地 IndexedDB',
  driveModePolicy: '会话失效自动保留本地草稿数据，重新授权后无缝复原工作台',
  stateSwitchConditions: {
    empty: '正常会话有效态',
    loading: '校验会话 Token 签名与续期握手中',
    error: '网络异常导致会话状态拉取失败',
    forbidden: '403 Forbidden: 用户角色缺少目标功能模块授权',
  },
};

export const SessionExpiredAndForbiddenPage: React.FC<SessionExpiredAndForbiddenPageProps> = ({
  onNavigate,
  viewState = 'normal',
  initialMode = 'expired',
}) => {
  const [mode, setMode] = useState<'expired' | '403'>(initialMode);
  const [simState, setSimState] = useState<ViewState>(viewState);

  const isLoading = simState === 'loading';
  const isNetworkError = simState === 'error';

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${
            mode === 'expired' ? 'rgba(255, 122, 69, 0.06)' : 'rgba(255, 68, 34, 0.08)'
          } 0%, transparent 70%)`,
        }}
      />

      {/* Mode Switcher for Figma Dev Validation */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-30">
        <span className="text-[#5c697a] px-1">模式切换:</span>
        <button
          type="button"
          onClick={() => setMode('expired')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            mode === 'expired' ? 'bg-[#ff7a45] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          会话过期 (Expired)
        </button>
        <button
          type="button"
          onClick={() => setMode('403')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            mode === '403' ? 'bg-[#ff4422] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          无权限 (403 Forbidden)
        </button>
      </div>

      {/* Centered Form Card (Width 480px, pad 48px) */}
      <div
        className="w-full max-w-[480px] rounded-2xl p-6 sm:p-10 border shadow-2xl relative z-10 transition-all duration-200"
        style={{
          backgroundColor: AUTH_TOKENS.formCard,
          borderColor: mode === 'expired' ? 'rgba(255, 122, 69, 0.3)' : 'rgba(255, 68, 34, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {isLoading ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#00e0b8] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#8a97a8]">正在校验会话状态与权限令牌...</p>
          </div>
        ) : isNetworkError ? (
          <div className="text-center py-8 space-y-4">
            <AlertTriangle className="w-12 h-12 text-[#ff7a45] mx-auto" />
            <h2 className="text-base font-bold text-[#e8f0f8]">网络状态异常</h2>
            <p className="text-xs text-[#8a97a8]">无法连接鉴权服务器，请检查本地网络。</p>
            <button
              type="button"
              onClick={() => setSimState('normal')}
              className="px-4 py-2 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold text-xs"
            >
              重试连线
            </button>
          </div>
        ) : mode === 'expired' ? (
          /* ============================================================== */
          /* Expired Mode View                                             */
          /* ============================================================== */
          <div className="text-center space-y-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-[#ff7a45]/40 text-[#ff7a45]"
              style={{
                backgroundColor: 'rgba(255, 122, 69, 0.12)',
                boxShadow: '0 0 24px rgba(255, 122, 69, 0.25)',
              }}
            >
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#e8f0f8] tracking-tight">登录已过期</h1>
              <p className="text-xs text-[#8a97a8] leading-relaxed">
                为了剧目数据安全，当前会话已超时失效。<br />请重新登录以同步最新的产线状态。
              </p>
            </div>

            {/* Unsaved Draft Recovery Card */}
            <div className="p-3.5 rounded-xl bg-[#152640] border border-[rgba(0,224,184,0.25)] text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00e0b8] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>检测到一段未保存的剧本草稿</span>
                </span>
                <span className="text-[10px] font-mono text-[#8a97a8]">已本地缓存</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#e8f0f8]">《雨夜霓虹》第 3 集 · 场次 7</span>
                <button
                  type="button"
                  onClick={() => onNavigate('script')}
                  className="px-2.5 py-1 rounded bg-[#0a1628] hover:bg-[#00e0b8] hover:text-[#0a1628] text-[#00e0b8] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  恢复草稿
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40"
              >
                重新登录
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full py-2 rounded-lg text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                返回首页
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* 403 Forbidden Mode View                                       */
          /* ============================================================== */
          <div className="text-center space-y-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-[#ff4422]/40 text-[#ff4422]"
              style={{
                backgroundColor: 'rgba(255, 68, 34, 0.12)',
                boxShadow: '0 0 24px rgba(255, 68, 34, 0.25)',
              }}
            >
              <ShieldOff className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#e8f0f8] tracking-tight">
                你没有访问此页面的权限
              </h1>
              <p className="text-xs text-[#8a97a8] leading-relaxed">
                当前角色为 <strong className="text-[#00e0b8]">专业剪辑 (Editor)</strong>，无法访问权限配置与财务审计模块。
              </p>
            </div>

            {/* Required Permissions Info Card */}
            <div className="p-3.5 rounded-xl bg-[#152640] border border-[rgba(255,255,255,0.06)] text-left space-y-2 text-xs">
              <span className="font-bold text-[#e8f0f8] block">你需要联系管理员开通以下权限:</span>
              <ul className="space-y-1.5 text-[11px] text-[#8a97a8]">
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff4422]" />
                  <span>管理域：RBAC 组织权限与角色矩阵分配</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff4422]" />
                  <span>管理域：成本中心 DGX 瓦特电价账单审计</span>
                </li>
              </ul>
              <div className="pt-1 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px]">
                <span className="text-[#5c697a]">组织管理员: 王总监</span>
                <a
                  href="mailto:admin@0379.email"
                  className="text-[#00e0b8] hover:underline"
                >
                  admin@0379.email
                </a>
              </div>
            </div>

            {/* Dual Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                回到工作台首页
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 py-2.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] text-xs transition-colors cursor-pointer"
              >
                返回上一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionExpiredAndForbiddenPage;
