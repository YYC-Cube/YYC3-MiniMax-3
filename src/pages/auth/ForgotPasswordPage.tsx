/**
 * @file: ForgotPasswordPage.tsx
 * @description: 页面组件：ForgotPasswordPage
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
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Info,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { AUTH_TOKENS } from '../../tokens';

interface ForgotPasswordPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_FORGOT: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/forgot-password',
  confidenceSource: '智云·守护 (安全防撞库机制 · 无论邮箱是否存在均呈现发送成功态)',
  memoryScope: 'session',
  learningSampleSource: '高频密码重置请求与 IP 暴力探测行为识别',
  driveModePolicy: '单邮箱 24 小时限额 5 次重置请求；重置链接有效期 30 分钟',
  stateSwitchConditions: {
    empty: '输入工作邮箱初始态',
    loading: '高密加密 Token 生成与 SMTP 邮件队列派发中',
    error: '邮箱格式校验不通过 (INVALID_EMAIL_FORMAT)',
    forbidden: '该 IP 请求频次超限，限制发起密码重置请求',
  },
};

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setResendCooldown(60);
    }, 700);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* Central Subtle Radial Glow (Accent 5%, radius 600px) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 224, 184, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Centered Form Card (Width 440px, rounded-2xl 16px, pad 40px) */}
      <div
        className="w-full max-w-[440px] rounded-2xl p-9 border shadow-2xl relative z-10 transition-all duration-200"
        style={{
          backgroundColor: AUTH_TOKENS.formCard,
          borderColor: 'rgba(0, 224, 184, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {isSent ? (
          /* Success View */
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.15)] text-[#22C55E] flex items-center justify-center mx-auto border border-[#22C55E]/30 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e8f0f8] tracking-tight">重置链接已发送</h2>
              <p className="text-xs text-[#8a97a8] mt-1.5 leading-relaxed">
                请查收发送至 <strong className="text-[#00e0b8] font-mono">{email.replace(/(.{2})(.*)(?=@)/, '$1***')}</strong> 的邮件。
                链接在 30 分钟内有效。
              </p>
            </div>

            <div className="pt-3 space-y-2.5">
              <button
                type="button"
                onClick={() => onNavigate('auth-reset')}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-md shadow-teal-950/40"
              >
                模拟打开邮件重置链接 →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] text-xs transition-colors cursor-pointer"
              >
                返回登录
              </button>
            </div>
          </div>
        ) : (
          /* Input Form View */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Icon with Cyan Glow Ring */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[rgba(0,224,184,0.3)] text-[#00e0b8]"
                style={{
                  backgroundColor: 'rgba(0, 224, 184, 0.08)',
                  boxShadow: '0 0 20px rgba(0, 224, 184, 0.2)',
                }}
              >
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#e8f0f8] tracking-tight">找回密码</h1>
                <p className="text-xs text-[#8a97a8] mt-1 leading-relaxed">
                  输入注册工作邮箱，我们将发送重置链接。<br />链接有效期为 30 分钟。
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                <Mail className="w-4 h-4 text-[#5c697a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的注册邮箱"
                  className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0a1628] border-t-transparent animate-spin" />
                  <span>正在发送...</span>
                </>
              ) : (
                <span>发送重置链接</span>
              )}
            </button>

            {/* Back to Login */}
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

            {/* Bottom Troubleshooting Help Card */}
            <div className="p-3.5 rounded-xl bg-[#152640] border border-[rgba(255,255,255,0.06)] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#00B4D8] font-medium">
                <Info className="w-3.5 h-3.5" />
                <span>收不到重置邮件？</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#8a97a8] pl-5 list-disc leading-relaxed">
                <li>请检查垃圾邮件与订阅文件夹</li>
                <li>确认输入的邮箱拼写是否完全正确</li>
                <li>企业专属域名邮箱可能需网管放行系统通知</li>
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
