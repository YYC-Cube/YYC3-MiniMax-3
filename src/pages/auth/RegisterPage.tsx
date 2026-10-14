/**
 * @file: RegisterPage.tsx
 * @description: 页面组件：RegisterPage
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Shield,
  Layers,
  ArrowRight,
  Info,
  Check,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import AuthBrandClock from '../../components/auth/AuthBrandClock';
import { AUTH_TOKENS } from '../../tokens';

interface RegisterPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_REGISTER: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/register',
  confidenceSource: '智云·守护 (安全合规校验) + 密码熵值多维检测算法 (zxcvbn)',
  memoryScope: 'session',
  learningSampleSource: '企业邀请码链路追踪与组织角色预置模版',
  driveModePolicy: '注册成功后自动引导至 A07 Onboarding 算力与 8 Agent 初始化向导',
  stateSwitchConditions: {
    empty: '新用户注册表单初始态',
    loading: '邮箱验证码校验与组织工作空间初始化中',
    error: '该工作邮箱已注册，引导前往登录或找回密码',
    forbidden: '企业邀请码失效或该域名被禁止注册',
  },
};

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [email, setEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'director' | 'editor' | 'admin' | 'ops'>('director');
  const [inviteCode, setInviteCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Local simulation state
  const [simState, setSimState] = useState<ViewState>(viewState);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (!email) return;
    setCountdown(60);
    // prefill sample code for quick testing
    setCodeDigits(['8', '4', '9', '2', '0', '1']);
  };

  const handleDigitChange = (idx: number, val: string) => {
    const updated = [...codeDigits];
    updated[idx] = val.slice(-1);
    setCodeDigits(updated);
    // auto focus next input if filled
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  // Password Strength Rules Calculation
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUpperLower, hasNumber, hasSymbol].filter(Boolean).length;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('auth-onboarding');
    }, 1300);
  };

  const roles = [
    {
      id: 'director' as const,
      name: '编导总监',
      desc: '剧本立项、分镜设计、质检门禁裁决',
      domainColor: '#00e0b8',
    },
    {
      id: 'editor' as const,
      name: '专业剪辑',
      desc: '多轨道时间线、转场特效、渲染导出',
      domainColor: '#9d7cd8',
    },
    {
      id: 'admin' as const,
      name: '系统管理',
      desc: '全局配置、RBAC权限、合规审计',
      domainColor: '#00b4d8',
    },
    {
      id: 'ops' as const,
      name: '运营发布',
      desc: '多平台矩阵分发、数据看板、反哺建议',
      domainColor: '#FF7A5C',
    },
  ];

  return (
    <div
      className="min-h-screen w-full flex select-none overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* ============================================================== */}
      {/* LEFT 55% · Brand Showcase Zone (300px Clock Ring)            */}
      {/* ============================================================== */}
      <div
        className="w-[50%] lg:w-[55%] relative flex flex-col justify-between p-14 overflow-hidden border-r border-[rgba(255,255,255,0.06)]"
        style={{ backgroundColor: AUTH_TOKENS.canvasLeft }}
      >
        <div
          className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${AUTH_TOKENS.glow1} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -top-16 -right-16 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${AUTH_TOKENS.glow2} 0%, transparent 70%)` }}
        />

        {/* Top Brand Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e0b8] via-[#00B4D8] to-[#9d7cd8] p-0.5">
            <div className="w-full h-full bg-[#071222] rounded-[6px] flex items-center justify-center font-black text-xs text-[#00e0b8]">
              YYC³
            </div>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.15)]" />
          <span className="text-xs text-[#8a97a8] tracking-wider uppercase font-mono">
            AI Family · Comic Drama
          </span>
        </div>

        {/* Center Clock Ring (Scaled to 300px) */}
        <div className="z-10 my-auto flex flex-col items-center text-center max-w-[500px] mx-auto">
          <AuthBrandClock diameter={300} variant="running" activeAgentId="chuangxiang-lingyun" />
          <div className="mt-6 space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#e8f0f8] tracking-tight">
              加入产线，只需 60 秒
            </h1>
            <p className="text-xs text-[#8a97a8] leading-relaxed max-w-sm mx-auto">
              即刻获得 8 个拟人化 AI 伙伴支持，全自动化驱动长篇网文快速出片。
            </p>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="z-10 flex items-center justify-between text-xs font-mono text-[#5c697a] pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <span>单集成本 ≤ ¥2.00 标杆</span>
          <span>双 DGX 节点已在线</span>
          <span>v2.0.0</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT 45% · Form Zone (Card width 440px)                      */}
      {/* ============================================================== */}
      <div
        className="w-[50%] lg:w-[45%] flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-y-auto"
        style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
      >
        {/* State Toggle for Figma Dev Validation */}
        <div className="absolute top-4 right-6 flex items-center gap-1 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-20">
          <span className="text-[#5c697a] px-1">状态:</span>
          {(['normal', 'loading', 'error'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSimState(s)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                simState === s
                  ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                  : 'text-[#8a97a8] hover:text-white'
              }`}
            >
              {s === 'normal' ? '默认' : s === 'loading' ? '加载' : '邮箱已占'}
            </button>
          ))}
        </div>

        {/* Form Card (Width 440px, pad 32px) */}
        <div
          className="w-full max-w-[440px] rounded-2xl p-7 border shadow-2xl relative transition-all duration-200 my-auto"
          style={{
            backgroundColor: AUTH_TOKENS.formCard,
            borderColor: simState === 'error' ? '#ff4422' : 'rgba(0, 224, 184, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          {/* Success State Overlay (1.2s then jump to A07) */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.15)] text-[#22C55E] flex items-center justify-center mx-auto border border-[#22C55E]/30 animate-pulse">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#e8f0f8]">账号创建成功</h3>
                <p className="text-xs text-[#8a97a8] mt-1">正在为你准备初始工作台与算力环境...</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                <span className="text-xs font-mono text-[#22C55E]">即将进入首次配置向导</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Header */}
              <div className="flex items-baseline justify-between pb-1">
                <h2 className="text-lg font-bold text-[#e8f0f8] tracking-tight">创建账号</h2>
                <div className="text-xs text-[#8a97a8]">
                  已有账号？{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('auth-login')}
                    className="text-[#00e0b8] font-bold hover:underline cursor-pointer"
                  >
                    直接登录
                  </button>
                </div>
              </div>

              {/* Error Alert if Email already registered */}
              {simState === 'error' && (
                <div className="p-2.5 rounded-lg bg-[rgba(255,68,34,0.12)] border border-[rgba(255,68,34,0.35)] flex items-center justify-between text-xs text-[#ff4422]">
                  <span>该工作邮箱已注册，请直接登录</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('auth-login')}
                    className="underline font-bold"
                  >
                    去登录 →
                  </button>
                </div>
              )}

              {/* 1. Email with Embedded Send Code Button */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                  <Mail className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="工作邮箱 (如 director@studio.com)"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="text-xs text-[#00e0b8] hover:underline font-mono cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {countdown > 0 ? `重新发送 (${countdown}s)` : '发送验证码'}
                  </button>
                </div>
              </div>

              {/* 2. 6-Box OTP Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] text-[#8a97a8]">6 位邮箱验证码:</span>
                  <span className="text-[10px] font-mono text-[#5c697a]">支持整串粘贴</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {codeDigits.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      className="h-11 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.1)] text-center font-mono text-base font-bold text-[#e8f0f8] focus:border-[#00e0b8] focus:outline-none focus:ring-1 focus:ring-[#00e0b8]/40"
                    />
                  ))}
                </div>
              </div>

              {/* 3. Password & 4-Segment Strength Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                  <Lock className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="设置密码"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#5c697a] hover:text-[#00e0b8]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* 4-Segment Strength Bar & Checklist */}
                {password.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#0a1628] space-y-2 border border-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 grid grid-cols-4 gap-1.5">
                        <div className={`h-1 rounded-full ${strengthScore >= 1 ? 'bg-[#FF4422]' : 'bg-[#152640]'}`} />
                        <div className={`h-1 rounded-full ${strengthScore >= 2 ? 'bg-[#FFB020]' : 'bg-[#152640]'}`} />
                        <div className={`h-1 rounded-full ${strengthScore >= 3 ? 'bg-[#00B4D8]' : 'bg-[#152640]'}`} />
                        <div className={`h-1 rounded-full ${strengthScore >= 4 ? 'bg-[#22C55E]' : 'bg-[#152640]'}`} />
                      </div>
                      <span className="font-mono text-[10px] text-[#8a97a8] shrink-0">
                        {strengthScore <= 1 ? '弱' : strengthScore === 2 ? '一般' : strengthScore === 3 ? '良好' : '强'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-[#8a97a8]">
                      <div className="flex items-center gap-1">
                        {hasMinLength ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                        <span>至少 8 位字符</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasUpperLower ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                        <span>包含大小写字母</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasNumber ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                        <span>包含数字</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasSymbol ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <Circle className="w-3 h-3 text-[#5c697a]" />}
                        <span>包含特殊符号</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Confirm Password Input */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                  <Lock className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="确认密码"
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

              {/* 5. Role Selection (2x2 Radio Grid) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-[#8a97a8] block font-medium">
                  选择在团队中的核心职责 (Role):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#152640] border-[#00e0b8] shadow-sm'
                            : 'bg-[#0a1628] border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#e8f0f8] text-xs">{r.name}</span>
                          <span
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: r.domainColor }}
                          />
                        </div>
                        <p className="text-[10px] text-[#8a97a8] leading-tight line-clamp-1">
                          {r.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Terms & Submit Button */}
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 text-[11px] text-[#8a97a8] cursor-pointer hover:text-[#e8f0f8]">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] focus:ring-0"
                  />
                  <span>
                    我已阅读并同意 <strong className="text-[#00e0b8]">《服务条款》</strong> 与 <strong className="text-[#00e0b8]">《隐私政策》</strong>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agreedTerms || simState === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] active:scale-[0.98] text-[#0a1628] font-bold text-xs transition-all cursor-pointer shadow-lg shadow-teal-950/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span>创建账号并进入向导</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
