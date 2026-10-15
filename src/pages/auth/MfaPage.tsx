/**
 * @file: MfaPage.tsx
 * @description: 页面组件：MfaPage
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
  ShieldCheck,
  Smartphone,
  Mail,
  Key,
  Lock,
  ArrowRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import AgentAvatar from '../../components/common/AgentAvatar';
import { AUTH_TOKENS } from '../../tokens';

interface MfaPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_MFA: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/mfa/verify',
  confidenceSource: '智云·守护 (TOTP 动态口令时间漂移容差算法 ±30s) + 短信网关',
  memoryScope: 'session',
  learningSampleSource: 'MFA 登录地理位置漂移与设备指纹风险度量',
  driveModePolicy: '验证通过自动签发 7 天长效 JWT 并重定向至工作台首页',
  stateSwitchConditions: {
    empty: '等待输入 6 位二次认证码态',
    loading: 'TOTP 算法与安全硬件密钥校验中',
    error: '动态验证码错误，提示剩余可尝试次数',
    forbidden: '连续 5 次验证失败，账号触发 15 分钟临时安全锁定',
  },
};

export const MfaPage: React.FC<MfaPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [method, setMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [digits, setDigits] = useState(['8', '3', '0', '1', '9', '2']);
  const [countdown, setCountdown] = useState(58);
  const [simState, setSimState] = useState<ViewState>(viewState);
  const [isVerifying, setIsVerifying] = useState(false);

  const isLocked = simState === 'forbidden';
  const isError = simState === 'error';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (idx: number, val: string) => {
    const updated = [...digits];
    updated[idx] = val.slice(-1);
    setDigits(updated);
    if (val && idx < 5) {
      document.getElementById(`mfa-digit-${idx + 1}`)?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onNavigate('dashboard');
    }, 700);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* Background Purple Glow (智云·守护) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(157, 124, 216, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* State Switcher for Figma Dev Validation */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-20">
        <span className="text-[#5c697a] px-1">状态:</span>
        <button
          type="button"
          onClick={() => setSimState('normal')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            simState === 'normal' ? 'bg-[#9d7cd8] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          正常验证
        </button>
        <button
          type="button"
          onClick={() => setSimState('error')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            simState === 'error' ? 'bg-[#ff4422] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          验证码错
        </button>
        <button
          type="button"
          onClick={() => setSimState('forbidden')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            simState === 'forbidden' ? 'bg-[#ff7a45] text-white font-bold' : 'text-[#8a97a8]'
          }`}
        >
          失败锁定
        </button>
      </div>

      {/* Form Card (Width 440px) */}
      <div
        className="w-full max-w-[440px] rounded-2xl p-5 sm:p-8 border shadow-2xl relative z-10 transition-all duration-200"
        style={{
          backgroundColor: AUTH_TOKENS.formCard,
          borderColor: isLocked ? '#ff4422' : 'rgba(157, 124, 216, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {isLocked ? (
          /* Locked State after 5 consecutive failures */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,68,34,0.15)] text-[#ff4422] flex items-center justify-center mx-auto border border-[#ff4422]/30">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e8f0f8]">验证失败次数过多</h2>
              <p className="text-xs text-[#8a97a8] mt-1.5 leading-relaxed">
                为保全剧目资产，账号已临时锁定 15 分钟。<br />
                剩余锁定时间：<strong className="text-[#ff4422] font-mono text-sm">14:32</strong>
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('auth-locked')}
                className="w-full py-2.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] font-medium text-xs cursor-pointer"
              >
                联系管理员解锁
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="w-full py-2 rounded-lg text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                换个账号登录
              </button>
            </div>
          </div>
        ) : (
          /* Normal MFA Flow */
          <form onSubmit={handleVerify} className="space-y-5">
            {/* Top ShieldCheck in 智云·守护 Purple */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#9d7cd8] text-[#9d7cd8]"
                style={{
                  backgroundColor: 'rgba(157, 124, 216, 0.12)',
                  boxShadow: '0 0 20px rgba(157, 124, 216, 0.3)',
                }}
              >
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#e8f0f8] tracking-tight">二次验证 (MFA)</h1>
                <p className="text-xs text-[#8a97a8] mt-1">
                  账号已开启双重保护，请完成二次验证
                </p>
              </div>
            </div>

            {/* SegmentedTabs: TOTP / SMS / Email */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-xs font-mono">
              <button
                type="button"
                onClick={() => setMethod('totp')}
                className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                  method === 'totp'
                    ? 'bg-[#152640] text-[#00e0b8] font-bold border border-[rgba(0,224,184,0.3)]'
                    : 'text-[#8a97a8] hover:text-white'
                }`}
              >
                动态口令
              </button>
              <button
                type="button"
                onClick={() => setMethod('sms')}
                className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                  method === 'sms'
                    ? 'bg-[#152640] text-[#00e0b8] font-bold border border-[rgba(0,224,184,0.3)]'
                    : 'text-[#8a97a8] hover:text-white'
                }`}
              >
                短信验证
              </button>
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                  method === 'email'
                    ? 'bg-[#152640] text-[#00e0b8] font-bold border border-[rgba(0,224,184,0.3)]'
                    : 'text-[#8a97a8] hover:text-white'
                }`}
              >
                邮箱验证
              </button>
            </div>

            {/* Sub-label based on method */}
            <div className="text-center text-xs text-[#8a97a8]">
              {method === 'totp' && '打开身份验证器 App 获取 6 位动态验证码'}
              {method === 'sms' && '验证码已发送至 138****8888 (58s)'}
              {method === 'email' && '验证码已发送至 di***@0379.email'}
            </div>

            {/* 6-Digit Pure Number OTP Boxes */}
            <div className="space-y-1">
              <div className="grid grid-cols-6 gap-2">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    id={`mfa-digit-${i}`}
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    className={`h-12 rounded-lg bg-[#0a1628] text-center font-mono text-lg font-bold focus:outline-none transition-all ${
                      isError
                        ? 'border-2 border-[#ff4422] text-[#ff4422] animate-shake'
                        : 'border border-[rgba(255,255,255,0.12)] text-[#e8f0f8] focus:border-[#00e0b8] focus:ring-1 focus:ring-[#00e0b8]/40'
                    }`}
                  />
                ))}
              </div>
              {isError && (
                <div className="flex items-center gap-1.5 text-xs text-[#ff4422] pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>验证码错误，还可尝试 4 次</span>
                </div>
              )}
            </div>

            {/* Primary Verify Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40 flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0a1628] border-t-transparent animate-spin" />
                  <span>正在验证...</span>
                </>
              ) : (
                <span>验证并登录</span>
              )}
            </button>

            {/* Backup code & Switch account */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                className="text-[#00e0b8] hover:underline cursor-pointer"
              >
                使用一次性备用码
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth-login')}
                className="text-[#8a97a8] hover:text-white cursor-pointer"
              >
                换个账号登录
              </button>
            </div>

            {/* Bottom 智云·守护 Security Prompt Card */}
            <div className="p-3 rounded-xl bg-[#152640] border border-[rgba(157,124,216,0.2)] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AgentAvatar agentId="zhiyun-shouhu" size="xs" />
                <span className="font-bold text-[#e8f0f8]">智云·守护 安全提示</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#8a97a8] pl-5 list-disc leading-relaxed">
                <li>连续 5 次验证失败将临时锁定账号 15 分钟</li>
                <li>YYC³ 官方工作人员绝不会向您索要二次验证码</li>
                <li>异常 IP 登录将实时触发警报并推送邮件告知</li>
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MfaPage;
