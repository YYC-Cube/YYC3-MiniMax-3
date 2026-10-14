/**
 * @file: AccountLockedPage.tsx
 * @description: 页面组件：AccountLockedPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState, useEffect } from 'react';
import {
  Lock,
  UserX,
  AlertCircle,
  Clock,
  Mail,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { AUTH_TOKENS } from '../../tokens';

interface AccountLockedPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  initialVariant?: 'locked' | 'deactivated';
}

export const DEV_META_LOCKED: DevModeMeta = {
  apiEndpoint: 'GET /api/auth/account/lock-status',
  confidenceSource: '智云·守护 (高危暴力防爆破熔断机制 · 5 次失败自动冻结 15m)',
  memoryScope: 'session',
  learningSampleSource: '黑客字典撞库攻击与异常 IP 封锁记录',
  driveModePolicy: '锁定期间正在进行的流水线任务由元启·天枢托管执行，不受影响',
  stateSwitchConditions: {
    empty: '正常未锁定态',
    loading: '锁定剩余倒计时时钟同步中',
    error: '申诉服务工单网关超时',
    forbidden: '账号被系统管理员永久封禁，禁止自助申诉',
  },
};

export const AccountLockedPage: React.FC<AccountLockedPageProps> = ({
  onNavigate,
  viewState = 'normal',
  initialVariant = 'locked',
}) => {
  const [variant, setVariant] = useState<'locked' | 'deactivated'>(initialVariant);
  const [timeLeft, setTimeLeft] = useState(872); // seconds (approx 14:32)

  useEffect(() => {
    if (timeLeft > 0 && variant === 'locked') {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, variant]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* Background Danger Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 68, 34, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Switcher for Figma Dev Validation */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-30">
        <span className="text-[#5c697a] px-1">变体:</span>
        <button
          type="button"
          onClick={() => setVariant('locked')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            variant === 'locked' ? 'bg-[#ff4422] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          连续失败锁定
        </button>
        <button
          type="button"
          onClick={() => setVariant('deactivated')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            variant === 'deactivated' ? 'bg-[#ff7a45] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          管理员主动停用
        </button>
      </div>

      {/* Centered Form Card (Width 480px, pad 40px) */}
      <div
        className="w-full max-w-[480px] rounded-2xl p-9 border shadow-2xl relative z-10 transition-all duration-200"
        style={{
          backgroundColor: AUTH_TOKENS.formCard,
          borderColor: 'rgba(255, 68, 34, 0.35)',
          boxShadow: '0 8px 32px rgba(255, 68, 34, 0.15), 0 0 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        {variant === 'locked' ? (
          /* Variant 1: 5 Consecutive Failures Lockout */
          <div className="text-center space-y-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-[#ff4422]/40 text-[#ff4422]"
              style={{
                backgroundColor: 'rgba(255, 68, 34, 0.12)',
                boxShadow: '0 0 24px rgba(255, 68, 34, 0.3)',
              }}
            >
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#e8f0f8] tracking-tight">账号已锁定</h1>
              <p className="text-xs text-[#8a97a8]">连续 5 次认证失败，为保护剧组资产已临时锁定</p>
            </div>

            {/* Countdown Display Card */}
            <div className="p-4 rounded-xl bg-[#152640] border border-[rgba(255,68,34,0.3)] space-y-1">
              <span className="text-3xl font-bold font-mono text-[#ff4422] tabular-nums block">
                {timeFormatted}
              </span>
              <span className="text-[11px] text-[#8a97a8]">锁定解除后可重新输入凭证登录</span>
            </div>

            {/* Explanations List */}
            <div className="p-3.5 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-left space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#8a97a8]">
                <AlertCircle className="w-3.5 h-3.5 text-[#ff4422] shrink-0 mt-0.5" />
                <span>锁定期间所有现存已登录会话已全部强制下线失效。</span>
              </div>
              <div className="flex items-start gap-2 text-[#8a97a8]">
                <Clock className="w-3.5 h-3.5 text-[#00e0b8] shrink-0 mt-0.5" />
                <span>正在后台运行的漫剧渲染任务不受影响，仍将正常交付完成。</span>
              </div>
              <div className="flex items-start gap-2 text-[#8a97a8]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FFB020] shrink-0 mt-0.5" />
                <span>如非您本人操作，可能存在撞库攻击风险，请联系管理员重置。</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('collab')}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40"
              >
                联系管理员解锁 (admin@0379.email)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2 rounded-lg text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                返回登录页面
              </button>
            </div>
          </div>
        ) : (
          /* Variant 2: Deactivated by Admin */
          <div className="text-center space-y-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-[#ff7a45]/40 text-[#ff7a45]"
              style={{
                backgroundColor: 'rgba(255, 122, 69, 0.12)',
                boxShadow: '0 0 24px rgba(255, 122, 69, 0.25)',
              }}
            >
              <UserX className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#e8f0f8] tracking-tight">账号已被停用</h1>
              <p className="text-xs text-[#8a97a8]">该账号已被企业系统管理员停用，如有疑问请提交申诉</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#152640] border border-[rgba(255,255,255,0.06)] text-xs font-mono text-[#8a97a8]">
              停用生效时间：<strong className="text-[#e8f0f8]">2026-10-11 09:24:10</strong>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                className="w-full py-2.5 rounded-lg bg-[#ff7a45] hover:bg-[#e66c3c] text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                提交工单申诉
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2 rounded-lg text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                返回登录
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLockedPage;
