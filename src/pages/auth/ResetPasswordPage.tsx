/**
 * @file: ResetPasswordPage.tsx
 * @description: 页面组件：ResetPasswordPage
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
  LockKeyhole,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { AUTH_TOKENS } from '../../tokens';

interface ResetPasswordPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_RESET: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/reset-password',
  confidenceSource: '智云·守护 (Token 密签校验与单次使用作废机制)',
  memoryScope: 'session',
  learningSampleSource: '重置令牌生命周期与会话并发清理记录',
  driveModePolicy: '重置成功后自动作废该用户所有终端现有活跃 Session',
  stateSwitchConditions: {
    empty: '输入新密码初始态',
    loading: '密码哈希重算与旧会话全局吊销中',
    error: '两次输入新密码不一致或不符合强度规则',
    forbidden: '重置 Token 已过期（超过 30 分钟）或已被使用',
  },
};

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [simState, setSimState] = useState<ViewState>(viewState);

  const isTokenExpired = simState === 'forbidden';

  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUpperLower, hasNumber, hasSymbol].filter(Boolean).length;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (strengthScore < 3 || !passwordsMatch) return;
    onNavigate('auth-login');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* Central Subtle Purple Radial Glow (Process 5%, 600px) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(157, 124, 216, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* State Simulator */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-20">
        <span className="text-[#5c697a] px-1">状态:</span>
        <button
          type="button"
          onClick={() => setSimState('normal')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            simState === 'normal' ? 'bg-[#9d7cd8] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          正常重置
        </button>
        <button
          type="button"
          onClick={() => setSimState('forbidden')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            simState === 'forbidden' ? 'bg-[#ff7a45] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          链接已失效
        </button>
      </div>

      {/* Form Card (Width 440px) */}
      <div
        className="w-full max-w-[440px] rounded-2xl p-9 border shadow-2xl relative z-10 transition-all duration-200"
        style={{
          backgroundColor: AUTH_TOKENS.formCard,
          borderColor: isTokenExpired ? '#ff7a45' : 'rgba(157, 124, 216, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {isTokenExpired ? (
          /* Expired State View */
          <div className="text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(255,122,69,0.15)] text-[#ff7a45] flex items-center justify-center mx-auto border border-[#ff7a45]/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e8f0f8]">链接已失效</h2>
              <p className="text-xs text-[#8a97a8] mt-1.5 leading-relaxed">
                重置链接有效期为 30 分钟且仅可使用一次。<br />请重新发起找回密码申请。
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('auth-forgot')}
                className="w-full py-2.5 rounded-lg bg-[#ff7a45] hover:bg-[#e66c3c] text-white font-bold text-xs cursor-pointer shadow-md"
              >
                重新申请重置链接
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#8a97a8] text-xs cursor-pointer"
              >
                返回登录
              </button>
            </div>
          </div>
        ) : (
          /* Normal Reset Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Top Icon with Purple Glow Ring */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#9d7cd8]/40 text-[#9d7cd8]"
                style={{
                  backgroundColor: 'rgba(157, 124, 216, 0.1)',
                  boxShadow: '0 0 20px rgba(157, 124, 216, 0.25)',
                }}
              >
                <LockKeyhole className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#e8f0f8] tracking-tight">设置新密码</h1>
                <p className="text-xs text-[#8a97a8] mt-1">
                  为账号 <strong className="text-[#00e0b8] font-mono">di***@0379.email</strong> 设置新密码
                </p>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[#8a97a8] text-[11px] block">新密码:</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#9d7cd8]">
                <Lock className="w-4 h-4 text-[#5c697a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="输入不少于 8 位的新密码"
                  className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#5c697a] hover:text-[#9d7cd8]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Strength Bar & Rules */}
              {newPassword.length > 0 && (
                <div className="p-2.5 rounded-lg bg-[#0a1628] space-y-2 border border-[rgba(255,255,255,0.04)]">
                  <div className="grid grid-cols-4 gap-1">
                    <div className={`h-1 rounded-full ${strengthScore >= 1 ? 'bg-[#FF4422]' : 'bg-[#152640]'}`} />
                    <div className={`h-1 rounded-full ${strengthScore >= 2 ? 'bg-[#FFB020]' : 'bg-[#152640]'}`} />
                    <div className={`h-1 rounded-full ${strengthScore >= 3 ? 'bg-[#00B4D8]' : 'bg-[#152640]'}`} />
                    <div className={`h-1 rounded-full ${strengthScore >= 4 ? 'bg-[#22C55E]' : 'bg-[#152640]'}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#8a97a8]">
                    <div className="flex items-center gap-1">
                      {hasMinLength ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                      <span>至少 8 位</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasUpperLower ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                      <span>大小写字母</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1 text-xs">
              <span className="text-[#8a97a8] text-[11px] block">确认新密码:</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#9d7cd8]">
                <Lock className="w-4 h-4 text-[#5c697a]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入新密码"
                  className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none font-mono"
                />
                {confirmPassword.length > 0 && (
                  <span>
                    {passwordsMatch ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    ) : (
                      <span className="text-[10px] text-[#ff4422] font-mono">不一致</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={strengthScore < 2 || !passwordsMatch}
              className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              重置密码并直接登录
            </button>

            {/* Back to Login Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="text-xs text-[#8a97a8] hover:text-[#00e0b8] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回登录</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
