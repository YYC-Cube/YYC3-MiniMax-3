/**
 * @file: LoginPage.tsx
 * @description: 页面组件：LoginPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  LockKeyhole,
  Mail
} from 'lucide-react';
import React, { useState } from 'react';
import AuthBrandClock from '../../components/auth/AuthBrandClock';
import BrandMark from '../../components/common/BrandMark';
import { APP_BRAND_LINE, APP_SHORT_NAME } from '../../config/brand';
import { AUTH_TOKENS } from '../../tokens';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface LoginPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_LOGIN: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/login',
  confidenceSource: '智云·守护 (安全风控凭证校验引擎) + Redis 登录尝试速率限制',
  memoryScope: 'session',
  learningSampleSource: '异常 IP 撞库与防暴力破解威胁情报库',
  driveModePolicy: '连续 5 次认证失败强制锁定账号 15 分钟并触发 A09 熔断',
  stateSwitchConditions: {
    empty: '正常输入态 (默认)',
    loading: '用户凭证验签与 OAuth SSO 双向握手校验中',
    error: '账号或密码不正确（提示剩余尝试次数，带震动与红色边框）',
    forbidden: '账号被系统管理员手动停用或组织已被冻结',
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [account, setAccount] = useState('director.wang@0379.email');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Allow switching local simulation states
  const [simState, setSimState] = useState<ViewState>(viewState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to MFA or dashboard
      onNavigate('auth-mfa');
    }, 800);
  };

  const isLocked = simState === 'forbidden';
  const isError = simState === 'error';
  const isLoading = simState === 'loading' || isSubmitting;

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row select-none overflow-y-auto lg:overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* ============================================================== */}
      {/* LEFT 55% · Brand Showcase Zone (792px on 1440px canvas)       */}
      {/* ============================================================== */}
      <div
        className="w-full lg:w-[55%] relative flex flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-20 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)]"
        style={{
          backgroundColor: AUTH_TOKENS.canvasLeft,
        }}
      >
        {/* Two Ambient Radial Glows */}
        <div
          className="absolute -bottom-24 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${AUTH_TOKENS.glow1} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${AUTH_TOKENS.glow2} 0%, transparent 70%)`,
          }}
        />

        {/* 1. Top Brand Logo & Subtitle */}
        <div className="z-10 flex items-center gap-3">
          <BrandMark variant="mark" size={32} />
          <div className="h-5 w-px bg-[rgba(255,255,255,0.15)]" />
          <span className="text-xs text-[#8a97a8] tracking-wider uppercase font-mono">
            {APP_BRAND_LINE}
          </span>
        </div>

        {/* 2. Center Visual: AI Family Chrono Clock Dial (360px) & Slogans */}
        <div className="z-10 my-6 lg:my-auto flex flex-col items-center text-center max-w-[540px] w-full mx-auto">
          {/* Chronograph Radar Ring（fluid：移动端按屏宽收缩） */}
          <AuthBrandClock diameter={340} variant="running" activeAgentId="yushu-wanwu" fluid />

          {/* Slogans */}
          <div className="mt-6 lg:mt-8 space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#e8f0f8] tracking-tight">
              八个 AI 伙伴，一条漫剧产线
            </h1>
            <p className="text-xs text-[#8a97a8] leading-relaxed max-w-md mx-auto">
              小说 → 剧本 → 分镜 → 图像 → 视频 → 成片 → 分发<br />
              由 {APP_SHORT_NAME} AI Family 全链路协同自主完成
            </p>
          </div>
        </div>

        {/* 3. Bottom Operational Micro Indicators & Build Info */}
        <div className="z-10 flex flex-col gap-2 pt-4 mt-6 lg:mt-0 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[11px] text-[#5c697a] block">单集核算成本</span>
              <span className="text-sm font-bold text-[#00e0b8]">¥ 1.8</span>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div>
              <span className="text-[11px] text-[#5c697a] block">质检通过率</span>
              <span className="text-sm font-bold text-[#22C55E]">94.2%</span>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div>
              <span className="text-[11px] text-[#5c697a] block">今日实测产能</span>
              <span className="text-sm font-bold text-[#00B4D8]">12 集</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#5c697a]">
            YYC³ Industrial Engine v2.0.0 · build 20261011 · DGX Cluster Active
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT 45% · Form Zone (648px on 1440px canvas)                */}
      {/* ============================================================== */}
      <div
        className="w-full lg:w-[45%] flex flex-col items-center justify-center p-4 sm:p-8 py-10 lg:py-8 relative"
        style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
      >
        {/* Quick Demo State Toggles for Figma Dev Verification */}
        <div className="relative lg:absolute lg:top-4 lg:right-6 self-end mb-4 lg:mb-0 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono">
          <span className="text-[#5c697a] px-1">状态仿真:</span>
          {(['normal', 'loading', 'error', 'forbidden'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSimState(s)}
              className={`px-2 py-0.5 rounded cursor-pointer ${simState === s
                ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              {s === 'normal' ? '默认' : s === 'loading' ? '加载' : s === 'error' ? '错误' : '停用'}
            </button>
          ))}
        </div>

        {/* Form Card (Width 400px, rounded-2xl 16px, pad 32px) */}
        <div
          className="w-full max-w-[400px] rounded-2xl p-8 border shadow-2xl relative overflow-hidden transition-all duration-200"
          style={{
            backgroundColor: AUTH_TOKENS.formCard,
            borderColor: isError ? '#ff4422' : 'rgba(0, 224, 184, 0.12)',
            boxShadow: isError
              ? '0 8px 32px rgba(255, 68, 34, 0.25)'
              : '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          {/* Top Indeterminate Loading Bar if Loading */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00e0b8] animate-pulse" />
          )}

          {/* Locked / Deactivated State (A09 Hook) */}
          {isLocked ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(255,68,34,0.15)] text-[#ff4422] flex items-center justify-center mx-auto border border-[#ff4422]/30">
                <LockKeyhole className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#e8f0f8]">账号已停用</h3>
                <p className="text-xs text-[#8a97a8] mt-1 leading-relaxed">
                  该企业账号已被安全中心停用，请联系组织管理员解锁。
                </p>
                <span className="text-[11px] font-mono text-[#00e0b8] block mt-2">
                  admin@0379.email
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSimState('normal')}
                className="w-full py-2.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] text-xs font-medium cursor-pointer transition-colors"
              >
                返回正常登录
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Card Header */}
              <div>
                <h2 className="text-lg font-bold text-[#e8f0f8] tracking-tight">登录</h2>
                <p className="text-xs text-[#8a97a8] mt-1">使用工作邮箱或手机号继续</p>
              </div>

              {/* Error Alert Bar */}
              {isError && (
                <div className="p-3 rounded-lg bg-[rgba(255,68,34,0.12)] border border-[rgba(255,68,34,0.35)] flex items-center gap-2 text-xs text-[#ff4422] animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>邮箱或密码不正确，还可尝试 {attemptsLeft} 次</span>
                </div>
              )}

              {/* 1. Account Input */}
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0a1628] border transition-all duration-200 ${isError
                    ? 'border-[#ff4422]'
                    : 'border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]'
                    }`}
                >
                  <Mail className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="邮箱 / 手机号"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Password Input */}
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0a1628] border transition-all duration-200 ${isError
                    ? 'border-[#ff4422]'
                    : 'border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]'
                    }`}
                >
                  <Lock className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.getModifierState('CapsLock')) {
                        setCapsLockActive(true);
                      } else {
                        setCapsLockActive(false);
                      }
                    }}
                    placeholder="密码"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#5c697a] hover:text-[#00e0b8] transition-colors p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {capsLockActive && (
                  <span className="text-[10px] text-[#FFB020] block font-mono pl-1">
                    ⚠ 大写锁定已开启 (Caps Lock)
                  </span>
                )}
              </div>

              {/* 3. Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#8a97a8] cursor-pointer hover:text-[#e8f0f8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] focus:ring-0"
                  />
                  <span>记住我 7 天</span>
                </label>

                <button
                  type="button"
                  onClick={() => onNavigate('auth-forgot')}
                  className="text-xs text-[#00e0b8] hover:underline cursor-pointer"
                >
                  忘记密码？
                </button>
              </div>

              {/* 4. Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] active:scale-[0.98] text-[#0a1628] font-bold text-xs transition-all duration-150 cursor-pointer shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0a1628] border-t-transparent animate-spin" />
                    <span>正在验证...</span>
                  </>
                ) : (
                  <span>登录</span>
                )}
              </button>

              {/* 5. OAuth Divider */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-px bg-[rgba(138,151,168,0.16)]" />
                <span className="text-[11px] text-[#5c697a] shrink-0 font-mono">
                  或使用以下方式
                </span>
                <div className="flex-1 h-px bg-[rgba(138,151,168,0.16)]" />
              </div>

              {/* 6. OAuth 3-Column Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="py-2 px-2 rounded-lg bg-[#152640] hover:bg-[#1a2f4e] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00e0b8]" />
                  <span>企业微信</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="py-2 px-2 rounded-lg bg-[#152640] hover:bg-[#1a2f4e] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00B4D8]" />
                  <span>钉钉</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="py-2 px-2 rounded-lg bg-[#152640] hover:bg-[#1a2f4e] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#9d7cd8]" />
                  <span>飞书</span>
                </button>
              </div>

              {/* 7. Bottom Registration & Enterprise Link */}
              <div className="text-center pt-2 space-y-2 text-xs">
                <div className="text-[#8a97a8]">
                  还没有账号？{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('auth-register')}
                    className="text-[#00e0b8] font-bold hover:underline cursor-pointer"
                  >
                    立即注册
                  </button>
                </div>
                <div className="text-[11px] text-[#5c697a]">
                  需要私有化企业部署？{' '}
                  <span className="text-[#8a97a8] cursor-pointer hover:underline">
                    联系销售总监
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
